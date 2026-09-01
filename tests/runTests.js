/**
 * Master Test Runner Suite
 * OmniCommerce Enterprise
 */

const { spawn } = require('child_process');
const testTaxEngine = require('./taxEngine.test');
const testDiscountEngine = require('./discountEngine.test');
const testOrderStateMachine = require('./orderStateMachine.test');
const testInventoryService = require('./inventoryService.test');

async function runAllTests() {
  console.log('======================================================================');
  console.log('  Executing OmniCommerce Complete Test Suite...');
  console.log('======================================================================\n');

  try {
    // 1. Run Domain Unit Tests
    console.log('--- [1/2] Domain Engine Unit Tests ---');
    testTaxEngine();
    testDiscountEngine();
    testOrderStateMachine();
    testInventoryService();
    console.log('  [PASS] All 4 Domain Engine Unit Suites Passed Cleanly.\n');

    // 2. Run Comprehensive End-to-End Workflow & Security Tests
    console.log('--- [2/2] End-to-End Lifecycle & Security Tests ---');
    require('./e2e-workflow.test');

  } catch (err) {
    console.error('\nTest execution failure:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = runAllTests;
