/**
 * Admin Dashboard & Control Panel Manager
 * OmniCommerce Enterprise
 */

async function loadAdminMetrics() {
  const container = document.getElementById('admin-metrics-container');
  if (!container) return;

  try {
    const res = await APIClient.get('/analytics/metrics');
    if (res.success && res.data) {
      const data = res.data;
      container.innerHTML = `
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Gross Revenue</span>
            <span class="metric-trend">+18.4% ↑</span>
          </div>
          <div class="metric-value">$${data.totalRevenue.toFixed(2)}</div>
          <small style="color: var(--text-muted); margin-top: 0.5rem;">Across all sales channels</small>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Total Orders</span>
            <span class="metric-trend">+12.1% ↑</span>
          </div>
          <div class="metric-value">${data.totalOrders}</div>
          <small style="color: var(--text-muted); margin-top: 0.5rem;">Fulfilled & in-transit orders</small>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Total Customers</span>
            <span class="metric-trend">+9.5% ↑</span>
          </div>
          <div class="metric-value">${data.totalCustomers}</div>
          <small style="color: var(--text-muted); margin-top: 0.5rem;">Active customer accounts</small>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Avg Order Value</span>
            <span class="metric-trend">+4.2% ↑</span>
          </div>
          <div class="metric-value">$${data.averageOrderValue.toFixed(2)}</div>
          <small style="color: var(--text-muted); margin-top: 0.5rem;">Per transaction average</small>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to load metrics:', err);
  }
}

async function loadAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  try {
    const res = await APIClient.get('/orders/admin', { limit: 15 });
    if (res.success && res.data) {
      if (res.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No orders recorded in system.</td></tr>';
        return;
      }

      tbody.innerHTML = res.data.map(order => `
        <tr>
          <td>
            <strong>${order.orderNumber}</strong><br>
            <small style="color: var(--text-muted); font-family: monospace;">${order.trackingNumber || 'N/A'}</small>
          </td>
          <td>
            <strong>${order.customerName}</strong><br>
            <small style="color: var(--text-muted);">${order.customerEmail}</small>
          </td>
          <td>
            <strong style="color: var(--primary); font-size: 1rem;">$${order.grandTotal.toFixed(2)}</strong><br>
            <small style="color: var(--text-muted);">${order.items.length} items</small>
          </td>
          <td>
            <span class="badge ${getStatusBadge(order.orderStatus)}">${order.orderStatus}</span>
          </td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
              <option value="PENDING" ${order.orderStatus === 'PENDING' ? 'selected' : ''}>PENDING</option>
              <option value="PAID" ${order.orderStatus === 'PAID' ? 'selected' : ''}>PAID</option>
              <option value="PROCESSING" ${order.orderStatus === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
              <option value="SHIPPED" ${order.orderStatus === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
              <option value="DELIVERED" ${order.orderStatus === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
              <option value="CANCELLED" ${order.orderStatus === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: var(--danger); text-align: center;">Error loading orders: ${err.message}</td></tr>`;
  }
}

function getStatusBadge(status) {
  if (status === 'DELIVERED' || status === 'PAID') return 'badge-success';
  if (status === 'PROCESSING' || status === 'SHIPPED') return 'badge-info';
  if (status === 'PENDING') return 'badge-warning';
  return 'badge-danger';
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await APIClient.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, note: 'Admin updated order status.' })
    });
    if (res.success) {
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadAdminOrders();
      loadAdminMetrics();
    }
  } catch (err) {
    showToast(err.message || 'Failed to update order status', 'danger');
  }
}

async function openAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (modal) modal.classList.add('active');
}

function closeAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (modal) modal.classList.remove('active');
}

async function handleCreateProduct(event) {
  event.preventDefault();
  const form = event.target;
  const name = document.getElementById('new-prod-name').value;
  const category = document.getElementById('new-prod-cat').value;
  const price = parseFloat(document.getElementById('new-prod-price').value);
  const stock = parseInt(document.getElementById('new-prod-stock').value, 10);
  const image = document.getElementById('new-prod-image').value || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
  const description = document.getElementById('new-prod-desc').value;

  try {
    const res = await APIClient.post('/products', {
      name,
      category,
      price,
      stock,
      images: [image],
      description
    });

    if (res.success) {
      showToast(`Product "${name}" created successfully!`, 'success');
      closeAddProductModal();
      form.reset();
      loadAdminMetrics();
    }
  } catch (err) {
    showToast(err.message || 'Failed to create product', 'danger');
  }
}
