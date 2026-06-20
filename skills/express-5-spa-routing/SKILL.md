---
name: express-5-spa-routing
description: Setting up a 100% robust catch-all route for React SPAs in modern Express 5.0 projects that bypasses path-to-regexp syntax/version compilation errors.
---

# Express 5 SPA Routing Catch-All

## Context & Problem
In older versions of Express, a common pattern to serve a Single Page Application (SPA) index file for all routes (to support client-side routing and page refreshes) was:
```javascript
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});
```
Or:
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});
```

However, Express 5.0 (and modern environments using `path-to-regexp` v8/v9 under the hood) has deprecated/removed un-named wildcards or un-parameterized regular expression wildcards. Running the above code in modern environments will crash with:
- `PathError [TypeError]: Unexpected ( at index 0: (.*)`
- `PathError [TypeError]: Missing parameter name at index 1: *`

## Robust Solution
Rather than fighting `path-to-regexp` configuration syntax (which varies depending on the minor version of Express and path-to-regexp), use a generic Express middleware (`app.use`) placed at the very end of the routing file. This completely bypasses `path-to-regexp` compilation and works on all Express versions.

### Implementation:
```typescript
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const frontendDistPath = '/home/team/shared/frontend/dist';

// 1. Serve static built assets normally
app.use(express.static(frontendDistPath));

// 2. Define API and other specific routes...
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 3. Catch-all fallback middleware for React SPA Routing (must be placed at the END of the middleware/routing chain)
app.use((req: Request, res: Response, next: NextFunction) => {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return next();
  }
  // Let api and health routes fall through so they return standard 404/500 errors
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  // Send the SPA index.html for all other page refreshes/routes
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});
```

### Why this is better:
1. **Zero Path Compilation:** Because it uses `app.use` without a path selector, Express does not parse it via `path-to-regexp`, preventing any version-related `PathError`.
2. **Method Filtering:** By explicitly checking `req.method === 'GET'`, we ensure API requests like `POST`, `PUT`, `DELETE` to incorrect endpoints are handled correctly (e.g. 404 API responses rather than receiving a 200 SPA `index.html` file).
3. **API Path Exclusion:** We automatically skip SPA routing fallback for requests that are clearly API-focused (`/api/*`), allowing standard API error handling to function properly.
