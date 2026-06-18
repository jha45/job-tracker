import pool from './pool';

const migrate = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TYPE job_type_enum AS ENUM ('Internship', 'Full-time', 'Part-time');
    `);

    await client.query(`
      CREATE TYPE application_status_enum AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        job_type job_type_enum NOT NULL,
        status application_status_enum NOT NULL DEFAULT 'Applied',
        applied_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
      CREATE TRIGGER update_applications_updated_at
        BEFORE UPDATE ON applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(console.error);
