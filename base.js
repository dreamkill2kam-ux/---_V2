/* Единый информационный портал (ЕИП) - Базовые скрипты (base.js) */

// 1. Раскрытие категорий меню
function toggleMenuCategory(groupId) {
    const group = document.getElementById(groupId);
    const submenu = group.querySelector('.submenu-list');
    const isOpen = group.classList.contains('open');

    // Сворачиваем остальные категории
    const allGroups = document.querySelectorAll('.menu-group');
    allGroups.forEach(g => {
        g.classList.remove('open');
        const sub = g.querySelector('.submenu-list');
        if (sub) sub.style.maxHeight = null;
    });

    // Раскрываем нужную
    if (!isOpen) {
        group.classList.add('open');
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    }
}

// 2. Переключение статей контента
function switchTab(clickedButton) {
    const targetArticleId = clickedButton.getAttribute('data-article');

    // Переключаем активную кнопку в меню
    const allItems = document.querySelectorAll('.menu-item');
    allItems.forEach(item => item.classList.remove('active'));
    clickedButton.classList.add('active');

    // Переключаем активную статью
    const articles = document.querySelectorAll('.article-page');
    articles.forEach(article => article.classList.remove('active'));

    const targetArticle = document.getElementById(targetArticleId);
    if (targetArticle) {
        targetArticle.classList.add('active');
        // Прокручиваем контент наверх
        const mainContentPanel = document.querySelector('.main-content');
        if (mainContentPanel) mainContentPanel.scrollTop = 0;
    }
}

// 3. Лайтбокс для картинок (полноэкранный просмотр)
function openFullscreenImage(imageSrc) {
    const overlay = document.getElementById('imageOverlay');
    const fullscreenImg = document.getElementById('fullscreenImage');
    if (overlay && fullscreenImg) {
        fullscreenImg.src = imageSrc;
        overlay.style.display = 'flex';
    }
}

function closeFullscreenImage() {
    const overlay = document.getElementById('imageOverlay');
    if (overlay) overlay.style.display = 'none';
}

// 4. Поповеры для терминов
function openPopover(event, definitionText) {
    event.stopPropagation();
    const popover = document.getElementById('textPopover');
    const clickedElement = event.currentTarget;
    if (!popover || !clickedElement) return;

    popover.classList.remove('popover-bottom');
    popover.innerHTML = definitionText;
    popover.style.display = 'block';

    const rect = clickedElement.getBoundingClientRect();
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;

    let targetTop = 0;
    if (rect.top < (popoverHeight + 20)) {
        popover.classList.add('popover-bottom');
        targetTop = rect.bottom + 8;
    } else {
        targetTop = rect.top - popoverHeight - 8;
    }

    let targetLeft = rect.left + (rect.width / 2) - (popoverWidth / 2);
    const maxRight = window.innerWidth - popoverWidth - 20;

    if (targetLeft > maxRight) targetLeft = maxRight;
    if (targetLeft < 20) targetLeft = 10;

    popover.style.left = targetLeft + 'px';
    popover.style.top = targetTop + 'px';
}

function closePopover() {
    const popover = document.getElementById('textPopover');
    if (popover) popover.style.display = 'none';
}

// 5. Вкладки ролей (для конструкторов)
function switchRoleTab(clickedBtn, tabId) {
    const container = clickedBtn.closest('.role-tabs-container');
    const allBtns = container.querySelectorAll('.role-tab-btn');
    const allContents = container.querySelectorAll('.role-tab-content');

    allBtns.forEach(btn => btn.classList.remove('active'));
    allContents.forEach(content => content.classList.remove('active'));

    clickedBtn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// 7. FAQ Логика (Аккордеон и фильтры)
function toggleFaq(element) {
    const card = element.parentElement;
    card.classList.toggle('open');
}

function filterFaq() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return; // Если на странице нет FAQ, прерываем функцию

    const searchText = searchInput.value.toLowerCase();
    const activeChip = document.querySelector('.faq-filter-chip.active:not(.red-zone)');
    const redZoneOnly = document.getElementById('filterRedZone').classList.contains('active');
    const activeAudience = activeChip ? activeChip.getAttribute('data-aud') : 'Все';

    const cards = document.querySelectorAll('.faq-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const audiences = card.getAttribute('data-audience').split(',');
        const isRedZone = card.getAttribute('data-redzone') === 'true';

        const matchSearch = text.includes(searchText);
        const matchAudience = activeAudience === 'Все' || audiences.includes('Все') || audiences.includes(activeAudience);
        const matchRedZone = !redZoneOnly || isRedZone;

        if (matchSearch && matchAudience && matchRedZone) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
            card.classList.remove('open');
        }
    });
}

