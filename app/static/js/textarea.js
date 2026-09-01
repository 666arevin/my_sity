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
            processChatMessage(event);
            event.preventDefault();
        } else {
            event.preventDefault();
            return;
        };
    };
};

/**
 * 
 * @param {*} event -> объект самого события
 * @returns -> None
 */
function ClickHandlers(event) {
    // если пользователь ввел текст, отправляем сообщение на сервер
    if (TextArea.textContent.trim().length > 0) {

        // функция обработки отправки сообщения на сервер
        processChatMessage(event);
        // блокирует дальнейшее взаимодействие браузера с этим событием
        event.preventDefault();

    // елси поле для ввода пустое ничего не делаем
    } else {
        // блокирует дальнейшее взаимодействие браузера с этим событием
        event.preventDefault();
        return;
    }
}



function GetMessageId() {
    // берем длин (количество сообщений в чате)
    let num = ChatArea.children.length
    return num
}

// это общий блок для чата
const ChatArea = document.querySelector('.chat-areae');
// берем из html заготовку
let template = document.querySelector('#user-tpl');

/**
 * Функция renderUserInput отрисовывает сообщение пользователя на странице.
 * 
 * @param {*} text -> текст пользователя из поля для ввода
 * @param {*} mes_time -> время сообщения, если не указано, то берется текущее
 * @returns -> None
 */
function renderUserInput(text, mes_time = null) {
    // клонируем заготовку html чтобы не менять в коде
    const CloneTemplate = template.content.cloneNode(true);

    // ищем сервисный span для отображения время сообщения
    let span = CloneTemplate.querySelector('.service-information');
    // берем время сейчас
    let now = new Date()
    let time = now.toLocaleTimeString(('ru-RU', { timeZone: 'Europe/Moscow' }));

    // находим div в котром будет лежать основной текст пользователя
    const MessegeDiv = CloneTemplate.querySelector('.message');
    // создаем span для сообщения пользователя и заполняем его
    const MainSpan = document.createElement('span');
    MainSpan.classList.add('mes-text');
    MainSpan.textContent = text;
    // вставляем span с текстом в самое начало контейнера div
    MessegeDiv.prepend(MainSpan);

    if (mes_time == null) {
        span.textContent = time.slice(0, -3);
    } else {
        span.textContent = mes_time;
    }

    // склонированную и отредактированную заготовка добавляем в блок чата
    ChatArea.appendChild(CloneTemplate);
    // скролим чат вниз
    ChatArea.scrollTop = ChatArea.scrollHeight;
}
/**
 * Описание функции renderAIInput
 * 
 */
function renderAIInput(text, ai_agent, mes_time = null) {
    // определяем нужные переменные
    // клонируем template
    const CloneTemplateAI = template.content.cloneNode(true);
    // Ищем сервисный span для отображения время сообщения
    let span = CloneTemplateAI.querySelector('span');
    // div в котром будет лежать текст ИИ
    const MessegeDiv = CloneTemplateAI.querySelector('.message');


    // работаем с нашим макетом html
    // делаем span куда будет вставляться сообщение от ИИ
    const MainSpan = document.createElement('span');
    MainSpan.classList.add("main-information")
    MessegeDiv.prepend(MainSpan)

    // определяем сервисную инфомацию
    if (mes_time == null) {
        // если время не указано, берем текущее
        let now = new Date();
        let time = now.toLocaleTimeString(('ru-RU', { timeZone: 'Europe/Moscow' }));
        span.textContent = `${ai_agent} ${time.slice(0, -3)}`;
    } else {
        span.textContent = `${ai_agent} ${mes_time}`;
    }


    // добавляем класс определяющий сообщения от ИИ
    const messageArea = CloneTemplateAI.firstElementChild;
    messageArea.classList.add('ai-messege-area');

    // получаем id сообщения
    let mes_id = GetMessageId()
    // прибавляем 1 так как создаем новое сообщение
    mes_id += 1
    messageArea.id = `id-${mes_id}`
    // добавляем полученный обьект с ответом ИИ на страницу
    ChatArea.appendChild(CloneTemplateAI);
    // скролим чат вниз
    ChatArea.scrollTop = ChatArea.scrollHeight;
}

