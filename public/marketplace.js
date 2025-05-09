$(document).ready(function () {
    console.log("✅ marketplace.js loaded");

    // Handle Add to Cart button click
    $(".add-to-cart").click(function () {
        const productDiv = $(this).closest('.product');
        const productId = productDiv.data('product-id');
        const productName = productDiv.data('product-name');
        const price = productDiv.data('price');
        const quantity = productDiv.find('.quantity-input').val();

        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/add-to-cart',
            contentType: 'application/json',
            data: JSON.stringify({
                productId,
                productName,
                price,
                quantity
            }),
            success: function () {
                updateCartOverview();
            },
            error: function () {
                alert("Failed to add item to cart");
            }
        });
    });

    // Update cart overview on load
    updateCartOverview();
});

function updateCartOverview() {
    $.get('/api/cart', function (cart) {
        let cartHtml = '';
        if (cart.length) {
            cart.forEach(item => {
                cartHtml += `<li>${item.productName} (x${item.quantity})</li>`;
            });
        } else {
            cartHtml = '<li>No items in the cart yet.</li>';
        }
        $('#cart').html(cartHtml);
    });
}
