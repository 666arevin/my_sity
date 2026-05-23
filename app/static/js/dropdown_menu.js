// первое выпадающие меню
const ParentContainer = document.querySelector('.first-drop-menu');
const ButtonContainer = document.querySelector('#ai-models');
const DropMenu = document.querySelector('.first-drop-list');
const Button = document.querySelector('#choose-ai');


// второе выпадающее меню
// это общий контенйер нужен для добавления класса visible
const ParentContainer_2 = document.querySelector('.second-drop-menu');
// это контейнер с кнопкой, нужен для открытия списка
const ButtonContainer_2 = document.querySelector('#ai-mode');
// это сам список, нужен для получения текста выбранного пункта
const DropMenu_2 = document.querySelector('.second-drop-list');
// это кнопка, нужен для изменения текста на выбранный пункт
const Button_2 = document.querySelector('#choose-mode');


function OpenMenu(event, parent_container, menu, button) {
    // делаем список видимым если он еще не открыт
    let isVisible = parent_container.classList.toggle("visible")
    // останавливаем событие, чтобы меню сразу не закрылось
    event.stopPropagation()
}

function CloseMenu(parent_container) {
    // удаляем класс, который делал список видимым
    parent_container.classList.remove("visible");
}

function ChooseListItem(event, parent_container, button) {
    
    // если клик по пункту из списка
    if (event.target.classList.contains('drop-menu-item')) {
        // получаем текст элемента, на котрой кликнули
        let TargetText = event.target.querySelector(".main-info").textContent
        // меняем текст кнопки на выбранный
        button.textContent = TargetText;

        CloseMenu(parent_container);
    }
}

function CloseAllMenus(event) {
    // если клик не по пункту, закрываем все меню
    if (!event.target.classList.contains("drop-menu-item")) {
        ParentContainer.classList.remove("visible");
        ParentContainer_2.classList.remove("visible");
    }
}


// вещаем слушатели
// слушатель который будет закрывать все меню
window.addEventListener('click', (event) => CloseAllMenus(event))
// Клик по контейнеру, который ответчает за открытие
ButtonContainer.addEventListener(
    'click',
     (event) => OpenMenu(
        event, ParentContainer, DropMenu, Button
     ))
ButtonContainer_2.addEventListener(
    'click',
     (event) => OpenMenu(
        event, ParentContainer_2, DropMenu_2, Button_2
     ))

// слушатель для списка
DropMenu.addEventListener(
    'click',
    (event) => ChooseListItem(
        event, ParentContainer, Button
    ))
DropMenu_2.addEventListener(
    'click',
    (event) => ChooseListItem(
        event, ParentContainer_2, Button_2
    ))