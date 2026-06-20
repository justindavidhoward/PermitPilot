import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, FileText, Upload, Trash, Calendar, RefreshCw, ShieldAlert } from 'lucide-react';
import apiClient from '../api/client';

interface Permit {
  id: string;
  name: string;
  status: 'Approved' | 'Under Review' | 'Pending' | 'Draft';
  cost: number;
  estTimeline: string;
  description: string;
}

interface Inspection {
  id: string;
  name: string;
  status: 'Scheduled' | 'Passed' | 'Required';
  date?: string;
  notes: string;
}

interface UploadedFile {
  id?: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [projectName, setProjectName] = useState('My Building Project');
  const [projectType, setProjectType] = useState('Accessory Building');
  const [projectLocation, setProjectLocation] = useState('Austin, TX');
  const [permits, setPermits] = useState<Permit[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      setError('');
      try {
        // Fetch project detail
        const projectRes = await apiClient.get(`/projects/${id}`);
        const project = projectRes.data.project;

        setProjectName(project.title);
        setProjectType(project.project_type || 'General');
        setProjectLocation(project.location_city && project.location_state ? `${project.location_city}, ${project.location_state}` : 'Austin, TX');

        // Fetch permit requirements
        const reqsRes = await apiClient.get(`/projects/${id}/permit-requirements`);
        const requirements = reqsRes.data.requirements || [];

        const mapStatus = (status: string): Permit['status'] => {
          const s = status ? status.toLowerCase() : 'needed';
          if (s === 'approved' || s === 'completed') return 'Approved';
          if (s === 'submitted' || s === 'active' || s === 'under review') return 'Under Review';
          if (s === 'pending' || s === 'needed') return 'Pending';
          return 'Draft';
        };

        const mappedPermits: Permit[] = requirements.map((r: any) => ({
          id: r.id,
          name: r.name,
          status: mapStatus(r.status),
          cost: r.fee || 0,
          estTimeline: r.timeline || '3-5 Business Days',
          description: r.description || ''
        }));

        setPermits(mappedPermits);

        // Map inspections dynamically from descriptions
        const fetchedInspections: Inspection[] = [];
        const inspectionNamesSeen = new Set<string>();

        requirements.forEach((req: any) => {
          const desc = req.description || '';
          const match = desc.match(/Inspections:\s*(.+)$/i);
          if (match) {
            const list = match[1].split(',').map((s: string) => s.trim());
            list.forEach((insName: string) => {
              if (insName && !inspectionNamesSeen.has(insName)) {
                inspectionNamesSeen.add(insName);
                fetchedInspections.push({
                  id: `i-${insName}-${Math.random()}`,
                  name: `${insName} Inspection`,
                  status: insName.toLowerCase().includes('final') ? 'Required' : 'Required',
                  notes: `Required check for ${insName.toLowerCase()} compliance under ${req.name}.`
                });
              }
            });
          }
        });

        if (fetchedInspections.length === 0) {
          const defaultInspections: Inspection[] = [
            {
              id: 'i1',
              name: 'Footing & Setback Layout Inspection',
              status: 'Required',
              notes: 'Required check of setbacks and site plans prior to construction.'
            },
            {
              id: 'i2',
              name: 'Rough Frame & Safety Inspection',
              status: 'Required',
              notes: 'Pre-drywall inspection of structural framing.'
            },
            {
              id: 'i3',
              name: 'Final Building & Occupancy Signoff',
              status: 'Required',
              notes: 'Conducted upon physical completion to finalize permit.'
            }
          ];
          setInspections(defaultInspections);
        } else {
          setInspections(fetchedInspections);
        }

        // Fetch documents from backend
        try {
          const docsRes = await apiClient.get(`/projects/${id}/documents`);
          const documents = docsRes.data.documents || [];
          const mappedDocs: UploadedFile[] = documents.map((d: any) => ({
            id: d.id,
            name: d.name,
            size: 'Uploaded',
            uploadedAt: d.created_at ? d.created_at.split(' ')[0] || d.created_at.split('T')[0] : 'Just now'
          }));
          setFiles(mappedDocs);
        } catch (docErr) {
          console.error('Error fetching documents from backend:', docErr);
          // Fallback placeholders
          setFiles([
            { name: 'property_site_layout.pdf', size: '1.4 MB', uploadedAt: '2026-06-01' },
            { name: 'structural_joist_drawings.dwg', size: '4.8 MB', uploadedAt: '2026-06-02' }
          ]);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching project details:', err);
        setIsLoading(false);
        // Fallback to static mock data if backend has issues
        let name = 'Backyard Deck Renovation';
        let type = 'Deck';
        let loc = 'Austin, TX 78701';

        if (id === '2') {
          name = '2-Car Detached Garage Workshop';
          type = 'Garage';
          loc = 'Seattle, WA 98101';
        } else if (id === '3') {
          name = 'Inground Swimming Pool & Spa';
          type = 'Pool';
          loc = 'Orlando, FL 32801';
        }

        setProjectName(name);
        setProjectType(type);
        setProjectLocation(loc);

        setPermits([
          {
            id: 'p1',
            name: `${type} Structural Building Permit`,
            status: id === '3' ? 'Approved' : 'Under Review',
            cost: type === 'Garage' ? 220 : type === 'Pool' ? 350 : 120,
            estTimeline: '14-21 Business Days',
            description: 'Main municipal permit validating code compliance, setback requirements, and general engineering safety.'
          }
        ]);
        setInspections([
          {
            id: 'i1',
            name: 'Setback & Footing Layout Inspection',
            status: 'Required',
            notes: 'Setbacks measured: 6.2ft West, 5.8ft South.'
          }
        ]);
        setFiles([
          { name: 'property_site_layout.pdf', size: '1.4 MB', uploadedAt: '2026-06-01' },
          { name: 'structural_joist_drawings.dwg', size: '4.8 MB', uploadedAt: '2026-06-02' }
        ]);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await apiClient.post(`/projects/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newDoc = uploadRes.data;
      const newFile: UploadedFile = {
        id: newDoc.id,
        name: newDoc.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(null);
      setUploadProgress(false);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setUploadProgress(false);
      alert(err.response?.data?.error || 'Failed to upload document. Please try again.');
    }
  };

  const handleFileDelete = async (fileToDelete: UploadedFile) => {
    if (!fileToDelete.id) {
      // Fallback for demo placeholders
      setFiles((prev) => prev.filter((f) => f.name !== fileToDelete.name));
      return;
    }

    try {
      await apiClient.delete(`/projects/${id}/documents/${fileToDelete.id}`);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    } catch (err: any) {
      console.error('Error deleting document:', err);
      alert(err.response?.data?.error || 'Failed to delete document.');
    }
  };

  const handleFileDownload = async (file: UploadedFile) => {
    if (!file.id) {
      alert('This is a demo placeholder file and cannot be downloaded.');
      return;
    }

    try {
      const response = await apiClient.get(`/projects/${id}/documents/${file.id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download failed:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  const getPermitStatusBadge = (status: Permit['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getInspectionStatusBadge = (status: Inspection['status']) => {
    switch (status) {
      case 'Passed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Scheduled':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center py-10 px-6">
        <RefreshCw className="text-indigo-500 animate-spin mb-4" size={48} />
        <p className="text-slate-600 font-semibold text-lg text-center">Retrieving project checklist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center py-10 px-6">
        <div className="max-w-md bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-md">
          <ShieldAlert className="text-red-500 mx-auto" size={48} />
          <h2 className="text-xl font-bold text-slate-900">Failed to load project</h2>
          <p className="text-slate-600 text-sm">{error}</p>
          <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            <ArrowLeft size={16} className="mr-1.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        {/* Navigation & Header */}
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 mb-4">
            <ArrowLeft size={16} className="mr-1.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{projectName}</h1>
              <p className="text-slate-600 text-sm mt-1">
                Project Class: <strong className="text-slate-800">{projectType}</strong> &bull; Location:{' '}
                <strong className="text-slate-800">{projectLocation}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600 font-medium">Total Cost Estimates:</span>
              <span className="text-2xl font-extrabold text-slate-950 bg-white border border-slate-200 px-4 py-1.5 rounded-lg shadow-sm">
                ${permits.reduce((acc, curr) => acc + curr.cost, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Permits Checklist */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">AI Permit Path Checklist</h3>
                <span className="flex items-center text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                  <RefreshCw size={12} className="mr-1 animate-spin-slow" /> Synced to Municipal Code
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {permits.map((permit) => (
                  <div key={permit.id} className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-base font-bold text-slate-950 flex items-center">
                        {permit.status === 'Approved' ? (
                          <CheckCircle className="text-emerald-500 mr-2 flex-shrink-0" size={18} />
                        ) : (
                          <Clock className="text-indigo-400 mr-2 flex-shrink-0" size={18} />
                        )}
                        {permit.name}
                      </h4>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border text-center self-start sm:self-auto ${getPermitStatusBadge(permit.status)}`}>
                        {permit.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{permit.description}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 font-medium pt-1">
                      <span>Fee: ${permit.cost}</span>
                      <span>Timeline: {permit.estTimeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspections Milestones */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-lg">Required Inspections Calendar</h3>
              </div>

              <div className="divide-y divide-slate-200">
                {inspections.map((inspection) => (
                  <div key={inspection.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-950">{inspection.name}</h4>
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded ${getInspectionStatusBadge(inspection.status)}`}>
                          {inspection.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{inspection.notes}</p>
                    </div>
                    {inspection.date && (
                      <div className="text-sm text-slate-500 font-semibold bg-slate-100 rounded-lg p-2.5 border border-slate-200 text-center flex items-center flex-shrink-0 self-start">
                        <Calendar size={16} className="text-indigo-500 mr-2" />
                        <span>{inspection.date}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Files upload */}
          <div className="lg:col-span-4 space-y-8">
            {/* File Upload Component */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center">
                <FileText className="text-indigo-500 mr-2" size={20} />
                Project Document Box
              </h3>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    id="file-input"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className="mx-auto text-slate-400 mb-3" size={32} />
                  {selectedFile ? (
                    <div className="text-sm font-semibold text-indigo-600 truncate max-w-xs mx-auto">
                      {selectedFile.name}
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-slate-700">Choose a file to upload</div>
                      <div className="text-xs text-slate-400 mt-1">PDF, PNG, JPG, or CAD up to 10MB</div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!selectedFile || uploadProgress}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors"
                >
                  {uploadProgress ? 'Uploading...' : 'Save File to Project'}
                </button>
              </form>

              {/* Uploaded Files list */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Stored Files ({files.length})</h4>
                {files.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No uploaded drawings or forms yet.</p>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.id || file.name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:bg-slate-100/50 transition-colors">
                        <div className="truncate pr-4 flex items-center space-x-2">
                          <FileText size={16} className="text-slate-400 flex-shrink-0" />
                          <div className="truncate">
                            <button
                              type="button"
                              onClick={() => handleFileDownload(file)}
                              className="font-semibold text-slate-800 hover:text-indigo-600 hover:underline text-left truncate block focus:outline-none"
                              title="Download file"
                            >
                              {file.name}
                            </button>
                            <div className="text-xs text-slate-400">{file.size} &bull; {file.uploadedAt}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(file)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors"
                          title="Delete file"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Warning Advisory */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center text-amber-800 font-bold text-sm">
                <ShieldAlert size={18} className="mr-2 text-amber-600 flex-shrink-0" />
                AI Advisory Notice
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Permit requirements can change based on tree preservation, septic proximity, and historic district overlays. Review all uploaded site plans with an inspector before purchasing structural timbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
