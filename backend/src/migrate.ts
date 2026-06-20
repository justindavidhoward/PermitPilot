import { query, getDatabaseUrl } from './db';

export async function runMigrations() {
  console.log('Running database migrations...');

  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        location_city TEXT,
        location_state TEXT,
        project_type TEXT,
        project_scope TEXT,
        size TEXT,
        estimated_cost NUMERIC,
        property_details TEXT,
        status TEXT DEFAULT 'draft',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Permit Requirements table
    await query(`
      CREATE TABLE IF NOT EXISTS permit_requirements (
        id UUID PRIMARY KEY,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'needed',
        fee NUMERIC,
        timeline TEXT,
        issuing_department TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Documents table
    await query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        type TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Subscriptions table
    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Migrations completed successfully.');
  } catch (error: any) {
    console.error('Migration error:', error.message);
    // Don't throw if we're not using Postgres, as these SQL statements might fail on team-db
    // but the task says "run on startup IF using PostgreSQL"
    if (getDatabaseUrl()) {
       throw error;
    }
  }
}
