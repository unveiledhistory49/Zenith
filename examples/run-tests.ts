import { TestHarness } from '../src/testing/harness';

async function main() {
  console.log('Starting test harness with Jupiter snapshot...\n');

  const harness = new TestHarness({
    snapshotPath: './snapshots/jupiter-JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4-[timestamp].json',
    port: 8899
  });

  try {
    await harness.start();
    console.log('Validator is running!\n');

    const connection = harness.getConnection();
    const version = await connection.getVersion();
    console.log('RPC Version:', version['solana-core']);

    const balance = await harness.getBalance('11111111111111111111111111111111');
    console.log('System program balance:', balance);

    console.log('\nYou can now write your tests here!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await harness.stop();
    console.log('\nValidator stopped.');
  }
}

main().catch(console.error);
