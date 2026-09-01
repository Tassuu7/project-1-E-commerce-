/**
 * Store Operations & Admin Dashboard Controller
 * Clean, Robust, Complete Management Suite
 */

let allCouriers = [];

function getStatusBadge(status) {
  if (status === 'DELIVERED' || status === 'PAID') return 'badge-success';
  if (status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY' || status === 'PROCESSING') return 'badge-info';
  if (status === 'PENDING' || status === 'ASSIGNED_TO_DELIVERY') return 'badge-warning';
  return 'badge-danger';
}

async function loadAdminMetrics() {
  try {
    const res = await APIClient.get('/analytics/metrics');
    if (res.success && res.data) {
      const d = res.data;
      const revEl = document.getElementById('kpi-revenue');
      const ordEl = document.getElementById('kpi-orders');
      const aovEl = document.getElementById('kpi-aov');
      const custEl = document.getElementById('kpi-customers');

      if (revEl) revEl.textContent = `$${d.totalRevenue.toFixed(2)}`;
      if (ordEl) ordEl.textContent = d.totalOrders;
      if (aovEl) aovEl.textContent = `$${d.averageOrderValue.toFixed(2)}`;
      if (custEl) custEl.textContent = d.totalCustomers;
    }
  } catch (err) {
    console.error('Error loading metrics:', err);
  }
}

async function loadAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  try {
    // Fetch couriers list for assignment dropdown
    const courierRes = await APIClient.get('/delivery/personnel');
    if (courierRes.success) allCouriers = courierRes.data || [];

    const res = await APIClient.get('/orders', { limit: 50 });
    if (res.success && res.data) {
      if (res.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">No orders placed yet.</td></tr>';
        return;
      }

      tbody.innerHTML = res.data.map(order => `
        <tr>
          <td>
            <strong>${order.orderNumber}</strong><br>
            <small style="color: #6b7280; font-family: monospace;">Track: ${order.trackingNumber || 'N/A'}</small>
          </td>
          <td>
            <strong>${order.customerName}</strong><br>
            <small style="color: #6b7280;">${order.customerEmail}</small>
          </td>
          <td><strong>$${order.grandTotal.toFixed(2)}</strong></td>
          <td><span class="badge ${getStatusBadge(order.orderStatus)}">${order.orderStatus}</span></td>
          <td>
            ${order.deliveryPersonName ? `
              <span class="badge badge-secondary" style="font-weight: 700;">${order.deliveryPersonName}</span>
            ` : `
              <select style="padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border); font-size: 0.825rem;" onchange="assignCourierToOrder('${order.id}', this.value)">
                <option value="">+ Assign Courier</option>
                ${allCouriers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            `}
          </td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <select style="padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border); font-size: 0.85rem; font-weight: 600;" onchange="updateOrderStatus('${order.id}', this.value)">
              <option value="PAID" ${order.orderStatus === 'PAID' ? 'selected' : ''}>PAID / CONFIRMED</option>
              <option value="PROCESSING" ${order.orderStatus === 'PROCESSING' ? 'selected' : ''}>PROCESSING / PACKED</option>
              <option value="ASSIGNED_TO_DELIVERY" ${order.orderStatus === 'ASSIGNED_TO_DELIVERY' ? 'selected' : ''}>ASSIGNED_TO_DELIVERY</option>
              <option value="OUT_FOR_DELIVERY" ${order.orderStatus === 'OUT_FOR_DELIVERY' ? 'selected' : ''}>OUT_FOR_DELIVERY</option>
              <option value="DELIVERED" ${order.orderStatus === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
              <option value="CANCELLED" ${order.orderStatus === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color: #ef4444; text-align: center; padding: 2rem;">Error: ${err.message}</td></tr>`;
  }
}

async function assignCourierToOrder(orderId, deliveryPersonId) {
  if (!deliveryPersonId) return;
  try {
    const res = await APIClient.post('/delivery/assign', { orderId, deliveryPersonId });
    if (res.success) {
      showToast('Delivery personnel assigned! Courier notified.', 'success');
      await loadAdminOrders();
    }
  } catch (err) {
    showToast(err.message || 'Failed to assign delivery', 'danger');
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await APIClient.patch(`/orders/${orderId}/status`, { status: newStatus, note: 'Updated by store administrator' });
    if (res.success) {
      showToast(`Order status updated to ${newStatus}`, 'success');
      await loadAdminOrders();
      await loadAdminMetrics();
    }
  } catch (err) {
    showToast(err.message || 'Failed to update order status', 'danger');
  }
}

async function loadAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  try {
    const res = await APIClient.get('/products', { limit: 100 });
    if (res.success && res.data) {
      tbody.innerHTML = res.data.map(p => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${(p.images && p.images[0]) || '/images/placeholder.svg'}" style="width: 44px; height: 44px; object-fit: contain; background: #fff; padding: 2px; border-radius: var(--radius-sm); border: 1px solid var(--border);" onerror="this.onerror=null; this.src='/images/placeholder.svg';">
              <div>
                <strong>${p.name}</strong><br>
                <small style="color: #6b7280; font-family: monospace;">SKU: ${p.sku}</small>
              </div>
            </div>
          </td>
          <td><span class="badge badge-secondary">${p.category}</span></td>
          <td><strong>$${(p.effectivePrice || p.price).toFixed(2)}</strong></td>
          <td>
            <span class="badge ${p.stock <= 10 ? 'badge-danger' : 'badge-success'}">${p.stock} units</span>
          </td>
          <td>★ ${(p.rating || 4.8).toFixed(1)}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: #ef4444; text-align: center; padding: 2rem;">Error: ${err.message}</td></tr>`;
  }
}

async function handleCreateProduct(e) {
  e.preventDefault();
  const name = document.getElementById('new-prod-name').value;
  const category = document.getElementById('new-prod-category').value;
  const price = parseFloat(document.getElementById('new-prod-price').value);
  const stock = parseInt(document.getElementById('new-prod-stock').value, 10);
  const sku = document.getElementById('new-prod-sku').value;
  const image = document.getElementById('new-prod-image').value;
  const description = document.getElementById('new-prod-desc').value;

  try {
    const res = await APIClient.post('/products', {
      name,
      category,
      price,
      stock,
      sku,
      images: [image],
      description
    });
    if (res.success) {
      showToast('Product created successfully!', 'success');
      closeAddProductModal();
      await loadAdminProducts();
    }
  } catch (err) {
    showToast(err.message || 'Failed to create product', 'danger');
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const res = await APIClient.delete(`/products/${productId}`);
    if (res.success) {
      showToast('Product deleted', 'info');
      await loadAdminProducts();
    }
  } catch (err) {
    showToast(err.message || 'Failed to delete product', 'danger');
  }
}

function openAddProductModal() {
  const m = document.getElementById('add-product-modal');
  if (m) m.classList.add('active');
}

function closeAddProductModal() {
  const m = document.getElementById('add-product-modal');
  if (m) m.classList.remove('active');
}
