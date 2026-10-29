
// определяем перменные и флаги
let MarkdownBuffer = ""; // нераспаршенный текст (буфер)
let Memory = ""; // перменная тунель, чтобы очистить HTMLText но не потерять данные
let HTMLText = ""; // накопленный распаршенный HTML
let ResponseStart = true; // флаг, является ли чанк первым
let isDataReady = false; // флаг, был ли обработан тег и готов ли он к отрисовки
let AfterBrake = undefined; // данные после \n если такое было в чанке

// Достаём функции из глобальных объектов, которые создали UMD-скрипты
const { Marked } = globalThis.marked;
const { markedHighlight } = globalThis.markedHighlight;
const markedKatex = globalThis.markedKatex;

const marked = new Marked(
    markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
        },
    }),
);
marked.use(markedKatex({ throwOnError: false }));

// паттерны для многострочных символов, разрываются только при парном символе.
// MLP - Multi Line Paired
// под 0 индексом поиск открывающего тега, под 1 закрывающего
const MLPPattern = [
    /^(```(?!`)|~~~(?!~)|\$\$)|<think>/g,
    /\n\s{0,3}(?:```(?!`)|~~~(?!~))(?:\n|$)|\$\$|<\/think>/
];
// TP - Table Pattern
// первым лежит поиск шапки таблицы, вторым подтверждение таблицы
const TPattern = [
    /^\s*\|(?:[^|]+\|)+\s*/,
    /^\s*\|(?:[-:\s]+\|)+\s*$/
];
// LP - List Pattern
// находит списки, которые рвутся при \n\n
const LPattern = /^\s{0,3}(?:[-*+]|\d+\.)\s/

// если равен 1, значит ждем парного тега, если 2 очищаем
let MLPDetector = 0;
// если равен 1, значит нашли шпку, если 2 точно таблица. Рветься при \n\n
let TableDetector = 0;
// если равен 1 значит найден список. Рветься при \n\n
let ListDetector = 0;

// значение от 0 до 2, количество переносов
// String-Break Detector
let SBDetector = 0;

log.setLevel("debug")

function SmartBuffer(ChunkContent, recursion, done = null) {

    // определяем длину чанка
    EndBreakIndex = ChunkContent.length;

    // если начало стриминга, чистим все буферы
    if (ResponseStart) {
        MarkdownBuffer = "";
        Memory = "";
        SBDetector = 0;
        ResponseStart = false;
        ListDetector = 0;
        MLPDetector = 0;
        TableDetector = 0;
    }

    // если конец стриминга, меняем флаг ResponseStart на true
    // чтобы при начале нового стриминга все буфферы были очищены
    if (done) {
        ResponseStart = true;
        // если это концовка текста, то закрываем тег и выдаем данные
        TagClosed();
        
    }

    // проверка на запоздалый \n
    if (SBDetector > 0) {
        // если в новом чанке тоже есть \n
        if (ChunkContent.match(/^\n+/)) {
            // ничего не делаем, далее в коде посчитаем их количество
            ;
        } else {
            // если \n нету, значит перенос был 1 в прошлом чанке
            SBDetector = 0;
        }
    }

    // разделяет контент в чанке на текст до \n и после
    // content это текст до \n если \n был
    [Content, AfterBrake] = SplitWithN(ChunkContent);

    
    //----------
    // тут накапливаем md текст
    MarkdownBuffer += Content; // парсим только текст до \n
    // ----------


    log.debug("SBDetector -> " + SBDetector);
    
    if (SBDetector > 0) {
        // проверка на парный тег, изменяет глобальыне перменные
        FindPairedTag(MarkdownBuffer);
        
        // проверка на таблицу
        FindTableMD(MarkdownBuffer);

        // проверка на список
        FindListMD(MarkdownBuffer);
        
        log.debug("MLPDetector -> " + MLPDetector);
    }

    // если нашли \n
    if (SBDetector > 0) {
        if (MLPDetector == 1) {
            ;
        } else if (TableDetector == 1) {
            ;
        } else if (TableDetector == 2 || ListDetector == 1) {
            if (SBDetector >= 2) {
                TagClosed()

            } else {
                ;
            }

        } else {
            TagClosed()
        }
    }

    
    // важная проверка, не осталось ли не обработанного текста после \n
    if (AfterBrake) {
        log.debug("ПОВТОРНЫЙ ЗАХОД ДЛЯ " + AfterBrake);
        
        SmartBuffer(AfterBrake, true);
    };

    // если не рекурсия и есть данные для отгрузки
    if (!recursion && isDataReady) {
        isDataReady = false;
        return HTMLText;
    };
}

