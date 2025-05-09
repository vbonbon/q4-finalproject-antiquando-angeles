document.addEventListener("DOMContentLoaded", () => {
    const cartOverview = document.getElementById("cart");
    const cartContainer = document.getElementById("cart-container");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const viewCartButton = document.getElementById("view-cart");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutButton = document.getElementById("checkout-button");

    // Load cart from localStorage or initialize
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    function updateCart() {
        // Update overview in products.html
        if (cartOverview) {
            cartOverview.innerHTML = cartItems.length === 0
                ? "<li>No items in the cart yet.</li>"
                : cartItems.map(item => `<li>${item.name} - ${item.price} x ${item.quantity}</li>`).join("");
        }

        // Update full cart in shoppingcart.html
        if (cartContainer) {
            cartContainer.innerHTML = cartItems.length === 0
                ? "<p>No items in the cart yet.</p>"
                : cartItems.map((item, index) => `
                    <div class="cart-item">
                        <strong>${item.name}</strong><br>
                        ${item.description}<br>
                        Price: ${item.price}<br>
                        Quantity: <input type="number" class="quantity" data-index="${index}" value="${item.quantity}" min="1">
                        <button class="remove" data-index="${index}">Remove</button>
                    </div>
                `).join("");

            // Bind remove button and quantity input handlers
            cartContainer.querySelectorAll(".remove").forEach(button => {
                button.addEventListener("click", (e) => {
                    const index = parseInt(e.target.getAttribute("data-index"));
                    cartItems.splice(index, 1);
                    saveCart();
                    updateCart();
                });
            });

            cartContainer.querySelectorAll(".quantity").forEach(input => {
                input.addEventListener("change", (e) => {
                    const index = parseInt(e.target.getAttribute("data-index"));
                    const newQuantity = parseInt(e.target.value);
                    cartItems[index].quantity = newQuantity > 0 ? newQuantity : 1;
                    saveCart();
                    updateCart();
                });
            });

            updateTotalPrice();
        }

        saveCart(); // Always save cart after updates
    }

    function updateTotalPrice() {
        if (!totalPriceElement) return;
        const total = cartItems.reduce((sum, item) => {
            const numericPrice = parseFloat(item.price.replace(/[^\d.]/g, ""));
            return sum + (numericPrice * item.quantity);
        }, 0);
        totalPriceElement.innerText = `Total Price: Php ${total.toFixed(2)}`;
    }

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productDiv = e.target.closest(".product");
            const name = productDiv.querySelector("h2")?.innerText;
            const description = productDiv.querySelector(".description")?.innerText;
            const price = productDiv.querySelector("p:nth-of-type(2)")?.innerText.replace("Price: ", "");

            if (!name || !price) return;

            const existingItem = cartItems.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ name, description, price, quantity: 1 });
            }

            saveCart();
            updateCart();
        });
    });

    if (viewCartButton) {
        viewCartButton.addEventListener("click", () => {
            window.location.href = "shoppingcart.html";
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }

    updateCart(); // Load cart on page load
});
