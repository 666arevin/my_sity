// console.error("Ошибка")

var num = 5;
console.info("переменная: " + num);

const num2 = 10;
console.info("При сложение num и num2 получилось: " + (num + num2));

let num_2 = Number(-2);
let str = String();
let dict = Object();
let list = Array();
let none1 = null;

console.info("Число: " + num_2 + " Строка: " + str + " Словарь: " + dict + " Массив: " + list);
console.log(Math.abs(num_2));

if (Math.abs(num_2) || none1 == null) {
    console.info("Сработало условие");
}

let check = 46;

if (check < 45) {
    console.info("Check меньше 45");
} else if (check == 45) {
    console.info("Check равен 45");
} else {
    console.info("Check больше 45");
}