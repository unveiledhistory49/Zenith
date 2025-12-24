import { Connection, PublicKey } from '@solana/web3.js';
import { AccountData, ProgramSnapshot } from './types';

export class SnapshotFetcher {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  async fetchAccount(address: string): Promise<AccountData | null> {
    try {
      const publicKey = new PublicKey(address);
      const accountInfo = await this.connection.getAccountInfo(publicKey);

      if (!accountInfo) {
        return null;
      }

      return {
        address,
        data: Buffer.from(accountInfo.data),
        owner: accountInfo.owner.toBase58(),
        lamports: accountInfo.lamports
      };
    } catch (error) {
      console.error(`Failed to fetch account ${address}:`, error);
      return null;
    }
  }

  async fetchProgramAccounts(programId: string): Promise<AccountData[]> {
    try {
      const publicKey = new PublicKey(programId);
      const accounts = await this.connection.getProgramAccounts(publicKey, {
        encoding: 'base64'
      });

      return accounts.map(({ account, pubkey }) => ({
        address: pubkey.toBase58(),
        data: Buffer.from(account.data as Buffer | Uint8Array),
        owner: account.owner.toBase58(),
        lamports: account.lamports
      }));
    } catch (error) {
      console.error(`Failed to fetch program accounts for ${programId}:`, error);
      return [];
    }
  }

  async createSnapshot(
    programId: string,
    importantAccounts: string[]
  ): Promise<ProgramSnapshot> {
    const accounts: AccountData[] = [];

    for (const address of importantAccounts) {
      const accountData = await this.fetchAccount(address);
      if (accountData) {
        accounts.push(accountData);
      }
    }

    const allProgramAccounts = await this.fetchProgramAccounts(programId);
    accounts.push(...allProgramAccounts);

    return {
      programId,
      accounts: accounts.filter((acc, index, self) =>
        index === self.findIndex(a => a.address === acc.address)
      ),
      timestamp: Date.now()
    };
  }
}
