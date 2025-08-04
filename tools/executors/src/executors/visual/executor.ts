import { ExecutorContext, runExecutor } from '@nx/devkit';
import pino from 'pino';
import { clearDirectory, downloadSnapshotFromGCSBucket, uploadSnapshotToGCSBucket } from './gcStorageManager';
import { VisualExecutorSchema } from './schema';

const logger = pino({ name: 'visual-executor', level: 'info' });

export default async function runExecutorFn(options: VisualExecutorSchema, context: ExecutorContext) {
  logger.info({ options }, 'Executor started for NvcTools');
  try {
    if (options.updateSnapshots) {
      return await runBaselineReset(options, context);
    }
    return await runVisualComparison(options, context);
  } catch (error) {
    logger.error({ err: error }, 'Executor failed');
    return { success: false };
  }
}

async function runVisualComparison(options: VisualExecutorSchema, context: ExecutorContext) {
  const { gcpBucketName } = options;
  try {
    await downloadSnapshotFromGCSBucket(gcpBucketName, context);

    return await executeE2eTarget(options, context);
  } catch (error) {
    logger.error({ err: error }, 'Visual comparison failed');
    return { success: false };
  }
}

async function runBaselineReset(options: VisualExecutorSchema, context: ExecutorContext) {
  const { gcpBucketName } = options;

  try {
    clearDirectory(context);

    const result = await executeE2eTarget(options, context);

    if (result.success) {
      await uploadSnapshotToGCSBucket(gcpBucketName, context);
      logger.info('Baseline reset and upload succeeded');
    }

    return result;
  } catch (error) {
    logger.error({ err: error }, 'Baseline reset failed');
    return { success: false };
  }
}

function getE2eTarget(context: ExecutorContext) {
  if (!context.projectName) throw new Error('Missing projectName in context');

  return {
    project: context.projectName,
    target: 'e2e',
    configuration: context.configurationName || '',
  };
}

async function executeE2eTarget(options: VisualExecutorSchema, context: ExecutorContext) {
  const e2eTarget = getE2eTarget(context);

  const { gcpBucketName, updateSnapshots, ...e2eOptionsRaw } = options;
  const e2eOptions: Record<string, unknown> = e2eOptionsRaw;
  if (updateSnapshots) {
    e2eOptions['update-snapshots'] = updateSnapshots;
  }

  logger.info({ e2eTarget, e2eOptions }, 'Running e2e visual');
  for await (const result of await runExecutor(e2eTarget, e2eOptions, context)) {
    if (!result.success) {
      logger.error('E2E visual failed');
      return { success: false };
    }
  }
  logger.info('E2E visual succeeded');

  return { success: true };
}
