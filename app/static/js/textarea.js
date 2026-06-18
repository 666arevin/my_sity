// div с текстом который ввел пользователь
const TextArea = document.querySelector('#user-prompt');
const ChatBlock = document.querySelector('.chat-block ');

// скролл чата вниз
window.addEventListener('DOMContentLoaded', () => {
    ChatArea.scrollTop = ChatArea.scrollHeight;
});

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

// это общий блок для чата
const ChatArea = document.querySelector('.chat-areae');
// берем из html заготовку
let template = document.querySelector('#user-tpl');

function renderUserInput(text, mes_time = null) {
    // клонируем его чтобы не менять в коде
    const CloneTemplate = template.content.cloneNode(true);
    // Ищем span чтобы встаить текст
    let span = CloneTemplate.querySelector('.service-information');
    // берем время сейчас
    let now = new Date()
    let time = now.toLocaleTimeString(('ru-RU', { timeZone: 'Europe/Moscow' }));

    const MessegeDiv = CloneTemplate.querySelector('.message');
    // создаем span для сообщения пользователя
    const MainSpan = document.createElement('span');
    MainSpan.classList.add('mes-text');
    MainSpan.textContent = text;
    MessegeDiv.prepend(MainSpan);

    if (mes_time == null) {
        span.textContent = time.slice(0, -3);
    } else {
        span.textContent = mes_time;
    }
    
    
    ChatArea.appendChild(CloneTemplate);
    // скролим чат вниз
    ChatArea.scrollTop = ChatArea.scrollHeight;
}

function renderAIInput(text, ai_agent, mes_time = null) {
    // клонируем template
    const CloneTemplateAI = template.content.cloneNode(true);
    // Ищем span чтобы встаить текст
    let span = CloneTemplateAI.querySelector('span');
    // берем время сейчас
    let now = new Date()
    let time = now.toLocaleTimeString(('ru-RU', { timeZone: 'Europe/Moscow' }));

    // div в котром будет лежать текст ИИ
    const MessegeDiv = CloneTemplateAI.querySelector('.message');
    MessegeDiv.insertAdjacentHTML('afterbegin', text);

    if (mes_time == null) {
        span.textContent = `${ai_agent} ${time.slice(0, -3)}`;
    } else {
        span.textContent = `${ai_agent} ${mes_time}`;
    }

    // добавляем класс определяющий сообщения от ИИ
    const messageArea = CloneTemplateAI.firstElementChild;
    messageArea.classList.add('ai-messege-area');
    // добавляем код на страницу
    ChatArea.appendChild(CloneTemplateAI);
    // скролим чат вниз
    ChatArea.scrollTop = ChatArea.scrollHeight;
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
    TextArea.textContent = ''
    // виртуальная форма
    const formData = new FormData();

    renderUserInput(Text);
    // renderAIInput()

    // собираем данные и создаем форму
    const ai_v = document.querySelector('#choose-ai').textContent;

    formData.append('ai_v', ai_v);
    formData.append('content', Text);
    formData.append('role', 'user');

    // ставим таймер
    setTimeout(() => {
        if (ChatBlock.classList.contains('sending')) {
            ChatBlock.classList.remove('sending');
            ChatBlock.classList.add('no-response');
        }
    }, 4000);
    // если ответа нет даем пользователю право отменить запрос
    Cancel.addEventListener('click', AbortFun.bind(null, abortController));

    // делаем запрос на сервер с отправкой данных
    try {
        let response = await fetch('/api/userinput', { method: 'POST', body: formData, signal: abortController.signal });
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            console.log(chunk);
            
        }
        console.log(reader);
        
        // renderAIInput(response.data, "ChatGPT");
    } catch (error) {
        html = `<span class="error">Запрос был прерван пользователем</span>`;
        renderAIInput(html, "ChatGPT");
    } finally {
        ChatBlock.classList.remove('sending');
        ChatBlock.classList.remove('no-response');
    }

    Cancel.removeEventListener('click', AbortFun)
    SendButton.addEventListener('click', ClickHandlers);
    document.addEventListener('keydown', EnterHandlers);
};

SendButton.addEventListener('click', ClickHandlers);
document.addEventListener('keydown', EnterHandlers);
