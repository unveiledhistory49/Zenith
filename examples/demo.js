const fs = require('fs');
const path = require('path');

console.log('🚀 LOCAL-FIRST INTEGRATION TESTING ORCHESTRATOR - DEMO\n');

console.log('='.repeat(60));
console.log('STEP 1: Loading existing snapshot');
console.log('='.repeat(60));

const snapshotPath = './snapshots/jupiter-simple.json';

console.log(`\n📂 Loading snapshot from: ${snapshotPath}`);
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

console.log(`\n📊 Snapshot Info:`);
console.log(`   Program ID: ${snapshot.programId}`);
console.log(`   Accounts: ${snapshot.accounts.length}`);
console.log(`   Timestamp: ${new Date(snapshot.timestamp).toISOString()}`);

console.log('\n' + '='.repeat(60));
console.log('STEP 2: Creating validator account files');
console.log('='.repeat(60));

const accountDir = './.validator-data/accounts';
if (!fs.existsSync(accountDir)) {
  fs.mkdirSync(accountDir, { recursive: true });
}

snapshot.accounts.forEach(account => {
  const filePath = path.join(accountDir, `${account.address}.json`);
  const accountData = {
    lamports: account.lamports,
    data: account.data || '',
    owner: account.owner,
    executable: false
  };
  fs.writeFileSync(filePath, JSON.stringify(accountData, null, 2));
});

console.log(`\n✅ Validator account directory: ${accountDir}`);
console.log(`   📄 Account files created:`);

const accountFiles = fs.readdirSync(accountDir);
accountFiles.forEach(file => {
  const filePath = path.join(accountDir, file);
  const stats = fs.statSync(filePath);
  console.log(`      - ${file} (${stats.size} bytes)`);
});

console.log('\n' + '='.repeat(60));
console.log('STEP 3: Test Harness API Demo');
console.log('='.repeat(60));

console.log(`\n💡 A developer would now run:
`);
console.log(`   const harness = new TestHarness({
     snapshotPath: '${snapshotPath}',
     port: 8899
   });

   await harness.start();  // Spawns solana-test-validator
   
   const connection = harness.getConnection();
   
   // Run your integration tests here...
   const account = await harness.getAccount('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4');
   console.log('Account exists:', !!account);
   
   await harness.stop();  // Clean shutdown
`);

console.log('\n' + '='.repeat(60));
console.log('STEP 4: Workflow Summary');
console.log('='.repeat(60));

console.log(`
🎯 Developer Workflow:
   1. Fetch: Snapshot program state from mainnet (one-time setup)
   2. Commit: Save snapshot to repo or CI/CD cache
   3. Test: Run deterministic local tests with pre-loaded state
   4. Ship: No more flaky devnet tests!

💰 Benefits:
   - Fast: Local validator starts in seconds
   - Deterministic: Same state every test run
   - Real: Actual mainnet program accounts
   - Simple: No complex mocks needed

📦 What just happened:
   ✓ Loaded Jupiter snapshot
   ✓ Converted to validator format
   ✓ Ready for testing
`);

console.log('='.repeat(60));
console.log('✅ DEMO COMPLETE');
console.log('='.repeat(60));
