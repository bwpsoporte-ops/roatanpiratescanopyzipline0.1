import { NextResponse } from 'next/server';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { audit, db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api-response';

export const runtime = 'nodejs';

const allowedTypes = new Map<string, { extension: string; kind: 'image' | 'video'; maxBytes: number }>([
  ['image/jpeg', { extension: 'jpg', kind: 'image', maxBytes: 20 * 1024 * 1024 }],
  ['image/png', { extension: 'png', kind: 'image', maxBytes: 20 * 1024 * 1024 }],
  ['image/webp', { extension: 'webp', kind: 'image', maxBytes: 20 * 1024 * 1024 }],
  ['image/gif', { extension: 'gif', kind: 'image', maxBytes: 20 * 1024 * 1024 }],
  ['image/avif', { extension: 'avif', kind: 'image', maxBytes: 20 * 1024 * 1024 }],
  ['video/mp4', { extension: 'mp4', kind: 'video', maxBytes: 200 * 1024 * 1024 }],
  ['video/webm', { extension: 'webm', kind: 'video', maxBytes: 200 * 1024 * 1024 }],
  ['video/quicktime', { extension: 'mov', kind: 'video', maxBytes: 200 * 1024 * 1024 }]
]);

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Missing media file' }, { status: 400 });
    const config = allowedTypes.get(file.type);
    if (!config) return NextResponse.json({ error: 'Unsupported image or video format' }, { status: 415 });
    if (file.size > config.maxBytes) return NextResponse.json({ error: `${config.kind === 'video' ? 'Video' : 'Image'} is too large` }, { status: 413 });

    const directory = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    await mkdir(directory, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomUUID()}.${config.extension}`;
    const storageKey = `uploads/gallery/${filename}`;
    const publicUrl = `/${storageKey}`;
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    const result = await db.query<{ id: string }>(
      `INSERT INTO media_assets
       (kind,storage_provider,storage_key,public_url,original_name,mime_type,byte_size,uploaded_by)
       VALUES ($1,'local',$2,$3,$4,$5,$6,$7) RETURNING id`,
      [config.kind, storageKey, publicUrl, file.name.slice(0, 255), file.type, file.size, user.id]
    );
    await audit(user.id, 'uploaded', 'media_asset', result.rows[0].id, { kind: config.kind, byteSize: file.size });
    return NextResponse.json({ id: result.rows[0].id, url: publicUrl, type: config.kind }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const { id } = await request.json() as { id?: string };
    if (!id) return NextResponse.json({ error: 'Missing media id' }, { status: 400 });
    const result = await db.query<{ storage_provider: string; storage_key: string }>(
      `UPDATE media_assets SET deleted_at=now()
       WHERE id=$1 AND deleted_at IS NULL
       RETURNING storage_provider, storage_key`,
      [id]
    );
    const asset = result.rows[0];
    if (!asset) return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    if (asset.storage_provider === 'local') {
      const mediaRoot = path.resolve(process.cwd(), 'public', 'uploads', 'gallery');
      const target = path.resolve(process.cwd(), 'public', asset.storage_key);
      if (target.startsWith(`${mediaRoot}${path.sep}`)) await unlink(target).catch(() => undefined);
    }
    await audit(user.id, 'deleted', 'media_asset', id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
