const textarea = document.querySelector('#user-prompt');
const ChatBlock = document.querySelector('.chat-block ')
// блок к котром лежит textarea
const MainBlock = document.querySelector('.search-string')

function adjustHeight(el, ChatBlock) {

    if (el.scrollHeight > 24) {
        ChatBlock.classList.add('big-area');

    };

    if (el.scrollHeight < 40) {
        ChatBlock.classList.remove('big-area');
    };
    
};

textarea.addEventListener('input', () => {
    adjustHeight(textarea, ChatBlock);
});
