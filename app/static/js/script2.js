let arr = [1, 2, 3, 4, '?'];

question = arr.filter(que => que >= 2);

console.info(question);

arr_new = arr.map(mapping => String(mapping) + "brooo");

console.info(arr_new)

for (const i of arr) {
    console.info(i)
}