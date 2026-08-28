/**
 * Inventory Stock Allocation Unit Tests
 * OmniCommerce Enterprise
 */

const InventoryService = require('../src/services/inventoryService');
const { productRepository } = require('../src/repositories');

function testInventoryService() {
  console.log('Testing InventoryService...');

  const prod = productRepository.create({
    name: 'Test Gadget',
    category: 'Electronics',
    price: 99.99,
    stock: 10
  });

  const checkResult = InventoryService.checkStockAvailability([{ productId: prod.id, quantity: 5 }]);
  console.assert(checkResult.allAvailable === true, 'Expected stock check to be available for 5 units');

  const reserveResult = InventoryService.reserveStock([{ productId: prod.id, quantity: 5 }]);
  console.assert(reserveResult.success === true, 'Expected stock reservation to succeed');

  const updatedProd = productRepository.findById(prod.id);
  console.assert(updatedProd.stock === 5, `Expected stock to be 5 after reservation, got ${updatedProd.stock}`);

  console.log('InventoryService unit tests PASSED!');
}

module.exports = testInventoryService;
