'use strict';
import * as fs from 'fs';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';
import { ExecutorContext } from '@nx/devkit';
import pino from 'pino';

const logger = pino({ name: 'gc-storage-manager', level: 'info' });

function sanitizeProjectName(name: string | undefined): string {
  if (!name) throw new Error('projectName is required');
  if (name.indexOf('\0') !== -1) throw new Error('Invalid projectName: NULL byte detected');
  const sanitized = name.replace(/^(\.\.(\/|\\|$))+/, '');
  if (!/^[\w\-@/]+$/.test(sanitized)) throw new Error('Invalid projectName');
  return sanitized;
}

function getSnapshotLocalPath(context: ExecutorContext) {
  const projectName = sanitizeProjectName(context.projectName);

  return `./apps/${projectName}/test/visual/snapshots`;
}

function getSnapshotGcpPath(context: ExecutorContext) {
  const projectName = sanitizeProjectName(context.projectName);

  return `${projectName}`;
}

export function clearDirectory(context: ExecutorContext) {
  const localDir = getSnapshotLocalPath(context);

  if (!fs.existsSync(localDir)) {
    logger.info({ localDir }, 'Directory does not exist, nothing to clear');
    return;
  }

  logger.info({ localDir }, 'Clearing directory');
  fs.rmSync(localDir, { recursive: true, force: true });
  fs.mkdirSync(localDir, { recursive: true });
  logger.info({ localDir }, 'Directory cleared and recreated');
}

export async function uploadSnapshotToGCSBucket(bucketName: string, context: ExecutorContext) {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  const localDir = getSnapshotLocalPath(context);
  const destinationFolder = getSnapshotGcpPath(context);

  async function uploadDir(dir: string, destPrefix: string) {
    if (!fs.existsSync(dir)) throw new Error(`Directory not found: ${dir}`);

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const uploadPromises: Promise<void>[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const destPath = path.posix.join(destPrefix, entry.name);
      if (entry.isDirectory()) {
        uploadPromises.push(uploadDir(fullPath, destPath));
      } else {
        uploadPromises.push(
          bucket
            .upload(fullPath, { destination: destPath })
            .then(() => logger.info({ fullPath, destPath }, 'Uploaded file to GCP'))
            .catch((err) => logger.error({ err, fullPath, destPath }, 'Failed to upload file to GCP')),
        );
      }
    }
    await Promise.all(uploadPromises);
  }

  try {
    logger.info({ localDir, destinationFolder, bucketName }, 'Uploading directory to GCP');
    await uploadDir(localDir, destinationFolder);
    logger.info('Upload completed');
  } catch (error) {
    logger.error({ err: error }, 'Upload to GCP failed');
    throw error;
  }
}

export async function downloadSnapshotFromGCSBucket(bucketName: string, context: ExecutorContext) {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  const localDir = getSnapshotLocalPath(context);
  const gcpPath = getSnapshotGcpPath(context);

  try {
    logger.info({ bucketName, gcpPath, localDir }, 'Downloading files from GCP');
    const [files] = await bucket.getFiles({ prefix: gcpPath });
    const downloadPromises: Promise<void>[] = [];
    for (const file of files) {
      const relativePath = path.relative(gcpPath, file.name);
      const localPath = path.join(localDir, relativePath);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      downloadPromises.push(
        file
          .download({ destination: localPath })
          .then(() => logger.info({ gcpFile: file.name, localPath }, 'Downloaded file from GCP'))
          .catch((err) => logger.error({ err, gcpFile: file.name, localPath }, 'Failed to download file from GCP')),
      );
    }
    await Promise.all(downloadPromises);
    logger.info('Download completed');
  } catch (error) {
    logger.error({ err: error }, 'Download from GCP failed');
    throw error;
  }
}
