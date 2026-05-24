// Находим наш список в HTML
const listContainer = document.getElementById('chat-history');

// функция получает чаты и отрисовывает их в виде списка
async function renderChats() {
	// получаем чаты с сервера
	let Chats = await fetch('/get_chats')
	Chats = await Chats.json()
	Chats = Chats.data;

	// Очищаем список на всякий случай
	listContainer.innerHTML = '';

	// Пробегаемся по каждому чату в списке
	Chats.forEach(chat => {
		// Создаем элемент списка li
		const li = document.createElement('li');
		li.className = 'chat-item'; // Даем класс для CSS
		li.id = 'chat-' + chat.id; // Даем id для взаимодействия

		// Наполняем его внутренностями (шаблонная строка)
		li.innerHTML = chat.annotation + "<br><span class='chat-item-span'>" + chat.req_count + "</span>"

		// Кладем готовый li внутрь нашего ul
		listContainer.appendChild(li);
		listContainer.appendChild(document.createElement('hr'));
	});
}

// Запускаем отрисовку!
renderChats();



// взаимодействие с чатами, открытие чатов и их отрисовка
// это все чаты
const ChatHistoryItems = document.querySelectorAll("chat-item")
// берем из html заготовку и кланируем ее
let Template = document.querySelector('#user-tpl');
const CloneTemplate = template.content.cloneNode(true);


async function OpenChat(event) {
	// проверяем что клик именно по элементу
	if (!event.target.classList.contains("chat-item")) {
		return;
	} else {
		// очищаем чат
		ChatArea.innerHTML = ''
		// получаем id чата
		let chatId = event.target.id.split("-")[1];

		let chatData = await fetch(
			'/get_chatData', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(chatId)
		});
		chatData = await chatData.json();
		chatData.forEach(mes => {
			if (mes.role == 'user') {
				renderUserInput(mes.content, mes.ai_agent, mes.message_time);
			} else {
				renderAIInput(mes.content, mes.message_time);
			}});
		
		// renderAIInput

	}
}

listContainer.addEventListener("click", (event) => OpenChat(event))
