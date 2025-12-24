export interface ProgramConfig {
  name: string;
  programId: string;
  importantAccounts: string[];
}

export interface SnapshotConfig {
  rpcUrl: string;
  programs: ProgramConfig[];
  outputDir: string;
  snapshotName: string;
}

export interface ValidatorConfig {
  snapshotPath: string;
  ledgerPath: string;
  port?: number;
  faucetPort?: number;
  walRepairMode?: string;
}

export interface AccountData {
  address: string;
  data: Buffer;
  owner: string;
  lamports: number;
}

export interface ProgramSnapshot {
  programId: string;
  accounts: AccountData[];
  timestamp: number;
}
