// Product Data
const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        category: "electronics",
        price: 7999,
        image: "🎧",
        rating: 4.5
    },
    {
        id: 2,
        title: "Cotton T-Shirt",
        category: "clothing",
        price: 1999,
        image: "👕",
        rating: 4.2
    },
    {
        id: 3,
        title: "JavaScript Guide",
        category: "books",
        price: 3199,
        image: "📚",
        rating: 4.8
    },
    {
        id: 4,
        title: "Smart Watch",
        category: "electronics",
        price: 15999,
        image: "⌚",
        rating: 4.6
    },
    {
        id: 5,
        title: "Denim Jeans",
        category: "clothing",
        price: 4799,
        image: "👖",
        rating: 4.3
    },
    {
        id: 6,
        title: "Garden Tools Set",
        category: "home",
        price: 6399,
        image: "🛠️",
        rating: 4.4
    },
    {
        id: 7,
        title: "Laptop Stand",
        category: "electronics",
        price: 3999,
        image: "💻",
        rating: 4.1
    },
    {
        id: 8,
        title: "Cooking Book",
        category: "books",
        price: 2399,
        image: "📖",
        rating: 4.7
    },
    {
        id: 9,
        title: "Winter Jacket",
        category: "clothing",
        price: 7199,
        image: "🧥",
        rating: 4.5
    },
    {
        id: 10,
        title: "Plant Pot",
        category: "home",
        price: 1599,
        image: "🪴",
        rating: 4.0
    },
    {
        id: 11,
        title: "Bluetooth Speaker",
        category: "electronics",
        price: 5599,
        image: "🔊",
        rating: 4.4
    },
    {
        id: 12,
        title: "Running Shoes",
        category: "clothing",
        price: 9599,
        image: "👟",
        rating: 4.6
    }
];

// Global Variables
let cart = [];
let filteredProducts = [...products];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    setupEventListeners();
    updateCartUI();
});

// Load and Render Products
function loadProducts() {
    renderProducts(filteredProducts);
}

function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: #6c757d;">No products found</p>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} (${product.rating})</div>
            <p class="product-price">₹${product.price.toFixed(0)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    
    return card;
}

// Search Functionality
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    applyFilters();
}

// Filter Functionality
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const maxPrice = parseFloat(priceRange.value);
    
    filteredProducts = products.filter(product => {
        const categoryMatch = !selectedCategory || product.category === selectedCategory;
        const priceMatch = product.price <= maxPrice;
        const searchTerm = searchInput.value.toLowerCase().trim();
        const searchMatch = !searchTerm || 
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        
        return categoryMatch && priceMatch && searchMatch;
    });
    
    renderProducts(filteredProducts);
}

function applyFilters() {
    filterProducts();
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showCartNotification();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    cartTotal.textContent = calculateTotal().toFixed(0);
    
    // Render cart items
    renderCartItems();
}

function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #6c757d;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>₹${item.price.toFixed(0)} each</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
}

// Local Storage Functions
function saveCart() {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('ecommerce-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Search
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') {
            filteredProducts = [...products];
            applyFilters();
        }
    });
    
    // Filters
    categoryFilter.addEventListener('change', applyFilters);
    
    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
        applyFilters();
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert(`Thank you for your purchase! Total: ₹${calculateTotal().toFixed(0)}`);
        cart = [];
        saveCart();
        updateCartUI();
        cartModal.style.display = 'none';
    });
}

// Utility Functions
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function showCartNotification() {
    // Simple notification - could be enhanced with a toast notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Product added to cart!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);