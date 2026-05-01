/* ========================================
   THE ANALYTICS LAB — script.js
   Shared JavaScript: product catalog, cart
   management, and page initializers.

   ⚠️  NO dataLayer.push() calls are made here.
   All analytics tracking is intentionally left
   for YOU to implement via GTM.

   Look for  // 🔵 ANALYTICS HOOK  comments
   throughout this file to know exactly where
   each GA4 ecommerce event should fire.
   ======================================== */


/* ========================================
   PRODUCT CATALOG
   Single source of truth for all products.
   Also mirrored in DOM data-attributes so
   GTM can scrape them without a dataLayer.
   ======================================== */
const PRODUCTS = [
  {
    id:          'pizza_001',
    sku:         'PIZ-001',
    name:        'Truffle Mushroom Pizza',
    price:       24.99,
    category:    'Artisanal Pizza',
    brand:       'The Analytics Lab',
    variant:     '12-inch',
    description: 'An earthy masterpiece featuring hand-foraged wild mushrooms, premium black truffle oil, creamy fontina, and fresh thyme — all on our 48-hour slow-fermented sourdough crust. Pairs perfectly with a light Pinot Noir.',
    image:       'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&h=525&fit=crop&auto=format',
    tags:        ['truffle', 'mushroom', 'vegetarian', 'bestseller'],
    stock:       12,
    rating:      4.9,
    reviews:     312
  },
  {
    id:          'pizza_002',
    sku:         'PIZ-002',
    name:        'Prosciutto & Arugula Pizza',
    price:       22.99,
    category:    'Artisanal Pizza',
    brand:       'The Analytics Lab',
    variant:     '12-inch',
    description: 'Thin-sliced Italian prosciutto di Parma laid over fresh buffalo mozzarella, finished with peppery wild arugula, aged Parmigiano shavings, and a drizzle of extra-virgin olive oil. A true Italian trattoria classic.',
    image:       'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=525&fit=crop&auto=format',
    tags:        ['prosciutto', 'arugula', 'italian'],
    stock:       8,
    rating:      4.7,
    reviews:     198
  },
  {
    id:          'pizza_003',
    sku:         'PIZ-003',
    name:        'Quattro Formaggi Pizza',
    price:       19.99,
    category:    'Artisanal Pizza',
    brand:       'The Analytics Lab',
    variant:     '12-inch',
    description: "A cheese lover's dream: fresh mozzarella, bold gorgonzola, aged pecorino, and smoked scamorza melt together on a perfectly charred Neapolitan-style base. Rich, indulgent, and completely irresistible.",
    image:       'https://images.unsplash.com/photo-1548369937-47519962c11a?w=700&h=525&fit=crop&auto=format',
    tags:        ['cheese', 'vegetarian', 'quattro-formaggi'],
    stock:       15,
    rating:      4.8,
    reviews:     244
  },
  {
    id:          'noodle_001',
    sku:         'NDL-001',
    name:        'Tokyo Tonkotsu Ramen Kit',
    price:       18.99,
    category:    'Gourmet Noodle Kit',
    brand:       'The Analytics Lab',
    variant:     'Serves 2',
    description: 'Craft authentic Tonkotsu ramen at home. Kit includes rich pork-bone broth concentrate, fresh alkaline noodles, chashu pork seasoning blend, nori sheets, soft-boiled egg marinade, and our signature tare. Serves 2.',
    image:       'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&h=525&fit=crop&auto=format',
    tags:        ['ramen', 'japanese', 'tonkotsu', 'bestseller'],
    stock:       20,
    rating:      4.9,
    reviews:     421
  },
  {
    id:          'noodle_002',
    sku:         'NDL-002',
    name:        'Sichuan Dan Dan Noodle Kit',
    price:       16.99,
    category:    'Gourmet Noodle Kit',
    brand:       'The Analytics Lab',
    variant:     'Serves 2',
    description: 'Bring the bold heat of Chengdu to your kitchen. Features hand-rolled thin wheat noodles, Sichuan chili oil, roasted sesame paste, whole Sichuan peppercorns, and a spiced pork topping mix. Serves 2.',
    image:       'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=700&h=525&fit=crop&auto=format',
    tags:        ['sichuan', 'spicy', 'dan-dan', 'chinese'],
    stock:       18,
    rating:      4.6,
    reviews:     176
  },
  {
    id:          'noodle_003',
    sku:         'NDL-003',
    name:        'Black Truffle Pasta Kit',
    price:       21.99,
    category:    'Gourmet Noodle Kit',
    brand:       'The Analytics Lab',
    variant:     'Serves 2',
    description: 'Restaurant-quality tagliatelle at home. Includes house-made bronze-die pasta, silky black truffle cream sauce, 24-month aged Parmigiano-Reggiano, and toasted pine nuts. Ready in under 20 minutes. Serves 2.',
    image:       'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=700&h=525&fit=crop&auto=format',
    tags:        ['truffle', 'pasta', 'italian', 'premium'],
    stock:       10,
    rating:      4.8,
    reviews:     289
  }
];

