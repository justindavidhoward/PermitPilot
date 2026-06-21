import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { determinePermits, ProjectDetails } from '../engine/permitEngine';
import { EmailService } from '../notifications/emailService';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define store path
const uploadDir = '/home/team/shared/uploads/';

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name keeping original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

const router = Router();

// Get all projects for current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await query(`SELECT * FROM projects WHERE user_id = '${req.user?.id}'`);
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a specific project
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await query(`SELECT * FROM projects WHERE id = '${req.params.id}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project: projects[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get permit requirements for a project
router.get('/:id/permit-requirements', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const requirements = await query(`SELECT * FROM permit_requirements WHERE project_id = '${projectId}'`);
    res.json({ requirements });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permit requirements' });
  }
});

// Create a new project
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, location_city, location_state, project_type, project_scope, size, estimated_cost, property_details } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const id = uuidv4();
    await query(`INSERT INTO projects (id, user_id, title, description, location_city, location_state, project_type, project_scope, size, estimated_cost, property_details) 
                 VALUES ('${id}', '${req.user?.id}', '${title}', '${description || ''}', '${location_city || ''}', '${location_state || ''}', '${project_type || ''}', '${project_scope || ''}', '${size || ''}', ${estimated_cost || 0}, '${property_details || ''}')`);

    res.status(201).json({ id, title, message: 'Project created successfully' });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Determine permits for a project
router.post('/:id/determine-permits', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];
    const details: ProjectDetails = {
      project_type: project.project_type || '',
      location_city: project.location_city || '',
      location_state: project.location_state || '',
      project_scope: project.project_scope || project.description || '',
      size: project.size,
      estimated_cost: project.estimated_cost,
      property_details: project.property_details
    };

    const requirements = await determinePermits(details);

    // Clear existing requirements for this project
    await query(`DELETE FROM permit_requirements WHERE project_id = '${projectId}'`);

    // Insert new requirements
    for (const reqmt of requirements) {
      const reqId = uuidv4();
      const forms = JSON.stringify(reqmt.forms_needed);
      const inspections = JSON.stringify(reqmt.required_inspections);
      
      // Note: We're adding some extra info into the description or we could expand the table schema.
      // Current table schema for permit_requirements: id, project_id, name, description, status, fee, timeline
      const fullDescription = `${reqmt.description}\n\nForms: ${reqmt.forms_needed.join(', ')}\nInspections: ${reqmt.required_inspections.join(', ')}`;
      
      await query(`INSERT INTO permit_requirements (id, project_id, name, description, status, fee, timeline, issuing_department) 
                   VALUES ('${reqId}', '${projectId}', '${reqmt.name}', '${fullDescription.replace(/'/g, "''")}', 'needed', ${reqmt.fees}, '${reqmt.estimated_timeline}', '${reqmt.issuing_department}')`);
    }

    // Update project status
    await query(`UPDATE projects SET status = 'analyzed', updated_at = CURRENT_TIMESTAMP WHERE id = '${projectId}'`);

    // Send checklist ready email
    if (req.user?.email) {
      try {
        await EmailService.sendChecklistReadyEmail(req.user.email, project.title);
      } catch (emailError) {
        console.error('Failed to queue checklist ready email:', emailError);
      }
    }

    res.json({ 
      message: 'Permits determined successfully', 
      project_id: projectId,
      requirements 
    });
  } catch (error) {
    console.error('Determine permits error:', error);
    res.status(500).json({ error: 'Failed to determine permits' });
  }
});

