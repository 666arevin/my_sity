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


// обрабатывает нажатия на enter и enter + shift
function EnterHandlers(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            return;
        } else if (TextArea.textContent.length > 0) {
            SendUserInput();
            event.preventDefault();
        } else {
            event.preventDefault();
        };
    };
};

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

async function SendUserInput() {
    // текст который ввел пользователь
    const Text = TextArea.textContent;
    // виртуальная форма
    ChatWrapper.classList.add('active');
    
    renderUserInput(Text, 'ChatGPT')
    // renderAIInput()

    const formData = new FormData();
    
    formData.append('prompt', Text);
    let response = await fetch('/api/userinput', { method: 'POST', body: formData });
    response = await response.json();
    console.info(response.data)
};

SendButton.addEventListener('click', SendUserInput);
document.addEventListener('keydown', EnterHandlers);
