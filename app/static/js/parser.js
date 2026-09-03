// перменная в которой накапливаются не // обработанные чанк 
let MarkdownBuffer = "";

//паттерны распознования однострочный элементов рвуться при /n
// SSL - Start of Single Line (не нужен по факту)
const SSLPattern = /^\s{0,3}(#|---|>|-|\*|\+|\d+\.)\s+/;
// SL - Single Line
const SLPattern = /`.+`|!?\[.+?\]\(.+?\)/;


// паттерн распознования многострочных элементов, разрываются /n/n
// ML - Multi Line 
const MLPattern = /\*\*.+\*\*|\*.+\*|\~\~.+\~\~|.```/
// паттерны для многостросный символов, разрыыаются /n/n
// MLP - Multi Line Paired
const MLPPattern = /^\s{4,}.+|^```[a-zA-Z0-9_-]*$/
[">", "-", "1.", "~~", /^>/,];
// если равен 3, значит началась таблица
let TableDetector = 0;
// если равен 1 значит ждем /n и очищаем
let SLDetector = 0
// есоли равен 1, знкчит жжем /n/n или парного тега и очищаем
let MLPDetector = 0

// значение от 0 до 2, количество перенсов строки в чанке
// Lone-Break Detector
let LBDetector = 0

function SmartBuffer (ChunkContent) {

  // проверяем что буффер пуст, значит это начало строки
  // проходимся по символам в котенте чанка
  for (let i in ChunkContent) {
    // если нашли символ, изменяем detector для однострочных
    if (i in SLPattern) {
      SLDetector = 1;
    };

    // проверяем бы ли разрывы строки и считаем их количество
    if (i == "\n") {
      LBDetector += 1;
    };
  };
  
//----------
// тут парсим текст 
  MarkdownBuffer += ChunkContent
  HTMLText = parse(MarkdownBuffer)
// ----------
  
// после проверок мы очищаем или не очищаем буффер
// если однострочный режим и был \n чистим буффер
  if (SLDetector == 1 && LBDetector == 1) {
    // очищаем буффер
    
    SLDetector = 0
    LBDetector = 0
  };
};