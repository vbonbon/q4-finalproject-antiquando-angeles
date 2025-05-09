document.addEventListener("DOMContentLoaded", () => {
    const cartOverview = document.getElementById("cart");
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");
    const viewCartButton = document.getElementById("view-cart");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    function updateCart() {
        if (cartOverview) {
            cartOverview.innerHTML = cartItems.length === 0
                ? "<li>No items in the cart yet.</li>"
                : cartItems.map(item => `<li>${item.name} - ${item.price} x ${item.quantity}</li>`).join("");
        }

        if (cartContainer) {
            cartContainer.innerHTML = cartItems.length === 0
                ? "<p>No items in the cart yet.</p>"
                : cartItems.map((item, index) => `
                    <div class="cart-item">
                        <strong>${item.name}</strong><br>
                        ${item.description}<br>
                        Price: ${item.price}<br>
                        <div>
                            <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                            <input type="number" class="quantity" data-index="${index}" value="${item.quantity}" min="1" readonly>
                            <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                        </div>
                        <button class="remove" data-index="${index}">Remove</button>
                    </div>
                `).join("");

            updateTotalPrice();
        }

        saveCart();
    }

    function updateTotalPrice() {
        if (!totalPriceElement) return;
        const total = cartItems.reduce((sum, item) => {
            const numericPrice = parseFloat(item.price.replace(/[^\d.]/g, ""));
            return sum + numericPrice * item.quantity;
        }, 0);
        totalPriceElement.textContent = `Total Price: Php ${total.toFixed(2)}`;
    }

    // Add to cart handler
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productDiv = e.target.closest(".product");
            const name = productDiv.querySelector("h2")?.innerText;
            const description = productDiv.querySelector(".description")?.innerText;
            const price = productDiv.querySelector("p:nth-of-type(2)")?.innerText.replace("Price: ", "");
            const quantityInput = productDiv.querySelector(".quantity-input");
            const quantity = parseInt(quantityInput?.value) || 1;

            if (!name || !price) return;

            const existingItem = cartItems.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ name, description, price, quantity });
            }

            saveCart();
            updateCart();
        });
    });

    // Attach handlers after cart render
    function attachCartHandlers() {
        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = parseInt(e.target.getAttribute("data-index"));
                cartItems.splice(index, 1);
                updateCart();
            });
        });

        document.querySelectorAll(".quantity-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = parseInt(e.target.getAttribute("data-index"));
                const action = e.target.getAttribute("data-action");
                let item = cartItems[index];

                if (action === "increase") {
                    item.quantity += 1;
                } else if (action === "decrease" && item.quantity > 1) {
                    item.quantity -= 1;
                }

                updateCart();
            });
        });
    }

    // Redirect view-cart
    if (viewCartButton) {
        viewCartButton.addEventListener("click", () => {
            window.location.href = "/shoppingcart";
        });
    }

    updateCart();
    attachCartHandlers();

    // Re-attach handlers whenever the cart updates
    const observer = new MutationObserver(() => attachCartHandlers());
    if (cartContainer) {
        observer.observe(cartContainer, { childList: true, subtree: true });
    }
});
