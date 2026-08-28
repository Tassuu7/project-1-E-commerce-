/**
 * Automated Test Runner Suite
 * OmniCommerce Enterprise
 */

const testTaxEngine = require('./taxEngine.test');
const testDiscountEngine = require('./discountEngine.test');
const testOrderStateMachine = require('./orderStateMachine.test');
const testInventoryService = require('./inventoryService.test');

function runAllTests() {
  console.log('====================================================');
  console.log('  Executing OmniCommerce Test Suite...');
  console.log('====================================================\n');

  try {
    testTaxEngine();
    testDiscountEngine();
    testOrderStateMachine();
    testInventoryService();

    console.log('\n====================================================');
    console.log('  ALL TEST SUITES PASSED CLEANLY (4/4)');
    console.log('====================================================');
  } catch (err) {
    console.error('\nTest execution failure:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = runAllTests;
