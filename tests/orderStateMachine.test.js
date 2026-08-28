/**
 * Order Workflow State Machine Unit Tests
 * OmniCommerce Enterprise
 */

const Order = require('../src/models/Order');
const { ORDER_STATUS } = require('../src/config/constants');

function testOrderStateMachine() {
  console.log('Testing Order State Machine...');

  const order = new Order({
    userId: 'user_123',
    grandTotal: 100
  });

  console.assert(order.orderStatus === ORDER_STATUS.PENDING, `Expected initial PENDING status, got ${order.orderStatus}`);

  // Test valid transition PENDING -> PAID
  order.transitionTo(ORDER_STATUS.PAID);
  console.assert(order.orderStatus === ORDER_STATUS.PAID, 'Expected transition to PAID');

  // Test invalid transition PAID -> DELIVERED (skipping processing & shipped)
  let threwError = false;
  try {
    order.transitionTo(ORDER_STATUS.DELIVERED);
  } catch (err) {
    threwError = true;
  }
  console.assert(threwError === true, 'Expected error on illegal status skip transition');

  console.log('Order State Machine unit tests PASSED!');
}

module.exports = testOrderStateMachine;
