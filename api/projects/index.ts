import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, migrate } from '../_lib/db.js';
import { verifyFirebaseToken, ensureUser, sendAuthAwareError } from '../_lib/auth.js';
import { mapProjectRow } from '../_lib/mappers.js';
import { buildProjectsListQuery, buildProjectsCountQuery, buildCreateProjectQuery } from '../_lib/projects.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await verifyFirebaseToken(req);
    await migrate();
    await ensureUser(token);

    if (req.method === 'GET') {
      const { limit = '20', offset = '0' } = req.query;
      const listQ = buildProjectsListQuery({ userId: token.sub, limit: String(limit), offset: String(offset) });
      const countQ = buildProjectsCountQuery(token.sub);

      const [projects, total] = await Promise.all([
        db.execute(listQ),
        db.execute(countQ),
      ]);

      return res.json({
        projects: projects.rows.map(mapProjectRow),
        total: total.rows[0].count,
      });
    }

    if (req.method === 'POST') {
      const { targetLanguage } = req.body || {};

      if (!targetLanguage) {
        return res.status(400).json({ error: 'targetLanguage is required' });
      }

      const createQ = buildCreateProjectQuery(token.sub, req.body);
      const result = await db.execute(createQ);

      return res.status(201).json({ id: Number(result.lastInsertRowid) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return sendAuthAwareError(res, e);
  }
}