// Expose catalog globally so GTM Custom JS Variables can access it
window.PRODUCTS = PRODUCTS;


/* ========================================
   CART UTILITIES
   All cart state stored in localStorage.
   Key: 'analytics_lab_cart'
   Value: JSON array of cart item objects.
   ======================================== */

const CART_STORAGE_KEY = 'analytics_lab_cart';

/**
 * Read and parse the cart from localStorage.
 * @returns {Array} Array of cart item objects
 */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    console.warn('[Cart] Failed to parse cart from localStorage:', e);
    return [];
  }
}

/**
 * Persist the cart array to localStorage.
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Total number of items (sum of all quantities) in the cart.
 * @returns {number}
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Cart subtotal before tax and shipping.
 * @returns {number}
 */
function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Add a product to the cart (or increase its quantity).
 *
 * 🔵 ANALYTICS HOOK — add_to_cart
 * Fire a GA4 "add_to_cart" event after this function runs.
 * The full product object and chosen quantity are available here.
 * You can also scrape them from the button that triggered the call:
 *   data-product-id, data-product-name, data-product-price,
 *   data-product-category, data-product-sku, data-product-brand
 *
 * @param {string} productId  - Product ID (e.g. 'pizza_001')
 * @param {number} quantity   - Number of units to add (default: 1)
 * @returns {{ product, quantity }|null}
 */
function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product) {
    console.warn('[Cart] Product not found:', productId);
    return null;
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    // Increment quantity if product already in cart
    cart[existingIndex].quantity += quantity;
  } else {
    // Add new line item — only include fields useful for analytics
    cart.push({
      id:       product.id,
      sku:      product.sku,
      name:     product.name,
      price:    product.price,
      category: product.category,
      brand:    product.brand,
      variant:  product.variant,
      image:    product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartBadge();

  // 🔵 ANALYTICS HOOK — add_to_cart
  // Implement dataLayer.push() here, OR set up a GTM trigger
  // on any click of elements with data-action="add-to-cart".
  // Available data: product (full object), quantity
  console.log(
    '%c[🔵 Analytics Hook] add_to_cart',
    'color: #4A90D9; font-weight: bold;',
    { product_name: product.name, price: product.price, quantity }
  );

  return { product, quantity };
}

/**
 * Remove a product entirely from the cart.
 *
 * 🔵 ANALYTICS HOOK — remove_from_cart
 * Fire a GA4 "remove_from_cart" event when this runs.
 * The removed item's data is in the `removedItem` variable below
 * and in the DOM element with data-action="remove-from-cart".
 *
 * @param {string} productId
 */
function removeFromCart(productId) {
  const cart = getCart();
  const removedItem = cart.find(i => i.id === productId);
  const updatedCart  = cart.filter(i => i.id !== productId);

  saveCart(updatedCart);
  updateCartBadge();

  // 🔵 ANALYTICS HOOK — remove_from_cart
  console.log(
    '%c[🔵 Analytics Hook] remove_from_cart',
    'color: #E17055; font-weight: bold;',
    { product_name: removedItem?.name, price: removedItem?.price, quantity: removedItem?.quantity }
  );
}

/**
 * Update the quantity of a cart line item.
 * If newQuantity ≤ 0, the item is removed instead.
 *
 * @param {string} productId
 * @param {number} newQuantity
 */
function updateCartQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    updateCartBadge();
  }
}

/**
 * Wipe the entire cart (called after a successful purchase).
 */
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
}


/* ========================================
   UI UTILITIES
   ======================================== */

/** Refresh the cart count badge in the navbar */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = getCartCount();
  }
}

/**
 * Show a brief toast notification.
 * @param {string} message  - HTML-safe message string
 */
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id    = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-check">✓</span> ${message}`;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

