/**
 * Admin Dashboard UI Controller
 * OmniCommerce Enterprise
 */

async function loadAdminMetrics() {
  const container = document.getElementById('admin-metrics-container');
  if (!container) return;

  try {
    const res = await APIClient.get('/analytics/metrics');
    if (res.success) {
      const data = res.data;
      container.innerHTML = `
        <div class="metric-card">
          <div class="metric-title">Total Revenue</div>
          <div class="metric-value">$${data.totalRevenue.toFixed(2)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Total Orders</div>
          <div class="metric-value">${data.totalOrders}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Customers</div>
          <div class="metric-value">${data.totalCustomers}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Avg Order Value</div>
          <div class="metric-value">$${data.averageOrderValue.toFixed(2)}</div>
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
    const res = await APIClient.get('/orders/admin', { limit: 10 });
    if (res.success) {
      tbody.innerHTML = res.data.map(order => `
        <tr>
          <td><strong>${order.orderNumber}</strong></td>
          <td>${order.customerName} (${order.customerEmail})</td>
          <td>$${order.grandTotal.toFixed(2)}</td>
          <td><span class="badge badge-${getStatusBadge(order.orderStatus)}">${order.orderStatus}</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <select onchange="updateOrderStatus('${order.id}', this.value)">
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
    console.error('Failed to load orders:', err);
  }
}

function getStatusBadge(status) {
  if (status === 'DELIVERED' || status === 'PAID') return 'success';
  if (status === 'PROCESSING' || status === 'SHIPPED') return 'info';
  if (status === 'PENDING') return 'warning';
  return 'danger';
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await APIClient.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, note: 'Updated from admin portal.' })
    });
    if (res.success) {
      alert(`Order status updated to ${newStatus}`);
      loadAdminOrders();
      loadAdminMetrics();
    }
  } catch (err) {
    alert(err.message || 'Failed to update order status');
  }
}
