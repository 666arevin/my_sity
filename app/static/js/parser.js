// перменная в которой накапливаются не обработанные чанк 
let MarkdownBuffer = "";
let Memory = "";
let ResponseStart = true;

// Адаптировано под актуальный синтаксис marked 
marked.use({
    renderer: {
        code(token) {
            const codeText = token.text || '';
            const lang = token.lang || 'plaintext';
            
            // Защита: проверяем, загрузился ли хайлайтер в браузере
            if (typeof window.hljs !== 'undefined') {
                const validLanguage = hljs.getLanguage(lang) ? lang : 'plaintext';
                const highlighted = hljs.highlight(codeText, { language: validLanguage }).value;
                return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
            }
            
            // Если хайлайтер по какой-то причине не успел, выводим обычный текст без покраски
            return `<pre><code class="language-${lang}">${codeText}</code></pre>`;
        }
    }
});


// паттерны для многострочных символов, разрываются только при парном символе.
// MLP - Multi Line Paired
const MLPPattern = /^(```|~~~|\$\$)|<think>|\[/


// если равен 1, значит ждем парного тега и очищаем
let MLPDetector = 0
// если равен 1, значит таблица
let TableDetector = 0;

// значение от 0 до 2, количество переносов
// String-Break Detector
let LBDetector = 0

function SmartBuffer (ChunkContent, done=null) {

  // если начало стриминга, чистим все буферы
  if (ResponseStart) {
    MarkdownBuffer = "";
    Memory = "";
    LBDetector = 0;
    ResponseStart = false;
    
  };

  // елси конец стриминга, меняем флаг ResponseStart на true
  if (done) {
    ResponseStart = true;
  };

  // если закончилсь строка проверяем ее
  if (ChunkContent.includes("\n")) {
    // нашли разрыв строки
    LBDetector = 1

    // проверяем нет ли там спец символов, которые не закрываются при \n
    match = MarkdownBuffer.match(MLPPattern);
    console.log("mark -> " + MarkdownBuffer, "match -> " + match);

    // если есть спец символы, которые не закрываются при \n
    if (match) {
      MLPDetector = 1;
    };
  };
  
//----------
// тут парсим текст 
  MarkdownBuffer += ChunkContent
  HTMLText = marked.parse(MarkdownBuffer)
  
// ----------

  // если нашли \n
  if (LBDetector == 1) {
    if (MLPDetector == 1) {
      
    } else {
      // поскольку буфер будет очищен, сохраняем уже распаршенный HTML
      Memory += HTMLText;
      // чистим HTML чтобы не продублировать один и тот же текст
      HTMLText = "";

      MarkdownBuffer = "";
      LBDetector = 0;
    };
  };

  console.log(MarkdownBuffer);
  
  return Memory + HTMLText;
};