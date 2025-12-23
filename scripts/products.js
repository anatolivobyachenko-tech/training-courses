// Завантажити товари з JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка завантаження:', error);
        return [];
    }
}

// Показати товари
function displayProducts(products) {
    const container = document.getElementById('products-list') || document.getElementById('courses-list');
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">Товари не знайдено</p></div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <p class="text-muted small"><strong>Викладач:</strong> ${product.teacher}</p>
                    <div class="mt-auto">
                        <p class="h5 text-primary mb-3">${product.price} грн</p>
                        <button class="btn btn-primary w-100 add-to-cart-btn" data-product='${JSON.stringify(product)}'>
                            <i class="bi bi-cart-plus"></i> Записатися
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Додай обробники для кнопок
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const product = JSON.parse(e.target.closest('.add-to-cart-btn').getAttribute('data-product'));
            if (typeof cart !== 'undefined') {
                cart.addItem(product);
            }
        });
    });
}

// Заповнити категорії
function populateCategories(products) {
    const select = document.getElementById('category-filter');
    if (!select) return;

    const categories = new Set();
    products.forEach(p => {
        if (p.category) categories.add(p.category);
    });

    const sorted = Array.from(categories).sort();
    sorted.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// Фільтрувати товари
function applyFilters(allProducts) {
    const category = document.getElementById('category-filter')?.value || 'all';
    const search = document.getElementById('search-input')?.value?.toLowerCase() || '';
    const sort = document.getElementById('sort-filter')?.value || 'default';

    let filtered = allProducts.filter(p => {
        if (category !== 'all' && p.category !== category) return false;
        if (search && !p.title.toLowerCase().includes(search) && !p.teacher.toLowerCase().includes(search)) return false;
        return true;
    });

    // Сортування
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title, 'uk'));

    displayProducts(filtered);

    // Зберегти стан
    localStorage.setItem('productFilters', JSON.stringify({ category, search, sort }));
}

// Ініціалізація
async function init() {
    console.log('Завантажу товари...');
    const products = await loadProducts();
    console.log('Товари:', products.length);

    if (products.length === 0) {
        const container = document.getElementById('products-list') || document.getElementById('courses-list');
        if (container) {
            container.innerHTML = '<p class="text-danger">Помилка завантаження товарів</p>';
        }
        return;
    }

    // Заповнити категорії
    populateCategories(products);

    // Відновити фільтри
    const saved = JSON.parse(localStorage.getItem('productFilters') || '{}');
    if (saved.category) document.getElementById('category-filter').value = saved.category;
    if (saved.search) document.getElementById('search-input').value = saved.search;
    if (saved.sort) document.getElementById('sort-filter').value = saved.sort;

    // Показати товари з фільтрами
    if (saved.category || saved.search || saved.sort) {
        applyFilters(products);
    } else {
        displayProducts(products);
    }

    // Обробники подій
    document.getElementById('category-filter')?.addEventListener('change', () => applyFilters(products));
    document.getElementById('search-input')?.addEventListener('input', () => applyFilters(products));
    document.getElementById('sort-filter')?.addEventListener('change', () => applyFilters(products));
    document.getElementById('reset-filters')?.addEventListener('click', () => {
        document.getElementById('category-filter').value = 'all';
        document.getElementById('search-input').value = '';
        document.getElementById('sort-filter').value = 'default';
        localStorage.removeItem('productFilters');
        displayProducts(products);
    });
}

// Запустити при готовності DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
