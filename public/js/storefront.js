/**
 * Storefront Catalog UI & Interactive Filtering
 * OmniCommerce Enterprise
 */

let currentProducts = [];

async function loadCategories() {
  const container = document.getElementById('category-filter-list');
  if (!container) return;

  try {
    const res = await APIClient.get('/products/categories');
    if (res.success) {
      let html = `<label class="filter-option"><input type="radio" name="category" value="ALL" checked onchange="filterProducts()"> All Categories</label>`;
      for (const cat of res.data) {
        html += `<label class="filter-option"><input type="radio" name="category" value="${cat.name}" onchange="filterProducts()"> ${cat.name}</label>`;
      }
      container.innerHTML = html;
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading products...</div>';

  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'ALL';
  const searchQuery = document.getElementById('search-input')?.value || '';
  const sortBy = document.getElementById('sort-select')?.value || 'newest';

  try {
    const res = await APIClient.get('/products', {
      category: selectedCategory,
      search: searchQuery,
      sortBy: sortBy,
      limit: 20
    });

    if (res.success) {
      currentProducts = res.data;
      renderProductGrid(currentProducts);
    }
  } catch (err) {
    grid.innerHTML = `<div style="grid-column: 1/-1; color: var(--danger-color); text-align: center;">Error loading products: ${err.message}</div>`;
  }
}

function renderProductGrid(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No products found matching criteria.</div>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.images[0] || 'https://via.placeholder.com/300x200?text=Product'}" alt="${p.name}" class="product-img">
      <div class="product-body">
        <span class="product-category">${p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <div class="product-rating">★ ${p.rating.toFixed(1)} (${p.reviewCount} reviews)</div>
        <div class="product-price">$${p.effectivePrice.toFixed(2)} ${p.salePrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem;">$${p.price.toFixed(2)}</span>` : ''}</div>
        <div style="margin-top: auto; display: flex; gap: 0.5rem;">
          <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="CartManager.addItem('${p.id}')">Add to Cart</button>
          <a href="/product.html?id=${p.id}" class="btn btn-secondary btn-sm">Details</a>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts() {
  loadProducts();
}
