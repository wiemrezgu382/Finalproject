document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.getElementById('cart-btn');
    const cart = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const favoritesBtn = document.getElementById('favorites-btn');
    const favorites = document.getElementById('favorites');
    const favoritesItems = document.getElementById('favorites-items');
    const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    let cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    let favoritesData = JSON.parse(localStorage.getItem('favoritesData')) || [];

    // Toggle cart visibility
    cartBtn.addEventListener('click', function() {
        cart.classList.toggle('hidden');
    });

    // Toggle favorites visibility
    favoritesBtn.addEventListener('click', function() {
        favorites.classList.toggle('hidden');
    });

    // Add product to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const quantity = parseInt(prompt(`Combien de ${name} souhaitez-vous acheter ?`, '1'), 10);

            if (isNaN(quantity) || quantity <= 0) {
                alert("Quantité invalide.");
                return;
            }

            const item = cartData.find(item => item.name === name);
            if (item) {
                item.quantity += quantity;
            } else {
                cartData.push({ name, price, quantity });
            }

            updateCart();
            localStorage.setItem('cartData', JSON.stringify(cartData));  // Sauvegarde dans localStorage
        });
    });

    // Add product to favorites
    addToFavoritesButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            if (!favoritesData.includes(name)) {
                favoritesData.push(name);
                updateFavorites();
                localStorage.setItem('favoritesData', JSON.stringify(favoritesData));  // Sauvegarde dans localStorage
            } else {
                alert(`${name} est déjà dans vos favoris.`);
            }
        });
    });

    // Remove product from favorites
    function removeFromFavorites(name) {
        favoritesData = favoritesData.filter(favorite => favorite !== name);
        updateFavorites();
        localStorage.setItem('favoritesData', JSON.stringify(favoritesData)); // Mise à jour dans localStorage
    }

    // Update cart display
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cartData.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItems.innerHTML += `<li>${item.name} - ${item.quantity} x ${item.price.toFixed(2)} € = ${itemTotal.toFixed(2)} €</li>`;
        });
        totalPriceElem.textContent = total.toFixed(2);
        cartBtn.textContent = `🛒 Panier (${cartData.reduce((acc, item) => acc + item.quantity, 0)})`;
    }

    // Update favorites display
    function updateFavorites() {
        favoritesItems.innerHTML = '';
        favoritesData.forEach(name => {
            favoritesItems.innerHTML += `
                <li>
                    ${name} 
                    <button class="remove-from-favorites" data-name="${name}">Retirer</button> 
                </li>`;
        });
        favoritesBtn.textContent = `❤️ Favoris (${favoritesData.length})`;

        // Attach remove event listener to each "Retirer" button
        document.querySelectorAll('.remove-from-favorites').forEach(button => {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                removeFromFavorites(name);
            });
        });
    }

    // Clear the cart
    function clearCart() {
        cartItems.innerHTML = "";  // Vide tous les éléments du panier
        totalPriceElem.textContent = "0";
        cartBtn.textContent = "🛒 Panier (0)";
        cartData = [];  // Réinitialiser les données du panier
        localStorage.removeItem('cartData');  // Supprimer les données du panier du localStorage
    }

    clearCartBtn.addEventListener('click', clearCart);

    // Load initial data
    updateCart();
    updateFavorites();
});