import { query } from './db';

export async function runMigrations() {
  console.log('Running database migrations...');

  try {
    query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        location_city TEXT,
        location_state TEXT,
        project_type TEXT,
        project_scope TEXT,
        size TEXT,
        estimated_cost REAL,
        property_details TEXT,
        status TEXT DEFAULT 'draft',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    query(`
      CREATE TABLE IF NOT EXISTS permit_requirements (
        id TEXT PRIMARY KEY,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'needed',
        fee REAL,
        timeline TEXT,
        issuing_department TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        type TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Migrations completed successfully.');
  } catch (error: any) {
    console.error('Migration error:', error.message);
    throw error;
  }
}