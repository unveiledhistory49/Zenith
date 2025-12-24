import {
  SnapshotFetcher,
  SnapshotStorage,
  KNOWN_PROGRAMS
} from '../src/index';

async function main() {
  console.log('📸 Creating snapshot for Jupiter...\n');

  const fetcher = new SnapshotFetcher('https://api.mainnet-beta.solana.com');
  const storage = new SnapshotStorage('./snapshots');

  const program = KNOWN_PROGRAMS.JUPITER;
  console.log(`Fetching program: ${program.name}`);
  console.log(`Program ID: ${program.programId}\n`);

  console.log('Fetching program account...');
  const programAccount = await fetcher.fetchAccount(program.programId);
  console.log(`✅ Program account: ${programAccount ? 'found' : 'not found'}`);

  if (programAccount) {
    const snapshot = {
      programId: program.programId,
      accounts: [programAccount],
      timestamp: Date.now()
    };

    console.log(`\nSnapshot timestamp: ${new Date(snapshot.timestamp).toISOString()}`);

    const filepath = storage.saveSnapshot(snapshot, 'jupiter');
    console.log(`\n✅ Snapshot saved to: ${filepath}`);
    
    console.log('\n📊 Snapshot stats:');
    console.log(`  - Program ID: ${snapshot.programId}`);
    console.log(`  - Accounts: ${snapshot.accounts.length}`);
    console.log(`  - Size: ${JSON.stringify(snapshot).length} bytes`);
  }
}

main().catch(console.error);
