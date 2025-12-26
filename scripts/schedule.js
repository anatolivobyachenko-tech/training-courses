// scripts/schedule.js
// Підтягує курси з products.json і генерує розклад у таблиці
(function() {
    async function loadProducts() {
        try {
            const res = await fetch('products.json')
            return await res.json()
        } catch (e) {
            console.error('Не вдалося завантажити products.json', e)
            return []
        }
    }

    // Простий генератор розкладу за категорією/типом курсу
    function generateScheduleForProduct(product) {
        // дефолтні варіанти днів
        const dayOptions = {
            'Математика': ['Пн, Ср', 'Вт, Чт'],
            'Англійська': ['Вт, Чт', 'Ср, Пт'],
            'Програмування': ['Сб', 'Нд'],
            'Фізика': ['Сб'],
            'Хімія': ['Чт'],
            'Література': ['Пн'],
            'Навички навчання': ['Сб'],
            'default': ['Пн, Ср']
        }

        const timeOptions = ['18:30 — 20:00', '19:00 — 20:30', '17:30 — 19:00', '11:00 — 12:30', '10:00 — 12:00']

        const days = dayOptions[product.category] || dayOptions['default']
        const time = timeOptions[product.id % timeOptions.length]

        // Якщо індивідуальний формат — вказуємо "за домовленістю"
        if (product.format && product.format.toLowerCase().includes('індив')) {
            return { course: product.title, day: 'За домовленістю', time: 'За домовленістю', format: product.format }
        }

        return { course: product.title, day: days[0], time: time, format: product.format || 'Онлайн' }
    }

    async function renderSchedule() {
        const products = await loadProducts()
        const tbody = document.querySelector('#schedule-body')
        if (!tbody) return

        // Якщо немає продуктів — залишаємо поточну розмітку
        if (!products || products.length === 0) return

        // Генеруємо рядки таблиці
        tbody.innerHTML = ''
        products.forEach(product => {
            const s = generateScheduleForProduct(product)
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td><a href="product.html?id=${product.id}" class="text-decoration-none">${escapeHtml(s.course)}</a></td>
                <td>${escapeHtml(s.day)}</td>
                <td>${escapeHtml(s.time)}</td>
                <td>${escapeHtml(s.format)}</td>
            `
            tbody.appendChild(tr)
        })
    }

    function escapeHtml(str) {
        if (!str) return ''
        return String(str).replace(/[&<>"']/g, function(ch) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[ch] })
    }

    // Запускаємо при завантаженні сторінки
    document.addEventListener('DOMContentLoaded', function() {
        renderSchedule()
    })
})();
