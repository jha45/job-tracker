import { Request, Response } from 'express';
import pool from '../db/pool';
import {
  Application,
  CreateApplicationBody,
  UpdateApplicationBody,
  ApplicationQuery,
  JobType,
  ApplicationStatus,
} from '../types';

const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const getApplications = async (
  req: Request<object, object, object, ApplicationQuery>,
  res: Response
): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIdx = 1;

    if (status && STATUSES.includes(status as ApplicationStatus)) {
      conditions.push(`status = $${paramIdx++}`);
      params.push(status);
    }

    if (search && typeof search === 'string' && search.trim()) {
      conditions.push(
        `(company_name ILIKE $${paramIdx} OR job_title ILIKE $${paramIdx})`
      );
      params.push(`%${search.trim()}%`);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM applications ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    params.push(limitNum, offset);
    const result = await pool.query(
      `SELECT * FROM applications ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      params
    );

    res.json({
      data: result.rows as Application[],
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('getApplications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getApplication = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json({ data: result.rows[0] as Application });
  } catch (err) {
    console.error('getApplication error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createApplication = async (
  req: Request<object, object, CreateApplicationBody>,
  res: Response
): Promise<void> => {
  try {
    const { company_name, job_title, job_type, status, applied_date, notes } = req.body;

    const errors: string[] = [];
    if (!company_name || company_name.trim().length < 2)
      errors.push('company_name must be at least 2 characters');
    if (!job_title || job_title.trim().length === 0)
      errors.push('job_title is required');
    if (!job_type || !JOB_TYPES.includes(job_type))
      errors.push(`job_type must be one of: ${JOB_TYPES.join(', ')}`);
    if (!status || !STATUSES.includes(status))
      errors.push(`status must be one of: ${STATUSES.join(', ')}`);
    if (!applied_date || isNaN(Date.parse(applied_date)))
      errors.push('applied_date must be a valid date');

    if (errors.length > 0) {
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }

    const result = await pool.query(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        company_name.trim(),
        job_title.trim(),
        job_type,
        status,
        applied_date,
        notes?.trim() || null,
      ]
    );

    res.status(201).json({ data: result.rows[0] as Application });
  } catch (err) {
    console.error('createApplication error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateApplication = async (
  req: Request<{ id: string }, object, UpdateApplicationBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await pool.query('SELECT id FROM applications WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    const errors: string[] = [];
    if (updates.company_name !== undefined && updates.company_name.trim().length < 2)
      errors.push('company_name must be at least 2 characters');
    if (updates.job_title !== undefined && updates.job_title.trim().length === 0)
      errors.push('job_title cannot be empty');
    if (updates.job_type !== undefined && !JOB_TYPES.includes(updates.job_type))
      errors.push(`job_type must be one of: ${JOB_TYPES.join(', ')}`);
    if (updates.status !== undefined && !STATUSES.includes(updates.status))
      errors.push(`status must be one of: ${STATUSES.join(', ')}`);
    if (updates.applied_date !== undefined && isNaN(Date.parse(updates.applied_date)))
      errors.push('applied_date must be a valid date');

    if (errors.length > 0) {
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }

    const fields: string[] = [];
    const params: (string | null)[] = [];
    let paramIdx = 1;

    if (updates.company_name !== undefined) {
      fields.push(`company_name = $${paramIdx++}`);
      params.push(updates.company_name.trim());
    }
    if (updates.job_title !== undefined) {
      fields.push(`job_title = $${paramIdx++}`);
      params.push(updates.job_title.trim());
    }
    if (updates.job_type !== undefined) {
      fields.push(`job_type = $${paramIdx++}`);
      params.push(updates.job_type);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramIdx++}`);
      params.push(updates.status);
    }
    if (updates.applied_date !== undefined) {
      fields.push(`applied_date = $${paramIdx++}`);
      params.push(updates.applied_date);
    }
    if (updates.notes !== undefined) {
      fields.push(`notes = $${paramIdx++}`);
      params.push(updates.notes?.trim() || null);
    }

    if (fields.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(id);
    const result = await pool.query(
      `UPDATE applications SET ${fields.join(', ')} WHERE id = $${paramIdx} RETURNING *`,
      params
    );

    res.json({ data: result.rows[0] as Application });
  } catch (err) {
    console.error('updateApplication error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteApplication = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('deleteApplication error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
