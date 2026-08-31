/**
 * OmniStore Fluid Storefront & Live Filtering
 * Ultra-Responsive Full-Screen E-Commerce Engine
 */

let allLoadedProducts = [];
let activeCategory = 'ALL';
let wishlistItems = JSON.parse(localStorage.getItem('omni_wishlist') || '[]');

async function loadCategories() {
  const bubblesContainer = document.getElementById('category-bubbles-list');
  const sidebarContainer = document.getElementById('category-filter-list');

  try {
    const res = await APIClient.get('/products/categories');
    if (res.success && res.data) {
      const categories = res.data;

      // Category Icon map
      const iconMap = {
        'Electronics': '💻',
        'Apparel & Fashion': '👕',
        'Home & Kitchen': '🛋️',
        'Books & Office': '📚',
        'Sports & Fitness': '⚡',
        'Accessories & Travel': '🎒'
      };

      // 1. Render Top Story Bubbles
      if (bubblesContainer) {
        bubblesContainer.innerHTML = `
          <div class="category-bubble-item ${activeCategory === 'ALL' ? 'active' : ''}" onclick="selectCategory('ALL', this)">
            <div class="category-bubble-avatar">✨</div>
            <span class="category-bubble-label">All Collections</span>
          </div>
          ${categories.map(c => `
            <div class="category-bubble-item ${activeCategory === c.name ? 'active' : ''}" onclick="selectCategory('${c.name}', this)">
              <div class="category-bubble-avatar">${iconMap[c.name] || '🏷️'}</div>
              <span class="category-bubble-label">${c.name}</span>
            </div>
          `).join('')}
        `;
      }

      // 2. Render Sidebar Radio Filters
      if (sidebarContainer) {
        sidebarContainer.innerHTML = `
          <label class="filter-option-label">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <input type="radio" name="category" value="ALL" ${activeCategory === 'ALL' ? 'checked' : ''} onchange="onSidebarCategoryChange(this.value)">
              <span>All Categories</span>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-light);">${allLoadedProducts.length || 20}</span>
          </label>
          ${categories.map(c => `
            <label class="filter-option-label">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <input type="radio" name="category" value="${c.name}" ${activeCategory === c.name ? 'checked' : ''} onchange="onSidebarCategoryChange(this.value)">
                <span>${c.name}</span>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-light);">${iconMap[c.name] || '•'}</span>
            </label>
          `).join('')}
        `;
      }
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
    <div style="grid-column: 1/-1; text-align: center; padding: 5rem; color: var(--text-muted);">
      <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛍️</div>
      <strong>Curating store collection...</strong>
    </div>
  `;

  const searchQuery = document.getElementById('header-search-input')?.value || document.getElementById('search-input')?.value || '';
  const sortBy = document.getElementById('sort-select')?.value || 'newest';

  try {
    const res = await APIClient.get('/products', {
      category: activeCategory,
      search: searchQuery,
      sortBy: sortBy,
      limit: 40
    });

    if (res.success && res.data) {
      allLoadedProducts = res.data;
      if (countEl) countEl.textContent = `Showing ${allLoadedProducts.length} curated products`;
      renderProductGrid(allLoadedProducts);
    }
  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; color: var(--danger); text-align: center; padding: 3rem; background: var(--danger-bg); border-radius: var(--radius);">
        <strong>Error loading collection:</strong> ${err.message}
      </div>
    `;
  }
}

