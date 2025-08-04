import { execSync } from 'child_process';
import { ExecutorContext } from '@nx/devkit';
import { BrowserstackExecutorSchema } from './schema';

export default async function runExecutor(options: BrowserstackExecutorSchema, context: ExecutorContext) {
  const projectName = context.projectName as string;
  console.log(`[Browserstack executor] Task started for ${projectName}`);

  try {
    const command = `npx browserstack-node-sdk playwright test --config ${options.config}`;
    console.log(`Running command: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    console.error(`Failed to execute command: ${error}`);
    return { success: false };
  }
}
