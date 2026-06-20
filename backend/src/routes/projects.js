"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all projects for current user
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const projects = await (0, db_1.query)(`SELECT * FROM projects WHERE user_id = '${req.user?.id}'`);
        res.json({ projects });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
// Create a new project
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { title, description, location_city, location_state, project_type } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const id = (0, uuid_1.v4)();
        await (0, db_1.query)(`INSERT INTO projects (id, user_id, title, description, location_city, location_state, project_type) 
                 VALUES ('${id}', '${req.user?.id}', '${title}', '${description || ''}', '${location_city || ''}', '${location_state || ''}', '${project_type || ''}')`);
        res.status(201).json({ id, title, message: 'Project created successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map