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

function SendUserInput() {
    // виртуальная форма
    ChatWrapper.classList.add('active');

    const formData = new FormData();
    const Text = TextArea.textContent;
    formData.append('prompt', Text);
    fetch('/api/userinput', {method: 'POST', body: formData});
};

SendButton.addEventListener('click', SendUserInput);
document.addEventListener('keydown', EnterHandlers);
