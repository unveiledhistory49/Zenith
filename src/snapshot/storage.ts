import * as fs from 'fs';
import * as path from 'path';
import { ProgramSnapshot } from './types';

export class SnapshotStorage {
  private outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
    this.ensureDir();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  saveSnapshot(snapshot: ProgramSnapshot, name: string): string {
    const filename = `${name}-${snapshot.programId}-${snapshot.timestamp}.json`;
    const filepath = path.join(this.outputDir, filename);
    const data = {
      ...snapshot,
      accounts: snapshot.accounts.map(acc => ({
        ...acc,
        data: acc.data.toString('base64')
      }))
    };

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return filepath;
  }

  loadSnapshot(filepath: string): ProgramSnapshot {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    return {
      ...data,
      accounts: data.accounts.map((acc: any) => ({
        ...acc,
        data: Buffer.from(acc.data, 'base64')
      }))
    };
  }

  listSnapshots(): string[] {
    return fs.readdirSync(this.outputDir).filter(file => file.endsWith('.json'));
  }

  getSnapshotPath(name: string): string | null {
    const files = this.listSnapshots();
    const match = files.find(file => file.startsWith(name));
    return match ? path.join(this.outputDir, match) : null;
  }
}
