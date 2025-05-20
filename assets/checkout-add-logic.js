$(document).ready(function () {
    let extraProduct = 51832492392813;

    $('.am-custom-chekout-btn').click(function (event) {
        event.preventDefault();
        console.log(`Adding product ${extraProduct} to cart...`);

        addSingleProductToCart(extraProduct, function () {
            console.log("Product added, navigating to checkout...");
            window.location.href = '/checkout';
        });
    });

    if (window.location.pathname === "/cart") {
        console.log("User is on the cart page");
        handleReturnToCart();
    }

    checkPageNavigationFromCheckout();
});

// Function to handle return to cart
function handleReturnToCart() {
    let extraProduct = 51832492392813;
    console.log("Ensuring extra product is removed from cart...");

    // First, check if the extra product is in the cart
    $.getJSON((window.Shopify?.routes?.root || "/") + "cart.js", function (cart) {
        let productInCart = cart.items.some(item => item.id === extraProduct);

        if (productInCart) {
            console.log(`Extra product ${extraProduct} found in cart. Removing...`);
            removeProductFromCart(extraProduct, function () {
                setTimeout(() => {
                    location.reload();  // Reload only if the product was removed
                }, 0);
            });
        } else {
            console.log(`Extra product ${extraProduct} not found in cart. No reload needed.`);
        }
    });
}


function checkPageNavigationFromCheckout() {
        if (window.location.pathname === "/") {
            console.log("User is on the Home page");
            handleReturnToCart();
        }

        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) {
                console.log("User returned to cart page without refresh");
                handleReturnToCart();
            }
        });

        window.onpopstate = function () {
            console.log("User pressed back button to cart");
            handleReturnToCart();
        };
}

// Function to add product to cart
function addSingleProductToCart(variantId, callback) {
    $.ajax({
        type: "POST",
        url: (window.Shopify?.routes?.root || "/") + 'cart/add.js',
        data: { id: variantId, quantity: 1 },
        dataType: "json",
        success: function () {
            console.log(`Product ${variantId} added to cart successfully`);
            if (callback) callback();
        },
        error: function (xhr, status, error) {
            console.error(`Error adding product ${variantId}:`, status, error);
            console.error("Response:", xhr.responseText);
        }
    });
}

// Function to remove product from cart
function removeProductFromCart(variantId, callback) {
    $.ajax({
        type: "POST",
        url: (window.Shopify?.routes?.root || "/") + "cart/change.js",
        data: { id: variantId, quantity: 0 },
        dataType: "json",
        success: function () {
            console.log(`Product ${variantId} removed from cart`);
            if (callback) callback();
        },
        error: function (xhr, status, error) {
            console.error("Error removing product:", status, error);
            console.error("Response:", xhr.responseText);
        }
    });
}
