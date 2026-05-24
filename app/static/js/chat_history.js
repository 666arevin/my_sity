// Находим наш список в HTML
const listContainer = document.getElementById('chat-history');

// функция получает чаты и отрисовывает их в виде списка
async function renderChats() {
  // получаем чаты с сервера
  let Chats = await fetch('/get_chats')
  Chats = await Chats.json()
  Chats = Chats.data;

  console.log(Chats.forEach(chat => console.log(chat.annotation)));
  // Очищаем список на всякий случай
  listContainer.innerHTML = '';

  // Пробегаемся по каждому чату в списке
  Chats.forEach(chat => {
    // Создаем элемент списка li
    const li = document.createElement('li');
    li.className = 'chat-item'; // Даем класс для CSS

    // Наполняем его внутренностями (шаблонная строка)
    li.innerHTML = chat.annotation + "<br><span class='chat-item-span' id='chat-" + chat.id + "'>" + chat.req_count + "</span>"

    // Кладем готовый li внутрь нашего ul
    listContainer.appendChild(li);
    listContainer.appendChild(document.createElement('hr'));
  });
}

// Запускаем отрисовку!
renderChats();
