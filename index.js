
// Toggle wishlist panel
document.getElementById("fav-toggle").addEventListener("click", function () {
    const panel = document.getElementById("wishlistPanel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
});

// Add product to wishlist
const wishlistBtns = document.querySelectorAll(".wishlist-btn");
const wishlistItems = document.getElementById("wishlistItems");

wishlistBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        const productName = this.getAttribute("data-name");
        const li = document.createElement("li");
        li.textContent = productName;
        wishlistItems.appendChild(li);
        this.textContent = "💖"; // change button style
    });
});
//-dark-white-toggle-
// const toggleBtn = document.getElementById("darkToggle");
// const body = document.body;

// if (localStorage.getItem("theme") === "dark") {
//     body.classList.add("dark-mode");
//     toggleBtn.textContent = "☀️";
// }

// toggleBtn.addEventListener("click", () => {
//     body.classList.toggle("dark-mode");
//     if (body.classList.contains("dark-mode")) {
//         localStorage.setItem("theme", "dark");
//         toggleBtn.textContent = "☀️";
//     } else {
//         localStorage.setItem("theme", "light");
//         toggleBtn.textContent = "🌙";
//     }
// });
/* ============================================================
   LUXELOOM - JAVASCRIPT
   This file handles:
   1. Cart (add, remove, update quantity, show total)
   2. Buy Now modal (open, close, place order)
   3. Wishlist (heart toggle)
   4. Toast notification (small popup message)
   5. Checkout from cart
   6. Floating petals on hero section
============================================================ */


/* ─── 1. CART DATA ─────────────────────────────────────────
   We store cart items in a simple array.
   Each item is an object: { name, price, qty, img }
─────────────────────────────────────────────────────────── */
var cartItems = [];   // This holds all items added to cart


/* ─── 2. ADD TO CART ────────────────────────────────────────
   Called when user clicks "Add to Cart" button.
   Parameters:
     btn   = the button that was clicked
     name  = product name (string)
     price = product price (number)
     img   = product image source (string)
─────────────────────────────────────────────────────────── */
function addToCart(btn, name, price, img) {

    // Check if this product is already in the cart
    var existingItem = null;
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].name === name) {
            existingItem = cartItems[i];
            break;
        }
    }

    if (existingItem) {
        // Product already in cart → just increase quantity by 1
        existingItem.qty = existingItem.qty + 1;
    } else {
        // New product → add it to the cart array
        cartItems.push({ name: name, price: price, qty: 1, img: img });
    }

    // Update the cart badge number on the nav icon
    updateCartBadge();

    // Show a small popup message to confirm
    showToast(name + ' added to cart 🛍️');

    // Animate the button briefly to give feedback
    btn.textContent = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #6dbf8e, #4da870)';
    setTimeout(function () {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
    }, 1200);
}


/* ─── 3. REMOVE FROM CART ───────────────────────────────────
   Called when user clicks the ✕ button on a cart item.
   index = position of the item in the cartItems array
─────────────────────────────────────────────────────────── */
function removeFromCart(index) {
    // Remove 1 item at the given position
    cartItems.splice(index, 1);

    // Refresh the cart display
    renderCart();
    updateCartBadge();
}


/* ─── 4. CHANGE QUANTITY ────────────────────────────────────
   Called when user clicks + or - on a cart item.
   index  = position of item in cartItems array
   change = +1 or -1
─────────────────────────────────────────────────────────── */
function changeQty(index, change) {
    // Add the change to the current quantity
    cartItems[index].qty = cartItems[index].qty + change;

    // If quantity goes to 0 or below, remove the item
    if (cartItems[index].qty <= 0) {
        cartItems.splice(index, 1);
    }

    // Refresh the cart display
    renderCart();
    updateCartBadge();
}


/* ─── 5. RENDER CART ────────────────────────────────────────
   This function builds the cart sidebar HTML.
   It loops through cartItems and creates HTML for each one.
─────────────────────────────────────────────────────────── */
function renderCart() {
    var cartItemsDiv = document.getElementById('cartItems');
    var cartEmpty = document.getElementById('cartEmpty');
    var cartFooter = document.getElementById('cartFooter');
    var cartTotalEl = document.getElementById('cartTotal');

    // If cart is empty, show the empty message and hide footer
    if (cartItems.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsDiv.innerHTML = '';
        cartFooter.style.display = 'none';
        return;
    }

    // Cart has items → hide empty message, show footer
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';

    // Calculate grand total
    var total = 0;
    for (var i = 0; i < cartItems.length; i++) {
        total = total + (cartItems[i].price * cartItems[i].qty);
    }
    cartTotalEl.textContent = '₹' + total.toLocaleString('en-IN');

    // Build HTML for each cart item
    var html = '';
    for (var j = 0; j < cartItems.length; j++) {
        var item = cartItems[j];
        html += '<div class="cart-item">';
        html += '<img src="' + item.img + '" alt="' + item.name + '" class="cart-item-img" onerror="this.src=\'https://via.placeholder.com/60x70/fce8ef/e8829a?text=🛍\'">';
        html += '<div class="cart-item-info">';
        html += '<p class="cart-item-name">' + item.name + '</p>';
        html += '<p class="cart-item-price">₹' + item.price.toLocaleString('en-IN') + '</p>';
        html += '<div class="cart-qty-row">';
        html += '<button class="qty-btn" onclick="changeQty(' + j + ', -1)">−</button>';
        html += '<span class="qty-num">' + item.qty + '</span>';
        html += '<button class="qty-btn" onclick="changeQty(' + j + ', 1)">+</button>';
        html += '</div>';
        html += '</div>';
        html += '<button class="cart-remove-btn" onclick="removeFromCart(' + j + ')">✕</button>';
        html += '</div>';
    }
    cartItemsDiv.innerHTML = html;
}


