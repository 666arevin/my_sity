const textarea = document.querySelector('#user-prompt');
const ChatBlock = document.querySelector('.chat-block ')
// блок к котром лежит textarea
const MainBlock = document.querySelector('.search-string')

function adjustHeight(el, ChatBlock) {
    if (el.scrollWidth >= 615) {
        el.style.minWidth = '615px'; 
        el.style.wordBreak = 'break-all';
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
        console.log('высота - ' + el.scrollHeight)
    } else {
        el.style.width = 'auto';
        el.style.width = el.scrollWidth + 'px';;
        console.log('ширина - ' + el.scrollWidth)
    };

    if (el.scrollHeight > 24) {
        ChatBlock.classList.add('big-area');

    } else if (el.scrollHeight < 40) {
        ChatBlock.classList.remove('big-area');
    };

};

textarea.addEventListener('input', () => {
    adjustHeight(textarea, ChatBlock);
});
