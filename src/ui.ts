import chalk from 'chalk';
import { prompt } from 'enquirer';
import path from 'path';
import { NginxCommands } from './commands';
import { ConfigGenerator } from './generators';

export class NginxUI {
  private readonly commands = new NginxCommands();
  private readonly generator = new ConfigGenerator();

  async run(): Promise<void> {
    console.log(chalk.cyan.bold('nginxctl - Nginx Configuration Manager'));

    const response = await prompt<{ choice: string }>({
      type: 'select',
      name: 'choice',
      message: 'Choose an action',
      choices: [
        'Reset configuration',
        'Create API reverse proxy',
        'Create static site config',
        'Exit',
      ],
    });

    switch (response.choice) {
      case 'Reset configuration':
        await this.handleReset();
        break;
      case 'Create API reverse proxy':
        await this.handleApiConfig();
        break;
      case 'Create static site config':
        await this.handleStaticConfig();
        break;
      default:
        console.log('Goodbye.');
    }
  }

  private async handleReset(): Promise<void> {
    const confPath = this.commands.fetchNginxConfPath();
    this.commands.resetConfiguration(confPath);
    console.log(chalk.green('Configuration reset.'));
    if (this.commands.testConfiguration()) {
      console.log(chalk.green('Nginx test passed.'));
      this.commands.reloadNginx();
    }
  }

  private async handleApiConfig(): Promise<void> {
    const answers = await prompt<{
      projectName: string;
      port: number;
      domain: string;
    }>([
      { type: 'input', name: 'projectName', message: 'Project name' },
      { type: 'numeral', name: 'port', message: 'Local port' },
      { type: 'input', name: 'domain', message: 'Domain name' },
    ]);

    const confPath = this.commands.fetchNginxConfPath();
    this.commands.ensureSitesDirectories(confPath);
    this.generator.generateApiConfig(answers.projectName, answers.port, answers.domain, path.dirname(confPath));
    console.log(chalk.green('API config created.'));
    if (this.commands.testConfiguration()) {
      console.log(chalk.green('Nginx test passed.'));
      this.commands.reloadNginx();
    }
  }

  private async handleStaticConfig(): Promise<void> {
    const answers = await prompt<{
      projectName: string;
      domain: string;
      rootPath: string;
    }>([
      { type: 'input', name: 'projectName', message: 'Project name' },
      { type: 'input', name: 'domain', message: 'Domain name' },
      { type: 'input', name: 'rootPath', message: 'Static root path' },
    ]);

    const confPath = this.commands.fetchNginxConfPath();
    this.commands.ensureSitesDirectories(confPath);
    this.generator.generateStaticConfig(answers.projectName, answers.domain, answers.rootPath, path.dirname(confPath));
    console.log(chalk.green('Static config created.'));
    if (this.commands.testConfiguration()) {
      console.log(chalk.green('Nginx test passed.'));
      this.commands.reloadNginx();
    }
  }
}