/* ─── 6. CART BADGE (number on cart icon) ───────────────────
   Counts total number of items and updates the badge.
─────────────────────────────────────────────────────────── */
function updateCartBadge() {
    var badge = document.getElementById('cartCountBadge');
    var totalQty = 0;

    for (var i = 0; i < cartItems.length; i++) {
        totalQty = totalQty + cartItems[i].qty;
    }

    if (totalQty > 0) {
        badge.style.display = 'flex';
        badge.textContent = totalQty;
    } else {
        badge.style.display = 'none';
    }
}


/* ─── 7. OPEN / CLOSE CART SIDEBAR ─────────────────────────
   Opens and closes the sliding cart panel.
─────────────────────────────────────────────────────────── */
function openCart() {
    // Render latest cart items first
    renderCart();

    // Show sidebar and dark overlay behind it
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlayBg').classList.add('open');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlayBg').classList.remove('open');
}


/* ─── 8. BUY NOW MODAL ──────────────────────────────────────
   Opens the order form popup for a single product.
   label = product name + price shown in the modal
─────────────────────────────────────────────────────────── */
function openOrder(label) {
    // Set the product name text in the modal
    document.getElementById('modalProductName').textContent = label;

    // Show the form, hide the success message
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('successMsg').style.display = 'none';

    // Open the modal
    document.getElementById('orderModal').classList.add('open');
}


/* ─── 9. CLOSE ANY MODAL ────────────────────────────────────
   id = the id of the modal to close (e.g. 'orderModal')
─────────────────────────────────────────────────────────── */
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}


/* ─── 10. PLACE ORDER (Buy Now form) ────────────────────────
   Validates the form fields before confirming the order.
─────────────────────────────────────────────────────────── */
function placeOrder() {
    var name = document.getElementById('custName').value.trim();
    var phone = document.getElementById('custPhone').value.trim();
    var address = document.getElementById('custAddr').value.trim();

    // Check that required fields are not empty
    if (name === '' || phone === '' || address === '') {
        showToast('Please fill all required fields ✨');
        return;
    }

    // Hide the form and show the success message
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
}


/* ─── 11. CHECKOUT (from cart) ──────────────────────────────
   Opens the checkout modal and fills in cart summary.
─────────────────────────────────────────────────────────── */
function openCheckout() {
    // Close cart sidebar first
    closeCart();

    // Build a summary text from all cart items
    var summary = '';
    var total = 0;
    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var sub = item.price * item.qty;
        total = total + sub;
        summary += item.name + ' × ' + item.qty + '  =  ₹' + sub.toLocaleString('en-IN') + '\n';
    }
    summary += '\nTotal: ₹' + total.toLocaleString('en-IN');

    // Put the summary in the checkout modal
    document.getElementById('checkoutSummary').textContent = summary;

    // Show form, hide success
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('checkoutSuccess').style.display = 'none';

    // Open the checkout modal
    document.getElementById('checkoutModal').classList.add('open');
}


/* ─── 12. CONFIRM CHECKOUT ORDER ───────────────────────────
   Validates checkout form, then shows success and clears cart.
─────────────────────────────────────────────────────────── */
function placeCheckoutOrder() {
    var name = document.getElementById('chkName').value.trim();
    var phone = document.getElementById('chkPhone').value.trim();
    var address = document.getElementById('chkAddr').value.trim();

    // Check required fields
    if (name === '' || phone === '' || address === '') {
        showToast('Please fill all required fields ✨');
        return;
    }

    // Show success message
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('checkoutSuccess').style.display = 'block';

    // Clear the cart after successful order
    cartItems = [];
    updateCartBadge();
}




/* ─── 14. TOAST NOTIFICATION ────────────────────────────────
   Shows a small popup message at the bottom of the screen.
   msg = the text to display
─────────────────────────────────────────────────────────── */
function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');

    // Automatically hide after 2.5 seconds
    setTimeout(function () {
        toast.classList.remove('show');
    }, 2500);
}


/* ─── 15. FLOATING PETALS (Hero Section) ────────────────────
   Creates 20 random floating emoji petals on the hero banner.
─────────────────────────────────────────────────────────── */
var petals = ['🌸', '🌺', '✿', '🌷', '💐', '✦', '🎀', '⭐'];
var container = document.getElementById('heroPetals');

