/**
 * Checkout & Order Processing Manager
 * Clean, Robust, Professional
 */

let checkoutCart = null;

async function initCheckoutPage() {
  const container = document.getElementById('checkout-summary');
  if (!container) return;

  checkoutCart = await CartManager.fetchCart();
  if (!checkoutCart || !checkoutCart.items || checkoutCart.items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Your cart is empty</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Please add items before checking out.</p>
        <a href="/index.html" class="btn btn-primary">Return to Shop</a>
      </div>
    `;
    const formBtn = document.getElementById('submit-order-btn');
    if (formBtn) formBtn.disabled = true;
    return;
  }

  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-summary');
  if (!summaryEl || !checkoutCart) return;

  summaryEl.innerHTML = `
    <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem;">Order Summary (${checkoutCart.itemCount} items)</h3>
    
    <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem; max-height: 280px; overflow-y: auto; padding-right: 0.5rem;">
      ${checkoutCart.items.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${item.image || '/images/placeholder.svg'}" style="width: 48px; height: 48px; object-fit: contain; background: #fff; padding: 2px; border-radius: var(--radius-sm); border: 1px solid var(--border);" onerror="this.onerror=null; this.src='/images/placeholder.svg';">
            <div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${item.name}</strong>
              <div style="font-size: 0.825rem; color: var(--text-muted);">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
          </div>
          <strong style="color: var(--text-main); font-size: 0.95rem;">$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.95rem;">
      <span style="color: var(--text-muted);">Subtotal:</span>
      <strong style="color: var(--text-main);">$${checkoutCart.subtotal.toFixed(2)}</strong>
    </div>

    ${checkoutCart.discountAmount > 0 ? `
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.95rem; color: var(--discount-green);">
      <span>Discount (${checkoutCart.appliedCoupon?.code || 'COUPON'}):</span>
      <strong>-$${checkoutCart.discountAmount.toFixed(2)}</strong>
    </div>` : ''}

    <div style="display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.95rem;">
      <span style="color: var(--text-muted);">Estimated Tax:</span>
      <strong style="color: var(--text-main);">$${checkoutCart.taxAmount.toFixed(2)}</strong>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
      <span style="color: var(--text-muted);">Standard Delivery:</span>
      <strong>${checkoutCart.shippingAmount === 0 ? '<span style="color: var(--discount-green); font-weight: 700;">FREE</span>' : `$${checkoutCart.shippingAmount.toFixed(2)}`}</strong>
    </div>

    <div style="padding-top: 1rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: baseline;">
      <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">Grand Total:</span>
      <span style="font-size: 1.85rem; font-weight: 900; color: var(--text-main);">$${checkoutCart.grandTotal.toFixed(2)}</span>
    </div>
  `;
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const submitBtn = document.getElementById('submit-order-btn');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Order...';
  }

  const payload = {
    cartId: CartManager.getCartId(),
    customerName: formData.get('name'),
    customerEmail: formData.get('email'),
    shippingAddress: {
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      country: 'USA'
    },
    paymentMethod: formData.get('paymentMethod') || 'STRIPE_CREDIT_CARD'
  };

  try {
    const res = await APIClient.post('/orders/checkout', payload);
    if (res.success && res.data) {
      // Clear client cart session
      localStorage.removeItem('omni_cart_id');
      CartManager.updateBadge(0);
      showToast('Order Confirmed! Redirecting to tracking...', 'success');
      setTimeout(() => {
        window.location.href = `/orders.html?orderId=${res.data.id}&confirmed=true`;
      }, 500);
    }
  } catch (err) {
    showToast(err.message || 'Failed to place order', 'danger');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order Now';
    }
  }
}
