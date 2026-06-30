import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { CONSTANTS } from './constants';

export class NginxCommands {
  checkNginxInstallation(): boolean {
    try {
      execFileSync(CONSTANTS.NGINX_BINARY, ['-V'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  fetchNginxConfPath(): string {
    try {
      const output = execFileSync(CONSTANTS.NGINX_BINARY, ['-V'], { encoding: 'utf8' });
      const match = output.match(/--conf-path=([^\s]+)/);
      if (match?.[1]) {
        return match[1];
      }
    } catch {
      // fall back to default
    }
    return '/etc/nginx/nginx.conf';
  }

  ensureSitesDirectories(confPath: string): void {
    const baseDir = path.dirname(confPath);
    const availableDir = path.join(baseDir, CONSTANTS.DIR_SITES_AVAILABLE);
    const enabledDir = path.join(baseDir, CONSTANTS.DIR_SITES_ENABLED);

    mkdirSync(availableDir, { recursive: true });
    mkdirSync(enabledDir, { recursive: true });
  }

  resetConfiguration(confPath: string): void {
    writeFileSync(confPath, CONSTANTS.DEFAULT_CONF, 'utf8');
  }

  testConfiguration(): boolean {
    try {
      execFileSync(CONSTANTS.NGINX_BINARY, ['-t'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  reloadNginx(): boolean {
    try {
      execFileSync('systemctl', ['reload', 'nginx'], { stdio: 'ignore' });
      return true;
    } catch {
      try {
        execFileSync('service', ['nginx', 'reload'], { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    }
  }
}
