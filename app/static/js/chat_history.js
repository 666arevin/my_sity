// 1. Представим, что это данные, которые пришли с сервера
const myChats = [
  {epilogue: 'Готовка блинов заключает...', AI_name: "ChatGPT"},
  {epilogue: 'Это было прекрасное утро...', AI_name: "ChatGPT"},
  {epilogue: 'Удаление фона картинки...', AI_name: "ChatGPT"},
  {epilogue: 'Проект устава организации...', AI_name: "ChatGPT"}
]

// 2. Находим наш список в HTML
const listContainer = document.getElementById('chat-history');

// 3. Функция, которая превращает данные в "красивые карточки"
function renderChats(chats) {
  // Очищаем список на всякий случай
  listContainer.innerHTML = '';

  // Пробегаемся по каждому чату в списке
  chats.forEach(chat => {
    // Создаем элемент списка li
    const li = document.createElement('li');
    li.className = 'chat-item'; // Даем класс для CSS

    // Наполняем его внутренностями (шаблонная строка)
    li.innerHTML = chat.epilogue + "<br><span class='chat-item-span'>" + chat.AI_name + "</span>"

    // Кладем готовый li внутрь нашего ul
    listContainer.appendChild(li);
    listContainer.appendChild(document.createElement('hr'));
  });
}

// Запускаем отрисовку!
renderChats(myChats);