function renderProductGrid(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 6rem 2rem; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">No items matched your search</h3>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 1.75rem;">Try refining your keywords or exploring other categories.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const priceVal = typeof p.effectivePrice === 'number' ? p.effectivePrice : (typeof p.salePrice === 'number' ? p.salePrice : (p.price || 0));
    const originalPrice = typeof p.price === 'number' ? p.price : 0;
    const hasDiscount = p.salePrice && p.salePrice < originalPrice;
    const discountAmt = hasDiscount ? Math.round(originalPrice - priceVal) : 0;
    const discountPercent = hasDiscount ? Math.round(((originalPrice - priceVal) / originalPrice) * 100) : 0;
    const ratingVal = typeof p.rating === 'number' ? p.rating : 4.9;
    const reviewsVal = typeof p.reviewCount === 'number' ? p.reviewCount : 42;
    const isOutOfStock = p.stock <= 0;
    const isLowStock = p.stock > 0 && p.stock <= (p.lowStockThreshold || 10);
    const imgUrl = (p.images && p.images[0]) || '/images/placeholder.svg';
    const isWishlisted = wishlistItems.includes(p.id);

    return `
      <div class="product-card-modern">
        <!-- Floating Badges -->
        <div class="card-badges-stack">
          ${hasDiscount ? `<span class="badge-discount-pill">-${discountPercent}% OFF</span>` : ''}
          ${isOutOfStock ? `<span class="badge-stock-pill badge-danger">Sold Out</span>` : (isLowStock ? `<span class="badge-stock-pill badge-warning">Only ${p.stock} Left</span>` : `<span class="badge-stock-pill badge-success">In Stock</span>`)}
        </div>

        <!-- Wishlist Button -->
        <button class="btn-wishlist-float ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}', this)" title="Add to Wishlist">
          ${isWishlisted ? '❤️' : '🤍'}
        </button>

        <!-- Media Image -->
        <div class="card-media-wrapper">
          <a href="/product.html?id=${p.id}" style="width: 100%; height: 100%; display: block;">
            <img src="${imgUrl}" alt="${p.name || 'Product'}" class="card-media-img" loading="lazy" onerror="this.onerror=null; this.src='/images/placeholder.svg';">
          </a>
        </div>

        <!-- Details Body -->
        <div class="card-details-body">
          <span class="card-category-tag">${p.category || 'Lifestyle'}</span>
          <h3 class="card-item-title" title="${p.name}">
            <a href="/product.html?id=${p.id}">${p.name}</a>
          </h3>

          <div class="card-rating-row">
            <div class="card-stars">★★★★★</div>
            <span class="card-reviews-text">${ratingVal.toFixed(1)} (${reviewsVal})</span>
          </div>

          <div class="card-pricing-row">
            <span class="card-current-price">$${priceVal.toFixed(2)}</span>
            ${hasDiscount ? `<span class="card-original-price">$${originalPrice.toFixed(2)}</span>` : ''}
          </div>

          <div class="card-actions-row">
            <button class="btn-add-cart-card" onclick="CartManager.addItem('${p.id}')" ${isOutOfStock ? 'disabled' : ''}>
              <span>${isOutOfStock ? 'Sold Out' : '🛒 Add to Bag'}</span>
            </button>
            <a href="/product.html?id=${p.id}" class="btn-quick-details" title="View details">View</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectCategory(categoryName, element) {
  activeCategory = categoryName;

  // Update bubble active state
  document.querySelectorAll('.category-bubble-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');

  // Sync sidebar radio
  const radio = document.querySelector(`input[name="category"][value="${categoryName}"]`);
  if (radio) radio.checked = true;

  loadProducts();
}

function onSidebarCategoryChange(categoryName) {
  activeCategory = categoryName;

  // Update top bubbles
  document.querySelectorAll('.category-bubble-item').forEach(el => {
    const label = el.querySelector('.category-bubble-label')?.textContent?.trim();
    if (categoryName === 'ALL' && label === 'All Collections') {
      el.classList.add('active');
    } else if (label === categoryName) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  loadProducts();
}

function handleLiveSearch(query) {
  const sidebarInput = document.getElementById('search-input');
  if (sidebarInput && sidebarInput.value !== query) {
    sidebarInput.value = query;
  }
  loadProducts();
}

function toggleWishlist(productId, btnEl) {
  const index = wishlistItems.indexOf(productId);
  if (index > -1) {
    wishlistItems.splice(index, 1);
    btnEl.innerHTML = '🤍';
    btnEl.classList.remove('active');
    showToast('Removed from your wishlist', 'info');
  } else {
    wishlistItems.push(productId);
    btnEl.innerHTML = '❤️';
    btnEl.classList.add('active');
    showToast('❤️ Saved to your wishlist!', 'success');
  }
  localStorage.setItem('omni_wishlist', JSON.stringify(wishlistItems));
}

function resetFilters() {
  activeCategory = 'ALL';
  const headerSearch = document.getElementById('header-search-input');
  if (headerSearch) headerSearch.value = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'newest';

  loadCategories();
  loadProducts();
}

function handleNewsletterSignup(event) {
  event.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput ? emailInput.value.trim() : '';
  if (email) {
    showToast('🎉 Thank you! Check your inbox for your 15% discount code: WELCOME15', 'success');
    if (emailInput) emailInput.value = '';
  }
}