for (var k = 0; k < 20; k++) {
    var petal = document.createElement('div');
    petal.className = 'petal';

    // Pick a random emoji from the list
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];

    // Random horizontal position
    petal.style.left = Math.random() * 100 + 'vw';

    // Random speed (6 to 16 seconds)
    petal.style.animationDuration = (6 + Math.random() * 10) + 's';

    // Random start delay so they don't all fall at once
    petal.style.animationDelay = (Math.random() * 10) + 's';

    // Random size
    petal.style.fontSize = (0.7 + Math.random() * 1.2) + 'rem';

    container.appendChild(petal);
}


/* ─── 17. REVIEWS ───────────────────────────────────────────
   Handles:
     - Opening the review form modal
     - Star picker (clicking stars to choose rating)
     - Submitting a new review and adding it to the page
─────────────────────────────────────────────────────────── */

// Stores the number the user picked (1 to 5)
var selectedRating = 0;


// Opens the review form modal
function openReviewForm() {
    // Reset the form fields first
    document.getElementById('rvName').value = '';
    document.getElementById('rvCity').value = '';
    document.getElementById('rvProduct').value = '';
    document.getElementById('rvText').value = '';
    document.getElementById('rvRating').value = '0';

    // Reset star display to all empty
    selectedRating = 0;
    updateStarDisplay(0);

    // Show form, hide success
    document.getElementById('reviewFormDiv').style.display = 'block';
    document.getElementById('reviewSuccess').style.display = 'none';

    // Open modal
    document.getElementById('reviewModal').classList.add('open');
}


// Called when user clicks a star in the picker
// num = 1, 2, 3, 4, or 5
function pickStar(num) {
    selectedRating = num;
    document.getElementById('rvRating').value = num;
    updateStarDisplay(num);
}


// Highlights stars up to the chosen number
function updateStarDisplay(num) {
    var stars = document.querySelectorAll('#starPicker span');
    for (var i = 0; i < stars.length; i++) {
        if (i < num) {
            stars[i].textContent = '★';   // Filled star
            stars[i].style.color = '#f0c040';
        } else {
            stars[i].textContent = '☆';   // Empty star
            stars[i].style.color = '#ccc';
        }
    }
}


// Called when user clicks "Submit Review"
function submitReview() {
    var name = document.getElementById('rvName').value.trim();
    var city = document.getElementById('rvCity').value.trim();
    var product = document.getElementById('rvProduct').value.trim();
    var text = document.getElementById('rvText').value.trim();
    var rating = parseInt(document.getElementById('rvRating').value);

    // Validate: all fields must be filled and a star must be chosen
    if (name === '' || city === '' || product === '' || text === '') {
        showToast('Please fill all fields 💕');
        return;
    }
    if (rating === 0) {
        showToast('Please choose a star rating ⭐');
        return;
    }

    // Build the star string (e.g. "★★★★☆" for 4 stars)
    var starStr = '';
    for (var s = 1; s <= 5; s++) {
        starStr += (s <= rating) ? '★' : '☆';
    }

    // Pick a random colour for the avatar
    var avatarColors = [
        'linear-gradient(135deg,var(--rose),#d4607e)',
        'linear-gradient(135deg,var(--gold),#b8904a)',
        'linear-gradient(135deg,#c084b4,#a05090)',
        'linear-gradient(135deg,#84c4a0,#5aaa80)',
        'linear-gradient(135deg,#e8a060,#c07830)'
    ];
    var randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // Get the first letter of the name for the avatar circle
    var initial = name.charAt(0).toUpperCase();

    // Get today's date in "Month Year" format
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var dateStr = months[today.getMonth()] + ' ' + today.getFullYear();

    // Build the HTML for the new review card
    var newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.innerHTML =
        '<div class="review-top">' +
        '<div class="reviewer-avatar" style="background:' + randomColor + ';">' + initial + '</div>' +
        '<div>' +
        '<p class="reviewer-name">' + name + '</p>' +
        '<p class="reviewer-location">' + city + ', India</p>' +
        '</div>' +
        '<div class="review-stars">' + starStr + '</div>' +
        '</div>' +
        '<p class="review-product">' + product + '</p>' +
        '<p class="review-text">"' + text + '"</p>' +
        '<p class="review-date">' + dateStr + '</p>';

    // Add the new card to the top of the reviews grid
    var grid = document.getElementById('reviewsGrid');
    grid.insertBefore(newCard, grid.firstChild);

    // Update the total review count number
    var countEl = document.getElementById('totalReviewCount');
    countEl.textContent = parseInt(countEl.textContent) + 1;

    // Show the success message inside the modal
    document.getElementById('reviewFormDiv').style.display = 'none';
    document.getElementById('reviewSuccess').style.display = 'block';
}




document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
        // Only close if the click was on the overlay itself (not the modal box)
        if (e.target === overlay) {
            overlay.classList.remove('open');
        }
    });
});

