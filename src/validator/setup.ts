import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { ValidatorConfig } from '../snapshot/types';

export class LocalValidator {
  private process: ChildProcess | null = null;
  private config: ValidatorConfig;

  constructor(config: ValidatorConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.process) {
      throw new Error('Validator already running');
    }

    const ledgerDir = this.config.ledgerPath;
    if (!fs.existsSync(ledgerDir)) {
      fs.mkdirSync(ledgerDir, { recursive: true });
    }

    const args = [
      '--ledger', ledgerDir,
      '--log-level=debug'
    ];

    if (this.config.snapshotPath) {
      args.push('--account-dir', this.config.snapshotPath);
    }

    if (this.config.port) {
      args.push('--rpc-port', this.config.port.toString());
    }

    if (this.config.faucetPort) {
      args.push('--faucet-port', this.config.faucetPort.toString());
    }

    if (this.config.walRepairMode) {
      args.push('--wal-recovery-mode', this.config.walRepairMode);
    }

    this.process = spawn('solana-test-validator', args, {
      stdio: 'pipe'
    });

    this.process.stdout?.on('data', (data) => {
      console.log(`[Validator] ${data}`);
    });

    this.process.stderr?.on('data', (data) => {
      console.error(`[Validator Error] ${data}`);
    });

    this.process.on('close', (code) => {
      console.log(`Validator process exited with code ${code}`);
      this.process = null;
    });

    await this.waitForReady();
  }

  private async waitForReady(): Promise<void> {
    const { Connection } = await import('@solana/web3.js');
    const connection = new Connection(
      `http://127.0.0.1:${this.config.port || 8899}`,
      'confirmed'
    );

    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        await connection.getVersion();
        console.log('Validator is ready!');
        return;
      } catch (error) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Validator failed to start');
  }

  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (this.process) {
        this.process.kill('SIGKILL');
      }
      this.process = null;
    }
  }

  isRunning(): boolean {
    return this.process !== null;
  }
}
