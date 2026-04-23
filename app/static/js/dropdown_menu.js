
const button = document.querySelector("#drop-menu")
const DropMenu = document.querySelector(".drop-down-list");
const ButtonContainer = document.querySelector('.edging')
const Arrow = document.querySelector('#arrow-ico')
// let content = null

// function ButtonContent(content) {
//     if 
// }

function ShowDropMenu(event) {
    event.stopPropagation();
    
    // Если меню уже открыто — закрываем, если нет — открываем
    const isVisible = DropMenu.classList.toggle('visible');
    ButtonContainer.classList.toggle('effect')
    button.classList.toggle('effect')
    Arrow.classList.toggle('arrow')

    if (isVisible) {
        // Вешаем событие на окно, только если меню открылось
        window.addEventListener('click', close);
    } else {
        // Если закрыли кнопкой — снимаем обработчик
        window.removeEventListener('click', close);
    }
}

function close() {
    DropMenu.classList.remove('visible');
    ButtonContainer.classList.remove('effect')
    button.classList.remove('effect')
    // Как только закрыли — удаляем слушатель с окна
    window.removeEventListener('click', close);
}

button.addEventListener('click', ShowDropMenu);


DropMenu.addEventListener('click', (event) => {
    // Проверяем, что кликнули именно по пункту меню (li)
    if (event.target.classList.contains('drop-menu-item')) {
        
        const choice = event.target.textContent; // Получаем текст (напр. "ChatGPT")
        
        console.log("Пользователь выбрал:", choice); // Теперь компьютер "видит" выбор
        
        // 1. Меняем текст кнопки на выбор пользователя
        button.textContent = choice;
        
        // 2. Закрываем меню
        close();
    }
});
