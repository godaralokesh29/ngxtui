#!/usr/bin/env node
import { NginxUI } from './ui';

function printUsage(): void {
  console.log(`nginxctl v1.0.0\n\nUsage:\n  sudo nginxctl\n  sudo nginxctl --help\n`);
}

async function main(): Promise<void> {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage();
    return;
  }

  if (process.getuid && process.getuid() !== 0) {
    console.error('This utility must be run with sudo or root privileges.');
    process.exit(1);
  }

  const ui = new NginxUI();
  await ui.run();
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`nginxctl failed: ${message}`);
  process.exit(1);
});