// 6. Глобальные слушатели и АВТОГЕНЕРАЦИЯ HTML-КОНТЕЙНЕРОВ
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // --- АВТО-ГЕНЕРАЦИЯ МОДАЛЬНОГО ОКНА СПРАВКИ ---
    // ==========================================
    if (!document.getElementById('helpModalOverlay')) {
        const modalHTML = `
            <div id="helpModalOverlay" class="help-modal-overlay" onclick="closeHelpModal(event)">
                <div class="help-modal-box" onclick="event.stopPropagation()">
                    <button class="help-modal-close" onclick="closeHelpModal(event)">×</button>
                    <h3 id="helpModalTitle" style="margin-top: 0; margin-bottom: 15px; color: var(--text-main);">Заголовок</h3>
                    <div id="helpModalText" style="color: var(--text-main); line-height: 1.6; font-size: 15px;">
                        Текст подсказки...
                    </div>
                </div>
            </div>
        `;
        // Вставляем окно в самый конец тега <body>
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    // ==========================================
    // --- ИНИЦИАЛИЗАЦИЯ СНИППЕТОВ ПОДСКАЗОК (eip-help) ---
    // ==========================================
    const helpIcons = document.querySelectorAll('.eip-help');
    helpIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            // Читаем данные прямо из атрибутов сниппета
            const title = this.getAttribute('data-title') || 'Справка';
            const text = this.getAttribute('data-text') || 'Текст не указан.';

            // Открываем модальное окно (функция openHelpModal должна быть в этом же файле)
            openHelpModal(title, text);
        });
    });
    // --- АВТОМАТИЧЕСКОЕ СОЗДАНИЕ КОНТЕЙНЕРОВ (если их нет в HTML) ---
    if (!document.getElementById('textPopover')) {
        const popoverDiv = document.createElement('div');
        popoverDiv.id = 'textPopover';
        popoverDiv.className = 'popover-box';
        document.body.appendChild(popoverDiv);
    }

    if (!document.getElementById('imageOverlay')) {
        const imgOverlay = document.createElement('div');
        imgOverlay.id = 'imageOverlay';
        imgOverlay.className = 'img-overlay';
        imgOverlay.setAttribute('onclick', 'closeFullscreenImage()');
        imgOverlay.innerHTML = '<span class="img-overlay-close">&times;</span><img id="fullscreenImage" src="" alt="Увеличенное изображение">';
        document.body.appendChild(imgOverlay);
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ПОПОВЕРОВ ---

    // Закрытие поповера при клике в пустую область
    document.addEventListener('click', function (e) {
        const popover = document.getElementById('textPopover');
        if (popover && e.target !== popover && !popover.contains(e.target)) {
            closePopover();
        }
    });

    // Закрытие поповера при прокрутке контента
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.addEventListener('scroll', closePopover);
    }

    // ==========================================
    // --- FAQ СЛУШАТЕЛИ СОБЫТИЙ ---
    // ==========================================
    const faqSearch = document.getElementById('faqSearch');
    if (faqSearch) {
        faqSearch.addEventListener('input', filterFaq);
    }

    const filterRedZone = document.getElementById('filterRedZone');
    if (filterRedZone) {
        filterRedZone.addEventListener('click', function () {
            this.classList.toggle('active');
            filterFaq();
        });
    }

    const filterChips = document.querySelectorAll('.faq-filter-chip:not(.red-zone)');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function () {
            // Снимаем выделение со всех чипов и ставим на нажатый
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterFaq();
        });
    });
    // ==========================================
    // --- ГЛОБАЛЬНОЕ УВЕЛИЧЕНИЕ КАРТИНОК ---
    // ==========================================
    const articleImages = document.querySelectorAll('.article-page img');

    articleImages.forEach(img => {
        // Меняем курсор на лупу, чтобы логист понимал, что на картинку можно нажать
        img.style.cursor = 'zoom-in';

        // Вешаем слушатель клика на каждую картинку
        img.addEventListener('click', function () {
            const overlay = document.getElementById('imageOverlay');
            const fullImg = document.getElementById('fullscreenImage');

            if (overlay && fullImg) {
                fullImg.src = this.src; // Берем путь картинки, на которую кликнули
                overlay.style.display = 'flex'; // Показываем темный фон
                overlay.style.animation = 'contentFadeIn 0.2s ease-out'; // Плавное появление
            }
        });
    });
}); // <-- ЗАКРЫВАЕТСЯ БЛОК DOMContentLoaded

// Открытие модального окна справки
function openHelpModal(title, text) {
    document.getElementById('helpModalTitle').innerText = title;
    document.getElementById('helpModalText').innerHTML = text; // Позволяет передавать HTML (например, <b>жирный текст</b>)

    const overlay = document.getElementById('helpModalOverlay');
    overlay.style.display = 'flex';

    // Небольшая задержка для срабатывания CSS-анимации плавного появления
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.help-modal-box').style.transform = 'translateY(0)';
    }, 10);
}

// Закрытие окна
function closeHelpModal(e) {
    if (e) e.preventDefault();
    const overlay = document.getElementById('helpModalOverlay');
    overlay.style.opacity = '0';
    overlay.querySelector('.help-modal-box').style.transform = 'translateY(20px)';

    setTimeout(() => {
        overlay.style.display = 'none';
    }, 200); // Ждем окончания анимации перед скрытием
}

// Инициализация кастомного аудио-плеера (Audio Summary)
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('summary-audio');
    const playBtn = document.getElementById('audio-play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const progressBg = document.getElementById('audio-progress-bg');
    const progressFill = document.getElementById('audio-progress-fill');
    const timeDisplay = document.getElementById('audio-time');

    // Если на странице нет плеера - прерываем скрипт
    if (!audio || !playBtn) return;

    // Вспомогательная функция для форматирования времени (ММ:СС)
    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds)) return "00:00";
        const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Обновление текстового блока с таймингом
    const updateTime = () => {
        const currentTime = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration);
        timeDisplay.textContent = `${currentTime} / ${duration}`;
    };

    // Слушатель загрузки метаданных (чтобы корректно отобразить общую длину трека при старте)
    audio.addEventListener('loadedmetadata', updateTime);

    // Логика Play/Pause с подменой иконок
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    // Движение ползунка прогресс-бара
    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progressPercent || 0}%`;
        updateTime();
    });

    // Перемотка трека по клику на прогресс-бар
    progressBg.addEventListener('click', (e) => {
        const rect = progressBg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * audio.duration;
        audio.currentTime = newTime;
    });

    // Сброс состояния плеера, когда трек закончился
    audio.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        progressFill.style.width = '0%';
        audio.currentTime = 0;
        updateTime();
    });
});