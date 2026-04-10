export interface ProjectsQueryParams {
  userId: string;
  limit?: string | number;
  offset?: string | number;
}

export function buildProjectsListQuery(params: ProjectsQueryParams): {
  sql: string;
  args: (string | number)[];
} {
  const { userId, limit = '20', offset = '0' } = params;

  const sql = `SELECT p.*, GROUP_CONCAT(t.name) as tag_names
      FROM projects p
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.user_id = ?
      GROUP BY p.id
      ORDER BY p.is_favorite DESC, p.created_at DESC
      LIMIT ? OFFSET ?`;

  return { sql, args: [userId, Number(limit), Number(offset)] };
}

export function buildProjectsCountQuery(userId: string): {
  sql: string;
  args: string[];
} {
  return {
    sql: 'SELECT COUNT(*) as count FROM projects WHERE user_id = ?',
    args: [userId],
  };
}

export interface CreateProjectInput {
  title?: string;
  originalFileName?: string;
  sourceLanguage?: string;
  targetLanguage: string;
  durationMs?: number;
  persoProjectSeq?: number | null;
  persoSpaceSeq?: number | null;
}

export function buildCreateProjectQuery(
  userId: string,
  input: CreateProjectInput,
): { sql: string; args: (string | number | null)[] } {
  const {
    title = '',
    originalFileName = '',
    sourceLanguage = 'auto',
    targetLanguage,
    durationMs = 0,
    persoProjectSeq = null,
    persoSpaceSeq = null,
  } = input;

  return {
    sql: `INSERT INTO projects (user_id, title, original_file_name, source_language, target_language, duration_ms, perso_project_seq, perso_space_seq, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'uploading')`,
    args: [userId, title, originalFileName, sourceLanguage, targetLanguage, durationMs, persoProjectSeq, persoSpaceSeq],
  };
}
