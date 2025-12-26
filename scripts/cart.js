// Клас для роботи з кошиком
class ShoppingCart {
    constructor() {
        this.items = {}
        this.total = 0
        console.log('ShoppingCart конструктор викликаний')
        this.loadCartFromCookies()
        console.log('После loadCartFromCookies, items:', this.items)
        this.updateCartCount()
    }

    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.id]) {
            // Якщо товар вже є, збільшуємо його кількість
            this.items[item.id].quantity += 1
        } else {
            // Якщо товару немає, додаємо його
            this.items[item.id] = { ...item }
            this.items[item.id].quantity = 1
        }
        this.calculateTotal()
        this.saveCartToCookies()
        this.updateCartCount()
        this.showNotification('Товар додано до кошика!')
    }

    // Видалення товару з кошика
    removeItem(itemId) {
        delete this.items[itemId]
        this.calculateTotal()
        this.saveCartToCookies()
        this.updateCartCount()
    }

    // Зміна кількості товару
    updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
            this.removeItem(itemId)
        } else {
            this.items[itemId].quantity = quantity
            this.calculateTotal()
            this.saveCartToCookies()
            this.updateCartCount()
        }
    }

    // Очищення кошика
    clearCart() {
        this.items = {}
        this.total = 0
        this.saveCartToCookies()
        this.updateCartCount()
    }

    // Підрахунок загальної суми
    calculateTotal() {
        this.total = 0
        for (let key in this.items) {
            this.total += this.items[key].price * this.items[key].quantity
        }
    }

    // Отримання кількості товарів
    getItemCount() {
        let count = 0
        for (let key in this.items) {
            count += this.items[key].quantity
        }
        return count
    }

    // Оновлення лічильника в навігації
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count')
        const count = this.getItemCount()
        cartCountElements.forEach(element => {
            element.textContent = count
            if (count > 0) {
                element.style.display = 'inline'
            } else {
                element.style.display = 'none'
            }
        })
    }

    // Збереження кошика в localStorage (замість cookies для більш надійного зберігання)
    saveCartToCookies() {
        try {
            const cartJSON = JSON.stringify(this.items)
            localStorage.setItem('cart', cartJSON)
            console.log('Кошик збережено в localStorage')
        } catch (error) {
            console.error('Помилка при збереженні кошика:', error)
        }
    }

    // Завантаження кошика з localStorage (тепер основне сховище)
    loadCartFromCookies() {
        try {
            // Спочатку спробуємо завантажити з localStorage
            let cartData = localStorage.getItem('cart')
            console.log('Завантажено з localStorage:', cartData)
            
            if (cartData) {
                this.items = JSON.parse(cartData)
                this.calculateTotal()
                console.log('Кошик завантажено з localStorage:', this.items)
                return
            }
            
            // Якщо нема в localStorage, спробуємо з cookies (для сумісності)
            const cartCookie = getCookieValue('cart')
            console.log('Завантажено з cookies:', cartCookie)
            
            if (cartCookie && cartCookie !== '') {
                const decodedCookie = decodeURIComponent(cartCookie)
                this.items = JSON.parse(decodedCookie)
                this.calculateTotal()
                // Перенесемо в localStorage
                localStorage.setItem('cart', JSON.stringify(this.items))
                console.log('Кошик перенесено з cookies в localStorage:', this.items)
                return
            }
            
            console.log('Кошик не знайдено ні в localStorage ні в cookies')
        } catch (error) {
            console.error('Помилка при завантаженні кошика:', error)
            this.items = {}
            this.total = 0
        }
    }

    // Показати сповіщення
    showNotification(message) {
        // Створюємо елемент сповіщення
        const notification = document.createElement('div')
        notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3'
        notification.style.zIndex = '9999'
        notification.textContent = message
        document.body.appendChild(notification)

        // Видаляємо через 2 секунди
        setTimeout(() => {
            notification.remove()
        }, 2000)
    }
}

// Функція для отримання значення cookie
function getCookieValue(name) {
    try {
        const cookies = document.cookie.split('; ')
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=')
            if (cookieName === name && cookieValue) {
                return cookieValue
            }
        }
    } catch (error) {
        console.error('Помилка при отриманні cookie:', error)
    }
    return null
}

// Створення глобального об'єкта кошика
const cart = new ShoppingCart()