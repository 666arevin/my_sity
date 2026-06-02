// Находим наш список в HTML
const listContainer = document.getElementById('chat-history');

// функция получает чаты и отрисовывает их в виде списка
async function renderChats() {
	try {
		// получаем чаты с сервера
		let response = await fetch('/get_chats')


		// Очищаем список на всякий случай
		listContainer.innerHTML = '';

		if (!response.ok) {
			ErrorJson = await response.json()

			const li = document.createElement('li');
			li.className = 'chat-item-error'; // Даем класс для CSS
			li.id = 'chat-error' // Даем id ошибки

			// Наполняем его внутренностями (шаблонная строка)
			li.innerHTML = "Ошибка загрузки чатов" + "<br><span class='chat-item-span'>" + "</span>"

			// Кладем готовый li внутрь нашего ul
			listContainer.appendChild(li);

			// логируем ошибку в консоль для отладки
			console.log(ErrorJson.error);

		} else {
			// распаковываем данные с сервера
			let Chats = await response.json()
			Chats = Chats.data

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

	} catch (error) {
		console.error('Ошибка при загрузке чатов:', error);
		return;
	}


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
	} else if (event.target.id == "chat-error") {
		return;
	} else {
		// очищаем чат
		ChatArea.innerHTML = ''
		// получаем id чата
		let chatId = event.target.id.split("-")[1];

		try {
			let chatData = await fetch(
				'/get_chatData', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(chatId)
			});
			chatData = await chatData.json();

			chatData.forEach(mes => {
				if (mes.role == 'user') {
					renderUserInput(mes.content, mes.message_time);
				} else {
					renderAIInput(mes.content, mes.ai_v, mes.message_time);
				}
			});
		} catch (error) {
			console.error('Ошибка при загрузке данных чата:', error);
		}

	}
}

listContainer.addEventListener("click", (event) => OpenChat(event))



// создание нового чата

async function CreateNewChat() {
	let newChat = await fetch('/create_chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({})
	});
	newChat = await newChat.json();
}