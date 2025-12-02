// Отримання ID товару з URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search)
    return parseInt(urlParams.get('id'))
}

// Отримання товарів з JSON файлу
async function getProducts() {
    try {
        const response = await fetch('products.json')
        const products = await response.json()
        return products
    } catch (error) {
        console.error('Помилка завантаження товарів:', error)
        return []
    }
}

// Пошук товару за ID
function findProductById(products, id) {
    return products.find(product => product.id === id)
}

// Відображення деталей товару
function displayProductDetails(product) {
    const productDetails = document.querySelector('#product-details')
    const breadcrumbTitle = document.querySelector('#breadcrumb-title')
    
    if (!product) {
        productDetails.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>Курс не знайдено</h3>
                <a href="courses.html" class="btn btn-primary mt-3">Повернутися до каталогу</a>
            </div>
        `
        return
    }

    // Оновлюємо заголовок breadcrumb
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = product.title
    }

    // Оновлюємо title сторінки
    document.title = `${product.title} - Доп.Заняття`

    // Оновлюємо основні елементи
    const productTitle = document.querySelector('#product-title')
    if (productTitle) productTitle.textContent = product.title

    const categoryBadge = document.querySelector('#category-badge')
    if (categoryBadge) categoryBadge.textContent = product.category || 'Без категорії'

    const levelBadge = document.querySelector('#level-badge')
    if (levelBadge) levelBadge.textContent = product.level || 'Рівень не вказано'

    const productDescription = document.querySelector('#product-description')
    if (productDescription) productDescription.textContent = product.description || 'Опис недоступний'

    const fullDescription = document.querySelector('#full-description')
    if (fullDescription) fullDescription.textContent = product.fullDescription || product.description

    const productPrice = document.querySelector('#product-price')
    if (productPrice) productPrice.textContent = `${product.price} грн`

    const teacherName = document.querySelector('#teacher-name')
    if (teacherName) teacherName.textContent = product.teacher || 'Викладач'

    // Оновлюємо інформацію про курс в карті "Про курс"
    const aboutCourseCard = document.querySelector('#product-details .col-md-5 .card')
    if (aboutCourseCard) {
        const aboutCourseElement = aboutCourseCard.querySelector('.card-body')
        if (aboutCourseElement) {
            aboutCourseElement.innerHTML = `
                <h5 class="card-title"><i class="bi bi-info-circle"></i> Про курс</h5>
                <ul class="list-unstyled mb-0">
                    <li class="mb-2"><i class="bi bi-check-circle text-success"></i> <strong>Рівень:</strong> ${product.level || 'Не вказано'}</li>
                    <li class="mb-2"><i class="bi bi-check-circle text-success"></i> <strong>Тривалість:</strong> ${product.duration || 'Не вказано'}</li>
                    <li class="mb-2"><i class="bi bi-check-circle text-success"></i> <strong>Формат:</strong> ${product.format || 'Онлайн'}</li>
                    <li class="mb-2"><i class="bi bi-check-circle text-success"></i> <strong>Викладач:</strong> ${product.teacher || 'Призначено'}</li>
                    <li><i class="bi bi-check-circle text-success"></i> <strong>Статус:</strong> ${product.open ? 'Набір відкритий' : 'Набір закритий'}</li>
                </ul>
            `
        }
    }

    // Оновлюємо зображення
    const productImage = document.querySelector('#product-details img')
    if (productImage) {
        productImage.src = product.image
        productImage.alt = product.title
    }

    // Додаємо обробник для кнопки "Записатися"
    const addToCartBtn = document.querySelector('#add-to-cart-btn')
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(event) {
            cart.addItem(product)
        })
    }
}

// Ініціалізація сторінки товару
const productId = getProductIdFromURL()
console.log('Product ID from URL:', productId)

if (productId) {
    getProducts().then(function(products) {
        console.log('Products loaded:', products.length)
        const product = findProductById(products, productId)
        console.log('Found product:', product)
        displayProductDetails(product)
    })
} else {
    // Якщо ID не вказано, показуємо помилку
    console.log('No product ID in URL')
    const productDetails = document.querySelector('#product-details')
    productDetails.innerHTML = `
        <div class="col-12 text-center py-5">
            <h3>Курс не знайдено</h3>
            <a href="courses.html" class="btn btn-primary mt-3">Повернутися до каталогу</a>
        </div>
    `
}