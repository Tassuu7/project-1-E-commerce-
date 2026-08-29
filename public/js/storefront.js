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
    if (res.success && res.data) {
      let html = `
        <label class="filter-option">
          <input type="radio" name="category" value="ALL" checked onchange="filterProducts()"> 
          <span>All Categories</span>
        </label>
      `;
      for (const cat of res.data) {
        html += `
          <label class="filter-option">
            <input type="radio" name="category" value="${cat.name}" onchange="filterProducts()"> 
            <span>${cat.name}</span>
          </label>
        `;
      }
      container.innerHTML = html;
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('results-count-text');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
      <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⚡</div>
      <strong>Loading enterprise catalog...</strong>
    </div>
  `;

  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'ALL';
  const searchQuery = document.getElementById('search-input')?.value || '';
  const sortBy = document.getElementById('sort-select')?.value || 'newest';

  try {
    const res = await APIClient.get('/products', {
      category: selectedCategory,
      search: searchQuery,
      sortBy: sortBy,
      limit: 30
    });

    if (res.success && res.data) {
      currentProducts = res.data;
      if (countEl) countEl.textContent = `Showing ${currentProducts.length} premium products`;
      renderProductGrid(currentProducts);
    }
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; color: var(--danger); text-align: center; padding: 3rem; background: var(--danger-bg); border-radius: var(--radius);">
        <strong>Error loading products:</strong> ${err.message}
      </div>
    `;
  }
}

function renderProductGrid(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 5rem 2rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border);">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">No products match your selection</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Try adjusting your search query or category filter</p>
        <button class="btn btn-secondary btn-sm" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const priceVal = typeof p.effectivePrice === 'number' ? p.effectivePrice : (typeof p.salePrice === 'number' ? p.salePrice : (p.price || 0));
    const originalPrice = typeof p.price === 'number' ? p.price : 0;
    const hasDiscount = p.salePrice && p.salePrice < originalPrice;
    const ratingVal = typeof p.rating === 'number' ? p.rating : 5.0;
    const reviewsVal = typeof p.reviewCount === 'number' ? p.reviewCount : 0;
    const isLowStock = p.stock > 0 && p.stock <= (p.lowStockThreshold || 10);
    const isOutOfStock = p.stock <= 0;
    const imgUrl = (p.images && p.images[0]) || '/images/placeholder.svg';

    return `
      <div class="product-card">
        <div class="product-badges">
          ${hasDiscount ? `<span class="product-badge-sale">SAVE $${(originalPrice - priceVal).toFixed(0)}</span>` : ''}
          ${isOutOfStock ? `<span class="badge badge-danger">Out of Stock</span>` : (isLowStock ? `<span class="badge badge-warning">Only ${p.stock} left</span>` : `<span class="badge badge-success">In Stock</span>`)}
        </div>

        <div class="product-img-wrapper">
          <a href="/product.html?id=${p.id}" style="width: 100%; height: 100%; display: block;">
            <img src="${imgUrl}" alt="${p.name || 'Product'}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='/images/placeholder.svg';">
          </a>
        </div>

        <div class="product-body">
          <span class="product-category">${p.category || 'General'}</span>
          <h3 class="product-title" title="${p.name || ''}">
            <a href="/product.html?id=${p.id}" style="color: inherit;">${p.name || 'Untitled Product'}</a>
          </h3>

          <div class="product-rating">
            <div class="star-rating">★ ★ ★ ★ ★</div>
            <span class="star-rating-count">(${ratingVal.toFixed(1)}) • ${reviewsVal} reviews</span>
          </div>

          <div class="product-price-row">
            <span class="product-price">$${priceVal.toFixed(2)}</span>
            ${hasDiscount ? `<span class="product-old-price">$${originalPrice.toFixed(2)}</span>` : ''}
          </div>

          <div class="product-card-actions">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="CartManager.addItem('${p.id}')" ${isOutOfStock ? 'disabled' : ''}>
              <span>${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <a href="/product.html?id=${p.id}" class="btn btn-secondary btn-sm" title="View details">Details</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterProducts() {
  loadProducts();
}

function resetFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const allCatRadio = document.querySelector('input[name="category"][value="ALL"]');
  if (allCatRadio) allCatRadio.checked = true;
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'newest';
  loadProducts();
}
