/**
 * Inventory Stock Allocation Unit Tests
 * OmniCommerce Enterprise
 */

const InventoryService = require('../src/services/inventoryService');
const { productRepository } = require('../src/repositories');

function testInventoryService() {
  console.log('Testing InventoryService...');

  const prod = productRepository.create({
    name: 'Temporary Test Fixture Gadget',
    category: 'Electronics',
    price: 99.99,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80']
  });

  const checkResult = InventoryService.checkStockAvailability([{ productId: prod.id, quantity: 5 }]);
  console.assert(checkResult.allAvailable === true, 'Expected stock check to be available for 5 units');

  const reserveResult = InventoryService.reserveStock([{ productId: prod.id, quantity: 5 }]);
  console.assert(reserveResult.success === true, 'Expected stock reservation to succeed');

  const updatedProd = productRepository.findById(prod.id);
  console.assert(updatedProd.stock === 5, `Expected stock to be 5 after reservation, got ${updatedProd.stock}`);

  // Clean up fixture after test
  productRepository.delete(prod.id);

  console.log('InventoryService unit tests PASSED!');
}

module.exports = testInventoryService;
