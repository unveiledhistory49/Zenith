import * as fs from 'fs';
import * as path from 'path';
import { ProgramSnapshot } from '../snapshot/types';

export class SnapshotLoader {
  private outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
  }

  loadSnapshotForValidator(snapshot: ProgramSnapshot): string {
    const accountDir = path.join(this.outputDir, 'accounts');
    if (!fs.existsSync(accountDir)) {
      fs.mkdirSync(accountDir, { recursive: true });
    }

    snapshot.accounts.forEach(account => {
      this.writeAccountFile(accountDir, account);
    });

    return accountDir;
  }

  private writeAccountFile(
    dir: string,
    account: { address: string; data: Buffer; lamports: number; owner: string }
  ): void {
    const filePath = path.join(dir, `${account.address}.json`);
    const accountData = {
      lamports: account.lamports,
      data: account.data.toString('base64'),
      owner: account.owner,
      executable: false
    };

    fs.writeFileSync(filePath, JSON.stringify(accountData, null, 2));
  }

  loadMultipleSnapshots(snapshots: ProgramSnapshot[]): string {
    const accountDir = path.join(this.outputDir, 'accounts');
    if (!fs.existsSync(accountDir)) {
      fs.mkdirSync(accountDir, { recursive: true });
    }

    snapshots.forEach(snapshot => {
      this.loadSnapshotForValidator(snapshot);
    });

    return accountDir;
  }

  async loadSnapshotFile(snapshotPath: string): Promise<string> {
    const { SnapshotStorage } = await import('../snapshot/storage');
    
    const storage = new SnapshotStorage(path.dirname(snapshotPath));
    const snapshot = storage.loadSnapshot(snapshotPath);
    
    return this.loadSnapshotForValidator(snapshot);
  }
}
