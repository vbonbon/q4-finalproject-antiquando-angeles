// currently we dont need - no stuff links to this

/*
document.addEventListener("DOMContentLoaded", () => {
    const cartOverview = document.getElementById("cart"); // Cart overview in products.html
    const cartContainer = document.getElementById("cart-container"); // Full cart in shoppingcart.html
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const viewCartButton = document.getElementById("view-cart"); // Button to go to shopping cart
    const totalPriceElement = document.getElementById("total-price");

    // Load cart from localStorage
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update cart UI (used for both cart overview & full cart page)
    function updateCart() {
        // Update cart overview in products.html
        if (cartOverview) {
            cartOverview.innerHTML = cartItems.length === 0
                ? "<li>No items in the cart yet.</li>"
                : cartItems.map(item => <li>${item.name} - ${item.price} x ${item.quantity}</li>).join("");
        }

        // Update full shopping cart in shoppingcart.html
        if (cartContainer) {
            cartContainer.innerHTML = cartItems.length === 0
                ? "<p>No items in the cart yet.</p>"
                : cartItems.map((item, index) => 
                    <div class="cart-item">
                        <strong>${item.name}</strong><br>
                        ${item.description}<br>
                        Price: ${item.price} <br>
                        Quantity: <input type="number" class="quantity" data-index="${index}" value="${item.quantity}" min="1">
                        <button class="remove" data-index="${index}">Remove</button>
                    </div>
                ).join("");

            // Update total price
            updateTotalPrice();
        }

        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(cartItems));

        // Attach remove event listeners (only for shoppingcart.html)
        if (cartContainer) {
            document.querySelectorAll(".remove").forEach(button => {
                button.addEventListener("click", (event) => {
                    const index = event.target.getAttribute("data-index");
                    cartItems.splice(index, 1);
                    updateCart();
                });
            });

            // Update quantity in cart (only for shoppingcart.html)
            document.querySelectorAll(".quantity").forEach(input => {
                input.addEventListener("change", (event) => {
                    const index = event.target.getAttribute("data-index");
                    const newQuantity = parseInt(event.target.value);
                    cartItems[index].quantity = newQuantity > 0 ? newQuantity : 1; // Prevent zero/negative values
                    updateCart();
                });
            });
        }
    }

    // Function to calculate total price
    function updateTotalPrice() {
        if (!totalPriceElement) return;
        const total = cartItems.reduce((sum, item) => {
            const numericPrice = parseFloat(item.price.replace(/[^\d.]/g, "")); // Remove non-numeric characters
            return sum + (numericPrice * item.quantity);
        }, 0);
        totalPriceElement.innerText = Total Price: Php ${total.toFixed(2)};
    }


    // Add to cart function
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const productDiv = event.target.closest(".product");
            const productName = productDiv.querySelector("h2").innerText;
            const productDescription = productDiv.querySelector(".description").innerText;
            const productPrice = productDiv.querySelector("p:nth-of-type(2)").innerText.replace("Price: ", "");

            const existingItem = cartItems.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ name: productName, description: productDescription, price: productPrice, quantity: 1 });
            }

            updateCart();
        });
    });

    // Redirect to shopping cart page
    if (viewCartButton) {
        viewCartButton.addEventListener("click", () => {
            window.location.href = "shoppingcart.html";
        });
    }

    // Handle checkout button click
    const checkoutButton = document.getElementById("checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            window.location.href = "checkout.html"; // Redirects to checkout page
        });
    }


    // Load cart on page load
    updateCart();
});
*/