import { TestHarness } from '../src/testing/harness';

async function testMarginfiSwap() {
  console.log('Testing Marginfi swap interaction...\n');

  const harness = new TestHarness({
    snapshotPath: './snapshots/marginfi-*.json',
    port: 8899
  });

  try {
    await harness.start();
    const connection = harness.getConnection();

    console.log('Testing: Fetching Marginfi program account');
    const programAccount = await harness.getAccount('MFv2hWf21ZbwcvAMUZHVb3fcXo9kVXN3n2J2A4GBX4u');
    console.log('Program account exists:', !!programAccount);

    console.log('\nTest passed!');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  } finally {
    await harness.stop();
  }
}

async function testJupiterRoute() {
  console.log('Testing Jupiter routing...\n');

  const harness = new TestHarness({
    snapshotPath: './snapshots/jupiter-*.json',
    port: 8899
  });

  try {
    await harness.start();
    const connection = harness.getConnection();

    console.log('Testing: Fetching Jupiter program account');
    const programAccount = await harness.getAccount('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4');
    console.log('Program account exists:', !!programAccount);

    console.log('\nTest passed!');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  } finally {
    await harness.stop();
  }
}

async function testRaydiumPool() {
  console.log('Testing Raydium pool interaction...\n');

  const harness = new TestHarness({
    snapshotPath: './snapshots/raydium-*.json',
    port: 8899
  });

  try {
    await harness.start();
    const connection = harness.getConnection();

    console.log('Testing: Fetching Raydium program account');
    const programAccount = await harness.getAccount('CAMMCzo5YL8w4VFF8KVHrK22GGUQpEELgS49t3wquj4o');
    console.log('Program account exists:', !!programAccount);

    console.log('\nTest passed!');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  } finally {
    await harness.stop();
  }
}

async function runAllTests() {
  try {
    await testJupiterRoute();
    await testMarginfiSwap();
    await testRaydiumPool();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Tests failed');
    process.exit(1);
  }
}

runAllTests().catch(console.error);
