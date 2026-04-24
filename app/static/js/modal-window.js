
const Buttons = document.querySelector('.list-bar');
const ModalWindow = document.querySelector('.modal-overlay-blur');

function closemodal(event){
    if (event.target === ModalWindow) {
        ModalWindow.classList.remove('visible');
        console.info('close');
    }
}


function OpenModalWindow(event) {
    event.stopPropagation();

    if (event.target.id === 'authorization-button') {
        ModalWindow.classList.add('visible');
        ModalWindow.addEventListener('click', closemodal, {once: true})
    }
}

Buttons.addEventListener('click', OpenModalWindow);

const ButtonContainer2 = document.querySelector('.modal-choise');
const BackGroundToggle = document.querySelector('.toggle-bg');

function AnimationBG(event) {

    if (event.target.id === 'button-log') {
        ModalWindow.classList.remove('register')
    }
    
    if (event.target.id === 'button-reg') {
        ModalWindow.classList.add('register')
    }

}

ButtonContainer2.addEventListener('click', AnimationBG);