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
            // Загружаем данные из products.json
            const response = await fetch('products.json');
            const productsData = await response.json();

            // Преобразуем объект в массив
            this.products = Object.entries(productsData).map(([id, product]) => ({
                id: id,
                name: product.name || 'Без названия',
                description: product.description || '',
                price: product.price || 0,
                category: product.category || 'Не указана',
                available: product.available !== false,
                stock: product.stock || 0,
                amount: product.amount || '',
                imageUrls: product.imageUrls || ['https://via.placeholder.com/300x200?text=Фото+товара']
            }));

            console.log('Загружено товаров:', this.products.length);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            this.products = this.getLocalProducts();
        }
    }

    getLocalProducts() {
        // Резервные данные
        return [
            {
                id: "1",
                name: "Мёд липовый",
                description: "Натуральный липовый мёд",
                price: 850,
                category: "Мёд",
                available: true,
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

        if (this.products.length === 0) {
            container.innerHTML = '<p>❌ Товары временно недоступны</p>';
            return;
        }

        container.innerHTML = '';

        this.products.forEach(product => {
            if (product.available) {
                const productCard = this.createProductCard(product);
                container.appendChild(productCard);
            }
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="${product.imageUrls[0]}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="category">Категория: ${product.category}</p>
            <p class="amount">${product.amount || ''}</p>
            <div class="price">${product.price} руб.</div>
            <p class="stock">${product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Под заказ'}</p>
            <button onclick="orderProduct('${product.id}')" class="order-btn">
                🛒 Заказать в Telegram
            </button>
        `;

        return card;
    }
}

// Функция заказа через Telegram
function orderProduct(productId) {
    const product = productStore.products.find(p => p.id === productId);
    if (product) {
        const message = `Заказ: ${product.name} - ${product.price} руб.`;
        // Замените YOUR_BOT_NAME на имя вашего бота
        const telegramUrl = `https://t.me/farmershop72_bot?start=order_${productId}`;
        window.open(telegramUrl, '_blank');
    }
}

// Поиск товаров
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('products-container');

    container.innerHTML = '';

    const filteredProducts = productStore.products.filter(product =>
        product.available && (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        )
    );

    if (filteredProducts.length === 0) {
        container.innerHTML = '<p>Товары не найдены</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = productStore.createProductCard(product);
        container.appendChild(productCard);
    });
}

// Инициализация магазина
const productStore = new ProductStore();

// Обновляем товары каждые 5 минут
setInterval(() => {
    productStore.init();
}, 300000);