/**
 * Format a number as a USD price string.
 * @param {number} price
 * @returns {string}  e.g. "$24.99"
 */
function formatPrice(price) {
  return '$' + Number(price).toFixed(2);
}

/**
 * Look up a product by its ID.
 * @param {string} id
 * @returns {object|null}
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Read the 'id' query parameter from the current URL.
 * Used by product.html to know which product to render.
 * @returns {string|null}
 */
function getProductIdFromURL() {
  return new URLSearchParams(window.location.search).get('id');
}

/**
 * Render a star rating string (e.g. "★★★★★ 4.9")
 * @param {number} rating
 * @param {number} reviews
 * @returns {string}
 */
function renderStars(rating, reviews) {
  const full  = Math.floor(rating);
  const stars = '★'.repeat(full) + (rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
  return `<span style="color:#f39c12;font-size:0.9rem;">${stars}</span>
          <span style="color:var(--text-muted);font-size:0.82rem;margin-left:0.3rem;">${rating} (${reviews.toLocaleString()} reviews)</span>`;
}


/* ========================================
   PAGE: HOMEPAGE  (index.html)
   ======================================== */

/**
 * Render the homepage product grids.
 * Called automatically when data-page="home".
 *
 * 🔵 ANALYTICS HOOK — view_item_list
 * Fire after the grids are rendered and visible.
 * Product list data is accessible via:
 *   - #pizza-grid  [data-list-name] and child articles [data-product-*]
 *   - #noodle-grid [data-list-name] and child articles [data-product-*]
 *   - window.PRODUCTS (global JS array)
 */
function initHomePage() {
  const pizzas  = PRODUCTS.filter(p => p.category === 'Artisanal Pizza');
  const noodles = PRODUCTS.filter(p => p.category === 'Gourmet Noodle Kit');

  renderProductGrid('pizza-grid',  pizzas,  'Pizza Collection');
  renderProductGrid('noodle-grid', noodles, 'Noodle Kit Collection');

  // 🔵 ANALYTICS HOOK — view_item_list
  // Both product lists are now rendered and all data attributes are set.
  // Use a GTM DOM Element variable on any [data-product-id] to extract values.
  console.log(
    '%c[🔵 Analytics Hook] view_item_list',
    'color: #00b894; font-weight: bold;',
    { total_products: PRODUCTS.length, lists: ['Pizza Collection', 'Noodle Kit Collection'] }
  );
}

/**
 * Build and inject product card HTML into a grid container.
 * Every card element carries the full set of data-product-* attributes.
 *
 * @param {string} containerId  - DOM id of the grid container
 * @param {Array}  products     - Product objects to render
 * @param {string} listName     - GA4 item_list_name value (set on container)
 */
function renderProductGrid(containerId, products, listName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Set list-level analytics attributes on the grid container
  container.setAttribute('data-list-name', listName);

  container.innerHTML = products.map((p, index) => `
    <article
      class="product-card"
      id="product-card-${p.id}"
      data-product-id="${p.id}"
      data-product-name="${p.name}"
      data-product-category="${p.category}"
      data-product-price="${p.price}"
      data-product-sku="${p.sku}"
      data-product-brand="${p.brand}"
      data-product-variant="${p.variant}"
      data-list-name="${listName}"
      data-list-position="${index + 1}"
      onclick="window.location.href='product.html?id=${p.id}'"
      role="link"
      tabindex="0"
    >
      <!-- Product image -->
      <img
        class="product-card-img"
        src="${p.image}"
        alt="${p.name}"
        loading="lazy"
        onerror="this.style.background='#e9ecef';this.removeAttribute('src')"
      />

      <div class="product-card-body">
        <!-- Category label -->
        <div class="product-card-category">${p.category}</div>

        <!-- Product name — click navigates to product.html?id=... -->
        <h3 class="product-card-name">${p.name}</h3>

        <!-- Short description (truncated via CSS) -->
        <p class="product-card-desc">${p.description}</p>

        <div class="product-card-footer">
          <!-- Price element — data-price attribute for GTM DOM variable -->
          <span class="product-price" data-price="${p.price}">${formatPrice(p.price)}</span>

          <!--
            ADD TO CART BUTTON (card / quick-add)
            Analytics attributes:
              id="add-to-cart-{productId}"
              data-action="add-to-cart"
              data-product-id, name, category, price, sku, brand, variant
            🔵 ANALYTICS HOOK: add_to_cart fires inside addToCart()
          -->
          <button
            class="btn-add-cart"
            id="add-to-cart-${p.id}"
            data-action="add-to-cart"
            data-product-id="${p.id}"
            data-product-name="${p.name}"
            data-product-category="${p.category}"
            data-product-price="${p.price}"
            data-product-sku="${p.sku}"
            data-product-brand="${p.brand}"
            data-product-variant="${p.variant}"
            onclick="handleQuickAddToCart(event, '${p.id}')"
            aria-label="Add ${p.name} to cart"
          >Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Handle the quick "Add to Cart" button on homepage product cards.
 * Stops click from bubbling to the card (which would navigate away).
 *
 * @param {Event}  event
 * @param {string} productId
 */
function handleQuickAddToCart(event, productId) {
  event.stopPropagation(); // Don't navigate to product page

  const result = addToCart(productId, 1); // 🔵 add_to_cart fires inside here
  if (!result) return;

  // Visual feedback on button
  const btn = event.currentTarget;
  const originalText = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('added');
  }, 2000);

  showToast(`${result.product.name} added to your cart`);
}


/* ========================================
   PAGE: PRODUCT DETAIL  (product.html)
   ======================================== */

/**
 * Populate the product detail page from the URL ?id= parameter.
 * Renders the full product layout with all analytics data-attributes.
 *
 * 🔵 ANALYTICS HOOK — view_item
 * Fire after this function renders the product detail.
 * Product data is available in:
 *   - #product-detail       [data-product-id, name, category, price, sku, brand, variant]
 *   - #add-to-cart-btn      [same data attributes + data-action="add-to-cart"]
 *   - #product-price        [data-price]
 *   - #product-name         [textContent]
 *   - window.currentProduct (JS object, set below)
 *
 * GTM trigger: Page View — URL contains "product.html"
 */
function initProductPage() {
  const productId = getProductIdFromURL();
  const product   = getProductById(productId);
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  // Handle invalid product ID
  if (!product) {
    container.innerHTML = `
      <div style="text-align:center;padding:5rem 2rem;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:1rem;">🤷</div>
        <h2 style="color:var(--primary);margin-bottom:0.5rem;">Product not found</h2>
        <p>That product doesn't exist or may have been removed.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:1.5rem;display:inline-flex;">← Back to Shop</a>
      </div>
    `;
    return;
  }

  // Update <title> and breadcrumb
  document.title = `${product.name} — The Analytics Lab`;
  const bcProduct  = document.getElementById('breadcrumb-product');
  const bcCategory = document.getElementById('breadcrumb-category');
  if (bcProduct)  bcProduct.textContent  = product.name;
  if (bcCategory) {
    bcCategory.textContent = product.category;
    bcCategory.href = product.category.includes('Pizza') ? 'index.html#pizzas' : 'index.html#noodles';
  }

  // Expose product globally for GTM Custom JS Variables
  window.currentProduct = product;

  // Render the full product detail layout
  // Every key field has a matching data-attribute AND a visible DOM element.
  container.innerHTML = `
    <div
      class="product-detail"
      id="product-detail"
      data-product-id="${product.id}"
      data-product-name="${product.name}"
      data-product-category="${product.category}"
      data-product-price="${product.price}"
      data-product-sku="${product.sku}"
      data-product-brand="${product.brand}"
      data-product-variant="${product.variant}"
    >
      <!-- LEFT: Product image -->
      <div>
        <img
          class="product-detail-img"
          id="product-image"
          src="${product.image}"
          alt="${product.name}"
          data-product-id="${product.id}"
          onerror="this.style.background='#e9ecef';this.removeAttribute('src')"
        />
      </div>

      <!-- RIGHT: Product info -->
      <div class="product-detail-info">

        <!-- Category + rating -->
        <div>
          <div class="product-detail-category" id="product-category">${product.category}</div>
          <div style="margin-top:0.3rem;">${renderStars(product.rating, product.reviews)}</div>
        </div>

        <!-- Product name -->
        <h1 class="product-detail-name" id="product-name">${product.name}</h1>

        <!-- Price — data-price attribute used by GTM DOM Variable -->
        <div class="product-detail-price" id="product-price" data-price="${product.price}">
          ${formatPrice(product.price)}
        </div>

        <!-- Description -->
        <p class="product-detail-desc" id="product-description">${product.description}</p>

        <!-- Tags -->
        <div class="product-tags" id="product-tags">
          ${product.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>

        <!-- Quantity selector -->
        <div class="quantity-control">
          <label for="product-quantity">Qty:</label>
          <input
            type="number"
            id="product-quantity"
            class="qty-input"
            value="1"
            min="1"
            max="${product.stock}"
            data-max-stock="${product.stock}"
            aria-label="Quantity"
          />
          <span style="font-size:0.8rem;color:var(--text-muted);">${product.stock} in stock</span>
        </div>

        <!--
          MAIN ADD-TO-CART BUTTON (product detail page)
          Analytics attributes:
            id="add-to-cart-btn"
            data-action="add-to-cart"
            data-product-id, name, category, price, sku, brand, variant
          🔵 ANALYTICS HOOK: add_to_cart fires inside addToCart() called by handleDetailAddToCart()
        -->
        <button
          class="btn-add-cart-detail"
          id="add-to-cart-btn"
          data-action="add-to-cart"
          data-product-id="${product.id}"
          data-product-name="${product.name}"
          data-product-category="${product.category}"
          data-product-price="${product.price}"
          data-product-sku="${product.sku}"
          data-product-brand="${product.brand}"
          data-product-variant="${product.variant}"
          onclick="handleDetailAddToCart('${product.id}')"
        >
          🛒 Add to Cart
        </button>

        <!-- Meta info (SKU, category, stock) -->
        <div class="product-meta">
          <p>SKU: <span id="product-sku">${product.sku}</span></p>
          <p>Brand: <span>${product.brand}</span></p>
          <p>Category: <span>${product.category}</span></p>
        </div>

      </div>
    </div>
  `;

  // 🔵 ANALYTICS HOOK — view_item
  // Product detail is now fully rendered. All data attributes are set.
  // Recommended GTM setup:
  //   Trigger: Page View — URL contains "product.html"
  //   Variable: DOM Element — Element ID "product-detail", Attribute "data-product-id" (and others)
  console.log(
    '%c[🔵 Analytics Hook] view_item',
    'color: #6c5ce7; font-weight: bold;',
    { product_id: product.id, product_name: product.name, price: product.price, category: product.category }
  );
}

/**
 * Handle the main Add-to-Cart button on the product detail page.
 * Reads quantity from #product-quantity input.
 *
 * 🔵 ANALYTICS HOOK: add_to_cart fires inside addToCart() below.
 * @param {string} productId
 */
function handleDetailAddToCart(productId) {
  const qtyInput = document.getElementById('product-quantity');
  const quantity = Math.max(1, parseInt(qtyInput?.value || '1', 10));

  const result = addToCart(productId, quantity); // 🔵 add_to_cart fires here
  if (!result) return;

  // Update the button to give visual feedback
  const btn = document.getElementById('add-to-cart-btn');
  if (btn) {
    btn.textContent = '✓ Added to Cart!';
    btn.style.background = 'var(--success)';
    setTimeout(() => {
      btn.textContent = '🛒 Add to Cart';
      btn.style.background = '';
    }, 2500);
  }

  showToast(`${result.product.name} × ${result.quantity} added to your cart`);
}


/* ========================================
   PAGE: CART  (cart.html)
   ======================================== */

/**
 * Render the full cart page from localStorage data.
 *
 * 🔵 ANALYTICS HOOK — view_cart
 * Fire after this function renders the cart contents.
 * Cart item data is in:
 *   - Each .cart-item element [data-product-id, name, category, price, sku, quantity]
 *   - localStorage key 'analytics_lab_cart' (JSON)
 *   - getCart() JS function (returns array)
 *
 * GTM trigger: Page View — URL contains "cart.html"
 */
function initCartPage() {
  const itemsContainer   = document.getElementById('cart-items-container');
  const summaryContainer = document.getElementById('order-summary-container');
  if (!itemsContainer) return;

  const cart = getCart();

  // Empty state
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-items">
        <div class="cart-empty">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <a href="index.html" class="btn btn-primary" style="margin-top:1.5rem;">Browse Products</a>
        </div>
      </div>
    `;
    if (summaryContainer) summaryContainer.innerHTML = '';
    return;
  }

  // Render cart items
  itemsContainer.innerHTML = `
    <div class="cart-items">
      <div class="cart-header-row">
        Shopping Cart &mdash; <span style="color:var(--text-muted);font-weight:500;">${cart.length} item${cart.length !== 1 ? 's' : ''}</span>
      </div>

      ${cart.map(item => `
        <!--
          CART ITEM ROW
          Analytics: data-product-id, name, category, price, sku, quantity
        -->
        <div
          class="cart-item"
          id="cart-item-${item.id}"
          data-product-id="${item.id}"
          data-product-name="${item.name}"
          data-product-category="${item.category}"
          data-product-price="${item.price}"
          data-product-sku="${item.sku}"
          data-product-brand="${item.brand}"
          data-quantity="${item.quantity}"
        >
          <!-- Item thumbnail -->
          <img
            class="cart-item-img"
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.style.background='#e9ecef';this.removeAttribute('src')"
          />

          <!-- Item details + qty controls -->
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-category">${item.category}</div>

            <div class="cart-item-qty-control">
              <!--
                DECREASE QTY BUTTON
                Analytics: data-action="decrease-qty" + data-product-id
              -->
              <button
                class="qty-btn"
                id="qty-dec-${item.id}"
                data-action="decrease-qty"
                data-product-id="${item.id}"
                onclick="handleQtyChange('${item.id}', -1)"
                aria-label="Decrease quantity"
              >−</button>

              <span class="cart-item-qty-value" id="qty-display-${item.id}">${item.quantity}</span>

              <!--
                INCREASE QTY BUTTON
                Analytics: data-action="increase-qty" + data-product-id
              -->
              <button
                class="qty-btn"
                id="qty-inc-${item.id}"
                data-action="increase-qty"
                data-product-id="${item.id}"
                onclick="handleQtyChange('${item.id}', 1)"
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          <!-- Line item price + remove -->
          <div class="cart-item-right">
            <div class="cart-item-price" id="item-price-${item.id}">
              ${formatPrice(item.price * item.quantity)}
            </div>
            <!--
              REMOVE ITEM BUTTON
              Analytics: data-action="remove-from-cart" + data-product-id
              🔵 ANALYTICS HOOK: remove_from_cart fires inside removeFromCart()
            -->
            <button
              class="cart-item-remove"
              id="remove-${item.id}"
              data-action="remove-from-cart"
              data-product-id="${item.id}"
              data-product-name="${item.name}"
              data-product-price="${item.price}"
              onclick="handleRemoveFromCart('${item.id}')"
            >Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Render order summary sidebar
  renderOrderSummary(cart, summaryContainer);

  // 🔵 ANALYTICS HOOK — view_cart
  // All cart items are now rendered with data attributes.
  // Subtotal is readable from #summary-subtotal textContent or data-subtotal.
  console.log(
    '%c[🔵 Analytics Hook] view_cart',
    'color: #00b894; font-weight: bold;',
    { items: cart.length, subtotal: getCartSubtotal().toFixed(2), currency: 'USD' }
  );
}

/**
 * Build the order summary sidebar with running totals and the checkout button.
 *
 * @param {Array}       cart
 * @param {HTMLElement} container
 */
function renderOrderSummary(cart, container) {
  if (!container) return;

  const subtotal = getCartSubtotal();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax      = subtotal * 0.08;        // 8% tax
  const total    = subtotal + shipping + tax;
  const itemQty  = cart.reduce((s, i) => s + i.quantity, 0);

  container.innerHTML = `
    <div class="order-summary">
      <h3>Order Summary</h3>

      <div class="summary-row">
        <span>Subtotal (${itemQty} item${itemQty !== 1 ? 's' : ''})</span>
        <span id="summary-subtotal" data-subtotal="${subtotal.toFixed(2)}">${formatPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span class="${shipping === 0 ? 'summary-shipping-free' : ''}">
          ${shipping === 0 ? '🎉 FREE' : formatPrice(shipping)}
        </span>
      </div>
      ${shipping > 0 ? `
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.75rem;">
          Add ${formatPrice(50 - subtotal)} more for free shipping
        </div>
      ` : ''}
      <div class="summary-row">
        <span>Estimated Tax (8%)</span>
        <span>${formatPrice(tax)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span id="summary-total" data-total="${total.toFixed(2)}">${formatPrice(total)}</span>
      </div>

      <!--
        CHECKOUT BUTTON
        Analytics attributes:
          id="checkout-btn"
          data-action="begin-checkout"
          data-total, data-currency, data-item-count
        🔵 ANALYTICS HOOK: begin_checkout fires inside handleCheckout()
        GTM Click Trigger: target #checkout-btn or [data-action="begin-checkout"]
      -->
      <button
        class="btn-checkout"
        id="checkout-btn"
        data-action="begin-checkout"
        data-total="${total.toFixed(2)}"
        data-subtotal="${subtotal.toFixed(2)}"
        data-tax="${tax.toFixed(2)}"
        data-shipping="${shipping.toFixed(2)}"
        data-currency="USD"
        data-item-count="${itemQty}"
        onclick="handleCheckout()"
      >
        Proceed to Checkout →
      </button>

      <p class="checkout-note">🔒 Secure checkout &nbsp;·&nbsp; Free 30-day returns</p>
    </div>
  `;
}

/**
 * Increase or decrease a cart item's quantity by `delta`.
 * Re-renders the entire cart page after the change.
 *
 * @param {string} productId
 * @param {number} delta  — +1 or -1
 */
function handleQtyChange(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  updateCartQuantity(productId, item.quantity + delta);
  initCartPage(); // Full re-render
}

/**
 * Remove an item from the cart and re-render the page.
 * 🔵 ANALYTICS HOOK — remove_from_cart fires inside removeFromCart().
 *
 * @param {string} productId
 */
function handleRemoveFromCart(productId) {
  removeFromCart(productId); // 🔵 remove_from_cart fires here
  initCartPage();
}

/**
 * Handle the "Proceed to Checkout" button click.
 * Saves a full order snapshot to localStorage for the success page,
 * then navigates to success.html.
 *
 * 🔵 ANALYTICS HOOK — begin_checkout
 * Fire BEFORE the page navigates away.
 * Best practice: Use a GTM Click trigger on #checkout-btn
 * (data-action="begin-checkout") rather than implementing here,
 * so the event fires before navigation.
 * Available data: data-total, data-currency, data-item-count on #checkout-btn.
 */
function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const subtotal = getCartSubtotal();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  // Persist order snapshot so success.html can read it
  const orderSnapshot = {
    items:     cart,
    subtotal:  subtotal.toFixed(2),
    shipping:  shipping.toFixed(2),
    tax:       tax.toFixed(2),
    total:     total.toFixed(2),
    currency:  'USD',
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('analytics_lab_last_order', JSON.stringify(orderSnapshot));

  // 🔵 ANALYTICS HOOK — begin_checkout
  // The order snapshot is available in localStorage AND on the #checkout-btn data attributes.
  // Recommended: Fire via GTM Click trigger on [data-action="begin-checkout"].
  console.log(
    '%c[🔵 Analytics Hook] begin_checkout',
    'color: #fdcb6e; font-weight: bold;',
    { total: total.toFixed(2), items: cart.length, currency: 'USD' }
  );

  // Navigate to purchase confirmation
  window.location.href = 'success.html';
}


/* ========================================
   PAGE: SUCCESS / THANK YOU  (success.html)
   ======================================== */

/**
 * Render the order confirmation page.
 * Generates a unique transaction ID, displays order items & totals,
 * and attaches all data attributes needed for the GA4 purchase event.
 *
 * 🔵 ANALYTICS HOOK — purchase  (⭐ MOST CRITICAL EVENT)
 * Fire after this function runs.
 * ALL purchase data is available in multiple ways:
 *
 *  1. DOM data attributes:
 *     - #success-content   data-transaction-id, data-revenue, data-tax, data-shipping, data-currency
 *     - #order-confirmation (same attributes — nested container)
 *     - #transaction-id    data-transaction-id
 *     - each .success-item data-product-id, name, price, category, quantity
 *
 *  2. JavaScript globals (set by this function):
 *     - window.lastOrder.transactionId
 *     - window.lastOrder.total / .tax / .shipping / .currency
 *     - window.lastOrder.items  (array of line items)
 *
 *  3. localStorage key: 'analytics_lab_last_order'
 *     (briefly available — cart is cleared after render)
 *
 * Recommended GTM setup:
 *   Trigger: Page View — URL contains "success.html"
 *   Tag:     GA4 Event — event_name: "purchase"
 *   Parameters: read from window.lastOrder or DOM data attributes
 */
function initSuccessPage() {
  const successContent = document.getElementById('success-content');
  if (!successContent) return;

  // Load the order saved by handleCheckout()
  let order;
  try {
    order = JSON.parse(localStorage.getItem('analytics_lab_last_order'));
  } catch (e) {
    order = null;
  }

  // Generate a unique transaction ID for this order
  const transactionId = 'TXN-'
    + Date.now().toString(36).toUpperCase()
    + '-'
    + Math.random().toString(36).substring(2, 7).toUpperCase();

  // Stamp transaction ID on the visible element
  const txnEl = document.getElementById('transaction-id');
  if (txnEl) {
    txnEl.textContent = transactionId;
    txnEl.setAttribute('data-transaction-id', transactionId);
  }

  // Handle missing order data (e.g. user navigated directly to success.html)
  if (!order || !order.items || order.items.length === 0) {
    successContent.innerHTML = `
      <p style="color:var(--text-muted);margin-top:1rem;">
        No order data found.
        <a href="index.html" style="color:var(--accent);">Return to shop</a>
      </p>
    `;
    return;
  }

  // Attach purchase data as data-attributes to the container
  // (allows GTM DOM Element variables to read them)
  successContent.setAttribute('data-transaction-id', transactionId);
  successContent.setAttribute('data-revenue',        order.total);
  successContent.setAttribute('data-subtotal',       order.subtotal);
  successContent.setAttribute('data-tax',            order.tax);
  successContent.setAttribute('data-shipping',       order.shipping);
  successContent.setAttribute('data-currency',       order.currency);

  // Build line-item rows
  const itemsHTML = order.items.map(item => `
    <!--
      SUCCESS ITEM ROW
      Analytics: data-product-id, name, price, category, quantity
    -->
    <div
      class="success-item"
      data-product-id="${item.id}"
      data-product-name="${item.name}"
      data-product-price="${item.price}"
      data-product-category="${item.category}"
      data-product-sku="${item.sku}"
      data-product-brand="${item.brand}"
      data-quantity="${item.quantity}"
    >
      <div>
        <div class="success-item-name">${item.name}</div>
        <div class="success-item-qty">Qty: ${item.quantity}</div>
      </div>
      <div class="success-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  successContent.innerHTML = `
    <!--
      ORDER CONFIRMATION CONTAINER
      Analytics attributes:
        id="order-confirmation"
        data-transaction-id, data-revenue, data-tax, data-shipping, data-currency
    -->
    <div
      class="success-order-card"
      id="order-confirmation"
      data-transaction-id="${transactionId}"
      data-revenue="${order.total}"
      data-subtotal="${order.subtotal}"
      data-tax="${order.tax}"
      data-shipping="${order.shipping}"
      data-currency="${order.currency}"
    >
      <h3>Order Items</h3>
      ${itemsHTML}
      <div class="success-total-row">
        <span>Total Paid</span>
        <span id="success-total-amount" data-total="${order.total}">${formatPrice(order.total)}</span>
      </div>
    </div>

    <div class="success-actions">
      <a href="index.html" class="btn btn-primary">Continue Shopping</a>
    </div>
  `;

  // Expose full order data as a global for GTM Custom JavaScript Variables
  window.lastOrder = {
    transactionId,
    items:    order.items,
    total:    order.total,
    subtotal: order.subtotal,
    tax:      order.tax,
    shipping: order.shipping,
    currency: order.currency
  };

  // 🔵 ANALYTICS HOOK — purchase
  // Transaction ID, revenue, tax, shipping are now set on:
  //   #success-content and #order-confirmation (data attributes)
  //   window.lastOrder (JS global)
  // Fire your GA4 purchase event here or via GTM Page View trigger on success.html.
  console.log(
    '%c[🔵 Analytics Hook] purchase  ⭐',
    'color: #e94560; font-weight: bold; font-size: 1.1em;',
    {
      transaction_id: transactionId,
      value:          order.total,
      tax:            order.tax,
      shipping:       order.shipping,
      currency:       order.currency,
      items:          order.items.length
    }
  );

  // Clear the cart now that the purchase is complete
  clearCart();
}


/* ========================================
   GLOBAL INITIALIZATION
   Runs on every page after DOM is ready.
   Detects current page via data-page on <body>.
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Always sync the cart badge
  updateCartBadge();

  // Route to the correct page initializer
  const page = document.body.dataset.page;

  switch (page) {
    case 'home':
      initHomePage();
      break;

    case 'product':
      initProductPage();
      break;

    case 'cart':
      initCartPage();
      break;

    case 'success':
      initSuccessPage();
      break;

    default:
      // Unknown page — badge is already updated above
      break;
  }
});
