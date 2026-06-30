import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

export class ConfigGenerator {
  generateApiConfig(projectName: string, port: number, domain: string, configDir: string): string {
    const fileName = `${projectName}.conf`;
    const outputPath = path.join(configDir, 'sites-available', fileName);
    const content = this.generateApiConfigTemplate(projectName, port, domain);

    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content, 'utf8');
    return outputPath;
  }

  generateStaticConfig(projectName: string, domain: string, rootPath: string, configDir: string): string {
    const fileName = `${projectName}.conf`;
    const outputPath = path.join(configDir, 'sites-available', fileName);
    const content = this.generateStaticConfigTemplate(projectName, domain, rootPath);

    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content, 'utf8');
    return outputPath;
  }

  private generateApiConfigTemplate(projectName: string, port: number, domain: string): string {
    return `server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
`;
  }

  private generateStaticConfigTemplate(projectName: string, domain: string, rootPath: string): string {
    return `server {
    listen 80;
    server_name ${domain};
    root ${rootPath};
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
`;
  }
}
