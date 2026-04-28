// div с текстом который ввел пользователь
const TextArea = document.querySelector('#user-prompt');
const ChatBlock = document.querySelector('.chat-block ');

function adjustHeight(el, ChatBlock) {

    if (el.scrollHeight > 24) {
        ChatBlock.classList.add('big-area');

    };

    if (el.scrollHeight < 40) {
        ChatBlock.classList.remove('big-area');
    };

};

TextArea.addEventListener('input', () => {
    adjustHeight(TextArea, ChatBlock);
});

// кнопка которая отправлет текст и файлы на сервер
const SendButton = document.querySelector('#send-prompt')
// input в который пользователь может положить файл
const InputFiles = document.querySelector('#file-input')
// это блок который отвечает за позицианирование chat-block
const ChatWrapper = document.querySelector('.chat-wrapper')
// кнопка отмены запроса
const Cancel = document.querySelector('.cancellation')


// обрабатывает нажатия на enter и enter + shift
function EnterHandlers(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            return;
        } else if (TextArea.textContent.trim().length > 0) {
            SendUserInput(event);
            event.preventDefault();
        } else {
            event.preventDefault();
            return;
        };
    };
};

function ClickHandlers(event) {
    if (TextArea.textContent.trim().length > 0) {
        SendUserInput(event);
        event.preventDefault();
    } else {
        event.preventDefault();
        return;
    }
}

function renderUserInput(text, ai_agent) {
    // это общий блок для чата
    const ChatArea = document.querySelector('.chat-areae');
    // берем из html заготовку
    let template = document.querySelector('#user-tpl');
    // клонируем его чтобы не менять в коде
    const CloneTemplate = template.content.cloneNode(true);
    // Ищем span чтобы встаить текст
    let span = CloneTemplate.querySelector('span');

    const MessegeDiv = CloneTemplate.querySelector('.message');
    // создаем span для сообщения пользователя
    const MainSpan = document.createElement('span');
    MainSpan.classList.add('mes-text');
    MainSpan.textContent = text;
    MessegeDiv.prepend(MainSpan);

    span.textContent = '14:28';

    ChatArea.appendChild(CloneTemplate);
}


function AbortFun(abortController) {
    abortController.abort();
}


async function SendUserInput(event) {
    // создаем контроллер для await
    let abortController = new AbortController()
    // сразу снимаем все слушатели чтобы пользователь не мог отправить 2 запроса 
    SendButton.removeEventListener('click', ClickHandlers);
    document.removeEventListener('keydown', EnterHandlers);
    event.preventDefault()
    // как только пользователь нажал включается анимация загрузки
    ChatBlock.classList.add('sending');
    // делаем чат активным если еще нет
    ChatWrapper.classList.add('active');
    // текст который ввел пользователь
    const Text = TextArea.textContent;
    // виртуальная форма
    const formData = new FormData();


    renderUserInput(Text, 'ChatGPT')
    // renderAIInput()

    formData.append('prompt', Text);
    // ставим таймер
    setTimeout(() => {
        ChatBlock.classList.remove('sending');
        ChatBlock.classList.add('no-response');
    }, 4000);
    // если ответа нет даем пользователю право отменить запрос
    Cancel.addEventListener('click', AbortFun.bind(null, abortController));

    // делаем запрос на сервер с отправкой данных
    try {
        let response = await fetch('/api/userinput', { method: 'POST', body: formData, signal: abortController.signal });
        response = await response.json();
        console.info('Ответ от сервера получен')
    } catch (error) {
        console.info('Операция остановлена пользователем')
    } finally {
        ChatBlock.classList.remove('no-response');
    }

    Cancel.removeEventListener('click', AbortFun)
    SendButton.addEventListener('click', ClickHandlers);
    document.addEventListener('keydown', EnterHandlers);
};

SendButton.addEventListener('click', ClickHandlers);
document.addEventListener('keydown', EnterHandlers);
