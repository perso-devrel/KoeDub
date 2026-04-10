import { describe, it, expect } from 'vitest';
import {
  buildProjectsListQuery,
  buildProjectsCountQuery,
  buildCreateProjectQuery,
} from './projects';

describe('buildProjectsListQuery', () => {
  it('builds query with defaults', () => {
    const { sql, args } = buildProjectsListQuery({ userId: 'u1' });
    expect(sql).toContain('WHERE p.user_id = ?');
    expect(sql).toContain('ORDER BY p.is_favorite DESC, p.created_at DESC');
    expect(sql).toContain('LIMIT ? OFFSET ?');
    expect(args).toEqual(['u1', 20, 0]);
  });

  it('uses custom limit and offset', () => {
    const { args } = buildProjectsListQuery({ userId: 'u2', limit: '10', offset: '30' });
    expect(args).toEqual(['u2', 10, 30]);
  });

  it('coerces numeric limit/offset', () => {
    const { args } = buildProjectsListQuery({ userId: 'u3', limit: 5, offset: 15 });
    expect(args).toEqual(['u3', 5, 15]);
  });

  it('handles NaN limit/offset as 0', () => {
    const { args } = buildProjectsListQuery({ userId: 'u4', limit: 'abc', offset: 'xyz' });
    expect(args).toEqual(['u4', NaN, NaN]);
  });

  it('joins with tags via GROUP_CONCAT', () => {
    const { sql } = buildProjectsListQuery({ userId: 'u1' });
    expect(sql).toContain('GROUP_CONCAT(t.name) as tag_names');
    expect(sql).toContain('LEFT JOIN project_tags');
    expect(sql).toContain('LEFT JOIN tags');
  });

  it('groups by project id', () => {
    const { sql } = buildProjectsListQuery({ userId: 'u1' });
    expect(sql).toContain('GROUP BY p.id');
  });
});

describe('buildProjectsCountQuery', () => {
  it('builds count query for user', () => {
    const { sql, args } = buildProjectsCountQuery('u1');
    expect(sql).toBe('SELECT COUNT(*) as count FROM projects WHERE user_id = ?');
    expect(args).toEqual(['u1']);
  });
});

describe('buildCreateProjectQuery', () => {
  it('builds insert with all fields', () => {
    const { sql, args } = buildCreateProjectQuery('u1', {
      title: 'Test',
      originalFileName: 'video.mp4',
      sourceLanguage: 'ja',
      targetLanguage: 'en',
      durationMs: 60000,
      persoProjectSeq: 42,
      persoSpaceSeq: 7,
    });
    expect(sql).toContain('INSERT INTO projects');
    expect(sql).toContain("'uploading'");
    expect(args).toEqual(['u1', 'Test', 'video.mp4', 'ja', 'en', 60000, 42, 7]);
  });

  it('uses defaults for optional fields', () => {
    const { args } = buildCreateProjectQuery('u1', { targetLanguage: 'ko' });
    expect(args).toEqual(['u1', '', '', 'auto', 'ko', 0, null, null]);
  });

  it('preserves null for perso seq fields', () => {
    const { args } = buildCreateProjectQuery('u1', {
      targetLanguage: 'en',
      persoProjectSeq: null,
      persoSpaceSeq: null,
    });
    expect(args[6]).toBeNull();
    expect(args[7]).toBeNull();
  });

  it('preserves explicit zero duration', () => {
    const { args } = buildCreateProjectQuery('u1', {
      targetLanguage: 'en',
      durationMs: 0,
    });
    expect(args[5]).toBe(0);
  });

  it('sets status to uploading', () => {
    const { sql } = buildCreateProjectQuery('u1', { targetLanguage: 'en' });
    expect(sql).toContain("'uploading'");
  });
});
