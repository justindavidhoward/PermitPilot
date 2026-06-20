"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function query(sql) {
    // Use a more robust way to escape quotes for the shell
    const escapedSql = sql.replace(/"/g, '\\"');
    const command = `team-db "${escapedSql}"`;
    try {
        const { stdout, stderr } = await execPromise(command);
        // Ignore Bun warnings/info in stderr
        if (stderr && !stderr.includes('Bun') && stderr.trim().length > 0) {
            console.error('DB Error stderr:', stderr);
        }
        if (!stdout.trim()) {
            return [];
        }
        return JSON.parse(stdout);
    }
    catch (error) {
        console.error('Execution error:', error.message);
        throw error;
    }
}
//# sourceMappingURL=db.js.map