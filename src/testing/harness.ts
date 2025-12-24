import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { LocalValidator } from '../validator/setup';
import { SnapshotLoader } from '../validator/loader';
import { SnapshotStorage } from '../snapshot/storage';

export interface TestHarnessConfig {
  snapshotPath: string;
  port?: number;
  ledgerPath?: string;
}

export class TestHarness {
  private validator!: LocalValidator;
  private connection: Connection | null = null;
  private loader: SnapshotLoader;
  private config: TestHarnessConfig;
  private accountDir: string;

  constructor(config: TestHarnessConfig) {
    this.config = config;
    this.loader = new SnapshotLoader('./.validator-data');
    this.accountDir = './.validator-data/accounts';
  }

  async loadSnapshot(): Promise<void> {
    this.accountDir = await this.loader.loadSnapshotFile(this.config.snapshotPath);
  }

  async start(): Promise<void> {
    if (this.accountDir === './.validator-data/accounts') {
      await this.loadSnapshot();
    }
    
    this.validator = new LocalValidator({
      snapshotPath: this.accountDir,
      ledgerPath: this.config.ledgerPath || './.validator-data/ledger',
      port: this.config.port || 8899,
      faucetPort: 9900,
      walRepairMode: 'skip_any_corrupted_record'
    });

    await this.validator.start();
    this.connection = new Connection(
      `http://127.0.0.1:${this.config.port || 8899}`,
      'confirmed'
    );
  }

  async stop(): Promise<void> {
    await this.validator.stop();
    this.connection = null;
  }

  getConnection(): Connection {
    if (!this.connection) {
      throw new Error('Validator not started. Call start() first.');
    }
    return this.connection;
  }

  async getAccount(publicKey: string | PublicKey) {
    const key = typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
    return this.getConnection().getAccountInfo(key);
  }

  async getBalance(publicKey: string | PublicKey): Promise<number> {
    const key = typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
    return this.getConnection().getBalance(key);
  }

  async airdrop(address: string | PublicKey, amount: number): Promise<string> {
    const key = typeof address === 'string' ? new PublicKey(address) : address;
    return this.getConnection().requestAirdrop(key, amount);
  }
}
