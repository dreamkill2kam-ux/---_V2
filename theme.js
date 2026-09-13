document.addEventListener("DOMContentLoaded", () => {
    // 1. Автоматически создаем кнопку на странице
    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.className = "theme-toggle-btn";
    btn.title = "Переключить тему";
    btn.innerHTML = '<span class="theme-icon">🌓</span>';
    document.body.appendChild(btn);

    // 2. Логика переключения
    const rootElement = document.documentElement; 
    
    // Проверяем память браузера
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        rootElement.setAttribute('data-theme', currentTheme);
    }

    // Обрабатываем клик
    btn.addEventListener('click', () => {
        let theme = rootElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        
        rootElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});