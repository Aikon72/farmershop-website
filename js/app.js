// Конфигурация API вашего Spring Boot приложения
const API_BASE_URL = 'https://your-spring-app.herokuapp.com'; // или локальный для теста

class ProductStore {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
    }

    async loadProducts() {
        try {
            // Если API доступно - загружаем с сервера
            const response = await fetch(`${API_BASE_URL}/api/products`);
            this.products = await response.json();
        } catch (error) {
            console.log('API недоступно, используем локальные данные');
            this.products = this.getLocalProducts();
        }
    }

    getLocalProducts() {
        // Резервные данные на случай недоступности API
        return [
            {
                id: "001",
                name: "Мёд липовый",
                description: "Натуральный липовый мёд",
                price: 500,
                imageUrls: ["https://via.placeholder.com/300x200?text=Липовый+Мёд"]
            },
            {
                id: "002",
                name: "Мёд гречишный",
                description: "Тёмный гречишный мёд",
                price: 600,
                imageUrls: ["https://via.placeholder.com/300x200?text=Гречишный+Мёд"]
            }
        ];
    }

    renderProducts() {
        const container = document.getElementById('products-container');
        container.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="${product.imageUrls[0] || 'https://via.placeholder.com/300x200'}"
                 alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${product.price} руб.</div>
            <button onclick="orderProduct('${product.id}')">🛒 Заказать</button>
        `;

        return card;
    }
}

// Функция заказа через Telegram
function orderProduct(productId) {
    const product = productStore.products.find(p => p.id === productId);
    if (product) {
        const message = `Заказ: ${product.name} - ${product.price} руб.`;
        const telegramUrl = `https://t.me/your_bot?start=order_${productId}`;
        window.open(telegramUrl, '_blank');
    }
}

// Инициализация магазина
const productStore = new ProductStore();