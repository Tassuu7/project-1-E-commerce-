/**
 * Storefront Catalog - Clean, Natural, Human-Centric Script
 */

let allProducts = [];
let selectedCategory = 'ALL';

async function loadCategories() {
  const container = document.getElementById('category-pills-container');
  if (!container) return;

  try {
    const res = await APIClient.get('/products/categories');
    if (res.success && res.data) {
      const categories = res.data;
      container.innerHTML = `
        <button class="category-pill-btn ${selectedCategory === 'ALL' ? 'active' : ''}" onclick="filterByCategory('ALL', this)">
          All Items
        </button>
        ${categories.map(c => `
          <button class="category-pill-btn ${selectedCategory === c.name ? 'active' : ''}" onclick="filterByCategory('${c.name}', this)">
            ${c.name}
          </button>
        `).join('')}
      `;
    }
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('catalog-count-text');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #6b7280;">
      <p>Loading items...</p>
    </div>
  `;

  const searchQuery = document.getElementById('search-input')?.value || '';
  const sortBy = document.getElementById('sort-select')?.value || 'newest';

  try {
    const res = await APIClient.get('/products', {
      category: selectedCategory,
      search: searchQuery,
      sortBy: sortBy,
      limit: 40
    });

    if (res.success && res.data) {
      allProducts = res.data;
      if (countEl) {
        countEl.textContent = `Showing ${allProducts.length} items`;
      }
      renderProductGrid(allProducts);
    }
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #ef4444;">
        <p>Could not load items: ${err.message}</p>
      </div>
    `;
  }
}

function renderProductGrid(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 5rem 2rem; background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-lg);">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem;">No items found</h3>
        <p style="color: #6b7280; font-size: 0.95rem; margin-bottom: 1.5rem;">Try searching for something else or browse all categories.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">View All Items</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const priceVal = typeof p.effectivePrice === 'number' ? p.effectivePrice : (typeof p.salePrice === 'number' ? p.salePrice : (p.price || 0));
    const originalPrice = typeof p.price === 'number' ? p.price : 0;
    const hasDiscount = p.salePrice && p.salePrice < originalPrice;
    const ratingVal = typeof p.rating === 'number' ? p.rating : 4.8;
    const reviewsVal = typeof p.reviewCount === 'number' ? p.reviewCount : 24;
    const isOutOfStock = p.stock <= 0;
    const imgUrl = (p.images && p.images[0]) || '/images/placeholder.svg';

    return `
      <div class="product-card">
        <div class="product-img-wrapper">
          ${hasDiscount ? `<span class="product-tag-sale">Sale</span>` : ''}
          <a href="/product.html?id=${p.id}" style="display: block; width: 100%; height: 100%;">
            <img src="${imgUrl}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='/images/placeholder.svg';">
          </a>
        </div>

        <div class="product-body">
          <span class="product-cat">${p.category || 'General'}</span>
          <h3 class="product-name" title="${p.name}">
            <a href="/product.html?id=${p.id}">${p.name}</a>
          </h3>

          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-count">${ratingVal.toFixed(1)} (${reviewsVal})</span>
          </div>

          <div class="product-price-box">
            <span class="price-current">$${priceVal.toFixed(2)}</span>
            ${hasDiscount ? `<span class="price-original">$${originalPrice.toFixed(2)}</span>` : ''}
          </div>

          <button class="btn-add-cart" onclick="CartManager.addItem('${p.id}')" ${isOutOfStock ? 'disabled' : ''}>
            ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterByCategory(categoryName, btnElement) {
  selectedCategory = categoryName;

  document.querySelectorAll('.category-pill-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  loadProducts();
}

function handleSearch(query) {
  loadProducts();
}

function resetFilters() {
  selectedCategory = 'ALL';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'newest';

  loadCategories();
  loadProducts();
}
