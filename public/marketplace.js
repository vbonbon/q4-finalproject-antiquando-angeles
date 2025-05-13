document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');
        const inputField = event.target.closest('form').querySelector('input[name="quantity"]');
        let currentQuantity = parseInt(inputField.value);

        if (action === 'increase') {
            inputField.value = currentQuantity + 1;
        } else if (action === 'decrease' && currentQuantity > 1) {
            inputField.value = currentQuantity - 1;
        }

        // Update the form automatically
        event.target.closest('form').submit();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action');
            const productId = e.target.closest('form').querySelector('input[name="productId"]').value;
            const quantityInput = e.target.closest('form').querySelector('input[name="quantity"]');
            let currentQuantity = parseInt(quantityInput.value);

            if (action === 'increase') {
                currentQuantity++;
            } else if (action === 'decrease' && currentQuantity > 1) {
                currentQuantity--;
            }

            // Update the quantity in the form input
            quantityInput.value = currentQuantity;

            // Send the updated quantity to the server using AJAX
            fetch('/update-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: currentQuantity
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Quantity updated successfully!");
                    // Optionally, refresh the cart total here without reloading the page
                    updateTotal();
                    updateCartOverview();
                }
            })
            .catch(error => console.error('Error updating quantity:', error));
        });
    });
});

// Function to update the total price
function updateTotal() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(cart => {
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('total-price').textContent = `Total Price: Php ${totalPrice}`;
        });
} 

// Function to update the cart overview
function updateCartPreview() {
  fetch('/api/cart')
    .then(response => response.json())
    .then(cart => {
      const cartItemsContainer = document.getElementById('cart-items');
      cartItemsContainer.innerHTML = '';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.productName} x ${item.quantity}`;
        cartItemsContainer.appendChild(li);
      });
    });
}

// Call the function on page load
updateCartPreview();

 