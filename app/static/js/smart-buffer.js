// обьединяем и сохраняем собранные чанки
let MarkDownText = String()
// пременная для режима 
// 0 завершается \n, 1 - завершается \n\n, 3 - завершается парным символом
let MultiLine = 0
// закрываются либо парным символом или \n\n
const MultiStrPatterns = ["|"]
// данные обозначения markdown закрываются только парным символом
const MultiStrPairedPatterns = ["```", "~~", "==", "~", "^"]

function SmartBuffer(chunk_content) {
    // соединяем контент прошлых чанков с новыми
    MarkDownText += chunk_content
    // парсим
    html = marked.parse(MarkDownText);



    // если не включен многострочный режим
    if (MultiLine == 0) {
        // если началась новая строка сбрасываем буффер
        if ("\n" in chunk_content) {
            MarkDownText = ""
        }
    } else if (MultiLine == 1) {

    }
}