const TableWrap = document.querySelectorAll('.table-wrap');

function activescroll (event) {
    event.target.classList.add('scroll');
}

function passivescroll (event) {
    event.target.classList.remove('scroll');
}

for (const i of TableWrap) {
    i.addEventListener('mouseenter', activescroll);
    i.addEventListener('mouseleave', passivescroll);
}