// GET /api/projects/:id/documents — list documents for a project
router.get('/:id/documents', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    // Check if project exists and belongs to user
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const documents = await query(`SELECT * FROM documents WHERE project_id = '${projectId}'`);
    res.json({ documents });
  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /api/projects/:id/documents — multipart file upload
router.post('/:id/documents', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    // Check if project exists and belongs to user
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const docId = uuidv4();
    const name = req.file.originalname;
    const filePath = req.file.path; // absolute path
    const type = req.file.mimetype; // e.g. application/pdf

    await query(`INSERT INTO documents (id, project_id, name, file_path, type) 
                 VALUES ('${docId}', '${projectId}', '${name.replace(/'/g, "''")}', '${filePath.replace(/'/g, "''")}', '${type}')`);

    res.status(201).json({ 
      id: docId, 
      name, 
      type, 
      file_path: filePath,
      message: 'Document uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// DELETE /api/projects/:id/documents/:docId — remove a document
router.delete('/:id/documents/:docId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const docId = req.params.docId;

    // Check if project exists and belongs to user
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if document exists for this project
    const documents = await query(`SELECT * FROM documents WHERE id = '${docId}' AND project_id = '${projectId}'`);
    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = documents[0];

    // Delete from disk
    try {
      if (fs.existsSync(doc.file_path)) {
        fs.unlinkSync(doc.file_path);
      }
    } catch (fsErr) {
      console.error('Error deleting file from disk:', fsErr);
    }

    // Delete from database
    await query(`DELETE FROM documents WHERE id = '${docId}'`);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// GET /api/projects/:id/documents/:docId/download — download a document
router.get('/:id/documents/:docId/download', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const docId = req.params.docId;

    // Check if project exists and belongs to user
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if document exists for this project
    const documents = await query(`SELECT * FROM documents WHERE id = '${docId}' AND project_id = '${projectId}'`);
    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = documents[0];

    if (!fs.existsSync(doc.file_path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(doc.file_path, doc.name);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// PATCH /api/projects/:id/permit-requirements/:reqId — update status
router.patch('/:id/permit-requirements/:reqId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const { id: projectId, reqId } = req.params;

    // Verify project ownership
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get current permit requirement details for the email
    const requirements = await query(`SELECT * FROM permit_requirements WHERE id = '${reqId}' AND project_id = '${projectId}'`);
    if (!requirements || requirements.length === 0) {
      return res.status(404).json({ error: 'Permit requirement not found' });
    }

    const requirement = requirements[0];

    // Update status
    await query(`UPDATE permit_requirements SET status = '${status}', updated_at = CURRENT_TIMESTAMP WHERE id = '${reqId}'`);

    // Trigger notification if status changed
    if (status !== requirement.status && req.user?.email) {
      try {
        await EmailService.sendStatusUpdateEmail(req.user.email, projects[0].title, requirement.name, status);
      } catch (emailError) {
        console.error('Failed to queue status update email:', emailError);
      }
    }

    res.json({ message: 'Status updated successfully', status });
  } catch (error) {
    console.error('Update permit status error:', error);
    res.status(500).json({ error: 'Failed to update permit status' });
  }
});

// GET /api/projects/:id/inspections — list inspections
router.get('/:id/inspections', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    // Verify project ownership
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const inspections = await query(`SELECT * FROM inspections WHERE project_id = '${projectId}'`);
    res.json({ inspections });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspections' });
  }
});

// POST /api/projects/:id/inspections — add an inspection
router.post('/:id/inspections', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const { name, permit_requirement_id, scheduled_at, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Inspection name is required' });
    }

    // Verify project ownership
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const id = uuidv4();
    const reqIdValue = permit_requirement_id ? `'${permit_requirement_id}'` : 'NULL';
    await query(`INSERT INTO inspections (id, project_id, permit_requirement_id, name, status, scheduled_at, notes) 
                 VALUES ('${id}', '${projectId}', ${reqIdValue}, '${name.replace(/'/g, "''")}', 'pending', '${scheduled_at || ''}', '${notes?.replace(/'/g, "''") || ''}')`);

    res.status(201).json({ id, message: 'Inspection added successfully' });
  } catch (error) {
    console.error('Add inspection error:', error);
    res.status(500).json({ error: 'Failed to add inspection' });
  }
});

// PATCH /api/projects/:id/inspections/:inspectionId — update inspection
router.patch('/:id/inspections/:inspectionId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId, inspectionId } = req.params;
    const { status, scheduled_at, completed_at, notes } = req.body;

    // Verify project ownership
    const projects = await query(`SELECT * FROM projects WHERE id = '${projectId}' AND user_id = '${req.user?.id}'`);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let updateFields = [];
    if (status) updateFields.push(`status = '${status}'`);
    if (scheduled_at) updateFields.push(`scheduled_at = '${scheduled_at}'`);
    if (completed_at) updateFields.push(`completed_at = '${completed_at}'`);
    if (notes) updateFields.push(`notes = '${notes.replace(/'/g, "''")}'`);
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await query(`UPDATE inspections SET ${updateFields.join(', ')} WHERE id = '${inspectionId}' AND project_id = '${projectId}'`);

    res.json({ message: 'Inspection updated successfully' });
  } catch (error) {
    console.error('Update inspection error:', error);
    res.status(500).json({ error: 'Failed to update inspection' });
  }
});

export default router;