function RenderAIStream(text) {
    // получаем id последнего добавленного сообщения
    const mes_id = GetMessageId();
    
    let CurrentMessage = ChatArea.querySelector(`#id-${mes_id}`);
    CurrentMessage = CurrentMessage.querySelector(".message").querySelector(".main-information");

    // вставляем текст внутрь элемента для отрисовки на странице
    CurrentMessage.innerHTML = text
}

function AbortFun(abortController) {
    abortController.abort();
}

/**
 * Функция processChatMessage обрабатывает логку отправки сообщения,
 * введенного пользователем.
 * 
 * @param {*} event -> сам обьект события (нажатие на кнопку отправки)
 */
async function processChatMessage(event) {
    
    // создаем контроллер для await
    let abortController = new AbortController()

    // сразу снимаем все слушатели чтобы пользователь не мог отправить 2 запроса 
    SendButton.removeEventListener('click', ClickHandlers);
    document.removeEventListener('keydown', EnterHandlers);

    // блокирует дальнейшее взаимодействие браузера с этим событием
    event.preventDefault()

    // как только пользователь нажал включается анимация загрузки
    ChatBlock.classList.add('sending');
    // делаем чат активным если еще нет
    ChatWrapper.classList.add('active');

    // текст который ввел пользователь, очищаем поле для ввода
    const Text = TextArea.textContent;
    TextArea.textContent = ''
    // отрисовываем сообщение пользователя на странице
    renderUserInput(Text);


    // создаем виртуальную форму
    const formData = new FormData();
    // собираем данные и доавбляем их в форму
    // название ИИ которого выбрал пользовать 
    const ai_v = document.querySelector('#choose-ai').textContent;

    formData.append('ai_v', ai_v);
    formData.append('content', Text);
    formData.append('role', 'user');

    // ставим таймер через которое можно отмнить запрос к ИИ
    const chatTimeout = setTimeout(() => {
        // проверяем через 1.5 сек, что ответ от ИИ еще не пришел (есть класс sending)
        if (ChatBlock.classList.contains('sending')) {

            // показываем кнопку отмены,
            ChatBlock.classList.remove('sending');
            ChatBlock.classList.add('no-response');
        }
    }, 1500);
    // если ответа нет, даем пользователю право отменить запрос
    Cancel.addEventListener('click', AbortFun.bind(null, abortController));

    // делаем запрос на сервер с отправкой данных
    try {
        let response = await fetch('/api/userinput', { method: 'POST', body: formData, signal: abortController.signal });
        // создаеv html обьект, куда будем складывать сообщения от ИИ
        renderAIInput("", "ChatGPT")
        // открываем поток для чтения данных
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        // это буфер для хранения текста который нужно распарсить
        let MarkDownText = "";
        // запускаем цикл для чтения чанков от ИИ
        while (true) {
            // читаем следующий чанк
            const { done, value } = await reader.read();

            const chunk = decoder.decode(value, { stream: true });

            // если подключение оборвалось, выходим из цикла
            if (done) {
                console.log(done)
                break;
            }
            try {
                // делим если пришо несколько чанков (chunk - string)
                let list_chunks = chunk.split("\n\n");
                
                // убираем последний элемент списка, так как он всегда пустой
                list_chunks.pop();
                
                // проходимся по списку, где 1 элемент - 1 чанк
                // в каждом чанке лежит json с контентом от ИИ
                for (let i of list_chunks) {

                    // парсим json в словарь
                    let dict_chunck = JSON.parse(i);

                    // по данному пути лежит контент от ИИ
                    let content = dict_chunck.choices[0].delta.content;
                    MarkDownText += content;
                    res = marked.parse(MarkDownText);
                    console.log(MarkDownText)
                    
                    RenderAIStream(res);
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        console.log(MarkDownText);
        
    } catch (error) {
        console.log(error);

        // html = `<span class="error">Запрос был прерван пользователем</span>`;
        // renderAIInput(html, "ChatGPT");
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


function SmartParser(markdown) {
    // это парные теги, которые не получиться распарсить сразу

    // ПОДСКАЗКА: если мы видим эти теги, мы добавляем дальше текст на экран, но как только мы встретим
    patterns = [
        "**", "__", "*", "_", "~~", "`", , "["
    ]
    // это парные теги, которые могут содержать неограниченное количество пробелов
    block_patterns = [
        "```", "~~~"
    ]
}