function SplitWithN(ChunkContent) {

	// перменная для определения, есть ли в строке \n
	let NewlineActive = false;

    // делаем проверку, что в функцию передали сообщение
    if (typeof ChunkContent !== "string") {
        mes = "не был передан аргумент.";
        log.warn("pareser.js -> SplitWithN - > " + mes);

        return 0;
    }

    // ищем \n в строке
    for (let i = 0; i < ChunkContent.length; i++) {
        if (ChunkContent[i] == "\n") {
			// если в чанке еще небыло новых строк NewlineActive = false
            if (!NewlineActive) {
                
                SBDetector += 1;
                NewlineActive = true;
            } else {
                // если это продолжение \n из прошлого чанка, тогда NewlineActive true
                SBDetector += 1;
            }
        } else {
            // если это текст после \n
            if (NewlineActive) {
                
                return [ChunkContent.slice(0, i), ChunkContent.slice(i)];
            }
        }
    }
    //если не было текста после \n, тогда возвращаем пустую строку (или вообще не было \n)
    return [ChunkContent, undefined];
}

function FindListMD(MDContent) {
    let LMatch = undefined
    // ищем паттерн
    LMatch = MDContent.match(LPattern)

    // если патерн найден, записываем
    if (LMatch) {
        ListDetector = 1;
    }
}

function FindTableMD(MDContent) {
    let TMatch = undefined;
    // если шапку еще не встречали, проверяем есть ли она
    if (TableDetector == 0) {
        TMatch = MDContent.match(TPattern[0]);
        
    // если уже встречали шапку, ищем подтверждение таблицы
    } else if (TableDetector == 1) {
        TMatch = MDContent.split("\n")[1].match(TPattern[1]);
    }

    // если не в теле таблицы, то нашли ли мы ее
    if (TMatch) {
        TableDetector += 1;
        log.debug("Нашли таблицу " + TableDetector);
        
    // если нашли шабку но дальше нет таблицы
    } else if (TableDetector == 1) {
        log.debug("Не нашли вторую часть таблицы");
        
        TableDetector = 0;
    }
}

function FindPairedTag(MDContent) {

    let MLMatch = undefined;
    // проверяем нет ли там спец символов, которые не закрываются при \n
    if (MLPDetector == 0) {
        // если еще не встречали парного тега, ищем его
        MLMatch = MDContent.match(MLPPattern[0]);
    } else if (MLPDetector == 1) {
        // если встречали, ищем закрытие
        MLMatch = MDContent.match(MLPPattern[1]);
    } else {
        MLMatch = true;
    }
    
    // тут 2 случая
    // 1. мы нашли открывающий тег (сработает только 1 раз, при нахождение)
    // 2. мы нашли закрывающий тег (сработает также 1 раз, при нахождение)
    if (MLMatch) {
        MLPDetector += 1;
    }
}

function TagClosed() {
    // парсим данные и очищаем буфер
    HTMLText = marked.parse(MarkdownBuffer);
    log.debug("MD -> " + MarkdownBuffer);
    log.debug("HTML -> " + HTMLText);

    MarkdownBuffer = "";

    // обнуляем все детекторы
    SBDetector = 0;
    TableDetector = 0;
    ListDetector = 0;
    MLPDetector = 0;

    // данные готовы к отгрузки
    isDataReady = true;
}