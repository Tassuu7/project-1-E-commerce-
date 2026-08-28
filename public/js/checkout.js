/**
 * Multi-step Checkout UI & Order Submission Manager
 * OmniCommerce Enterprise
 */

let checkoutCart = null;

async function initCheckoutPage() {
  const container = document.getElementById('checkout-summary');
  if (!container) return;

  checkoutCart = await CartManager.fetchCart();
  if (!checkoutCart || checkoutCart.items.length === 0) {
    alert('Your cart is empty! Redirecting to storefront.');
    window.location.href = '/index.html';
    return;
  }

  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-summary');
  if (!summaryEl || !checkoutCart) return;

  summaryEl.innerHTML = `
    <h3>Order Summary (${checkoutCart.itemCount} items)</h3>
    <ul style="list-style: none; margin: 1rem 0; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
      ${checkoutCart.items.map(item => `
        <li style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>${item.name} x ${item.quantity}</span>
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        </li>
      `).join('')}
    </ul>
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span>Subtotal:</span> <strong>$${checkoutCart.subtotal.toFixed(2)}</strong>
    </div>
    ${checkoutCart.discountAmount > 0 ? `
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--success-color);">
      <span>Discount (${checkoutCart.appliedCoupon?.code}):</span> <strong>-$${checkoutCart.discountAmount.toFixed(2)}</strong>
    </div>` : ''}
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span>Estimated Tax:</span> <strong>$${checkoutCart.taxAmount.toFixed(2)}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
      <span>Shipping Fee:</span> <strong>$${checkoutCart.shippingAmount.toFixed(2)}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 1rem; font-size: 1.2rem; font-weight: 700;">
      <span>Grand Total:</span> <strong style="color: var(--primary-color);">$${checkoutCart.grandTotal.toFixed(2)}</strong>
    </div>
  `;
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const payload = {
    cartId: CartManager.getCartId(),
    customerName: formData.get('name'),
    customerEmail: formData.get('email'),
    shippingAddress: {
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      country: formData.get('country') || 'USA'
    },
    paymentMethod: formData.get('paymentMethod')
  };

  try {
    const res = await APIClient.post('/orders/checkout', payload);
    if (res.success) {
      alert(`Order Placed Successfully! Order Number: ${res.data.orderNumber}`);
      window.location.href = `/orders.html?orderId=${res.data.id}`;
    }
  } catch (err) {
    alert(err.message || 'Failed to place order.');
  }
}
