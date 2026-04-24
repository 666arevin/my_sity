
const ParentContainer = document.querySelector('.drop-down-menu');
const ButtonContainer = document.querySelector('.edging');
const DropMenu = document.querySelector('.drop-down-list');
const Button = document.querySelector('#drop-menu');


DropMenu.addEventListener('click', (event) => {
    // Проверяем, что кликнули именно по пункту меню (li)
    if (event.target.classList.contains('drop-menu-item')) {
        
        const choice = event.target.textContent; // Получаем текст (напр. "ChatGPT")
        
        // 1. Меняем текст кнопки на выбор пользователя
        Button.textContent = choice;
        
        // 2. Закрываем меню
        close();
    }
});



function ShowDropMenu(event) {
    event.stopPropagation();
    
    // Если меню уже открыто — закрываем, если нет — открываем
    const isVisible = ParentContainer.classList.toggle('visible');


    if (isVisible) {
        // Вешаем событие на окно, только если меню открылось
        window.addEventListener('click', close);
    } else {
        // Если закрыли кнопкой — снимаем обработчик
        window.removeEventListener('click', close);
    }
}

function close() {
    ParentContainer.classList.remove('visible');
    // Как только закрыли — удаляем слушатель с окна
    window.removeEventListener('click', close);
}

ButtonContainer.addEventListener('click', ShowDropMenu);