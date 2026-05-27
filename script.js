// Auris Pro X - Shopping Cart Script

const PRICE = 399.99;
const MAX_QTY = 5;

let cart = [];
let qty = 1;

// Get elements
const mainImg = document.getElementById('mainImg');
const thumbs = document.querySelectorAll('.thumb');
const qtyNum = document.getElementById('qtyNum');
const qtyUp = document.getElementById('qtyUp');
const qtyDown = document.getElementById('qtyDown');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const progressFill = document.getElementById('progressFill');
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const successMsg = document.getElementById('successMsg');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// ---- Image Gallery ----
thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
        // Remove active from all thumbs
        thumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');

        // Swap main image
        mainImg.style.opacity = '0.3';
        setTimeout(function() {
            mainImg.src = thumb.getAttribute('data-src');
            mainImg.style.opacity = '1';
        }, 150);
    });
});

// ---- Quantity ----
qtyUp.addEventListener('click', function() {
    if (qty < MAX_QTY) {
        qty++;
        qtyNum.textContent = qty;
    } else {
        alert('Maximum 5 units per order.');
    }
});

qtyDown.addEventListener('click', function() {
    if (qty > 1) {
        qty--;
        qtyNum.textContent = qty;
    }
});

// ---- Cart Open / Close ----
function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('show');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('show');
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', closeCartDrawer);

// ---- Add to Cart ----
addToCartBtn.addEventListener('click', function() {
    // Check if item already in cart
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === 'Auris Pro X') {
            existing = cart[i];
            break;
        }
    }

    if (existing) {
        existing.qty = Math.min(MAX_QTY, existing.qty + qty);
    } else {
        cart.push({ name: 'Auris Pro X', price: PRICE, qty: qty });
    }

    // Reset qty
    qty = 1;
    qtyNum.textContent = 1;

    renderCart();
    openCart();
});

// ---- Render Cart ----
function renderCart() {
    var total = 0;
    var totalItems = 0;

    for (var i = 0; i < cart.length; i++) {
        totalItems += cart[i].qty;
    }

    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        cartSubtotal.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = '';

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.qty;
        total += itemTotal;

        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML =
            '<div class="cart-item-top">' +
                '<span class="cart-item-name">' + item.name + '</span>' +
                '<button class="cart-item-remove" data-index="' + i + '">Remove</button>' +
            '</div>' +
            '<div class="cart-item-bottom">' +
                '<span class="cart-item-qty">Qty: ' + item.qty + '</span>' +
                '<span class="cart-item-price">$' + itemTotal.toFixed(2) + '</span>' +
            '</div>';

        cartItems.appendChild(div);
    }

    cartSubtotal.textContent = '$' + total.toFixed(2);
    cartTotal.textContent = '$' + total.toFixed(2);
    checkoutBtn.disabled = false;

    // Remove buttons
    var removeBtns = cartItems.querySelectorAll('.cart-item-remove');
    removeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            renderCart();
        });
    });
}

// ---- Checkout ----
checkoutBtn.addEventListener('click', function() {
    closeCartDrawer();
    modal.classList.add('show');
    progressFill.style.width = '0%';

    setTimeout(function() {
        progressFill.style.width = '100%';
    }, 100);

    var timer = setTimeout(function() {
        finishOrder();
    }, 3500);

    closeModal.addEventListener('click', function() {
        clearTimeout(timer);
        finishOrder();
    }, { once: true });
});

function finishOrder() {
    modal.classList.remove('show');
    cart = [];
    renderCart();
}

// ---- Newsletter ----
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (emailInput.value.trim() !== '') {
        successMsg.classList.remove('hidden');
        emailInput.value = '';
        setTimeout(function() {
            successMsg.classList.add('hidden');
        }, 5000);
    }
});

// ---- Theme Toggle ----
themeToggleBtn.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// Load theme on startup
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggleBtn.textContent = '🌙';
}

