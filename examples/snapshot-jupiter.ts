import {
  SnapshotFetcher,
  SnapshotStorage,
  KNOWN_PROGRAMS,
  type KnownProgram
} from '../src/index';

async function main() {
  console.log('Creating snapshot for Jupiter...\n');

  const fetcher = new SnapshotFetcher('https://api.mainnet-beta.solana.com');
  const storage = new SnapshotStorage('./snapshots');

  const program = KNOWN_PROGRAMS.JUPITER;
  console.log(`Fetching program: ${program.name}`);
  console.log(`Program ID: ${program.programId}\n`);

  const snapshot = await fetcher.createSnapshot(
    program.programId,
    program.importantAccounts
  );

  console.log(`Fetched ${snapshot.accounts.length} accounts`);
  console.log(`Snapshot timestamp: ${new Date(snapshot.timestamp).toISOString()}\n`);

  const filepath = storage.saveSnapshot(snapshot, 'jupiter');
  console.log(`Snapshot saved to: ${filepath}`);
}

main().catch(console.error);
