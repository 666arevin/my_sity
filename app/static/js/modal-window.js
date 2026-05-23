// кнопка поддержки
const SupportButton = document.querySelector("#support-button")

SupportButton.addEventListener("click", () => 
    window.open("https://t.me/Imadrewn", "_blank"
    ));

const Buttons = document.querySelector('.list-bar');
const ModalWindowBG = document.querySelector('.modal-overlay-blur');

function closemodal(event){
    if (event.target === ModalWindowBG) {
        ModalWindowBG.classList.remove('visible');
        console.info('close');
        ModalWindowBG.removeEventListener('click', closemodal);
    }
}

function handleMouseUp (upEvent) {
    if (upEvent.target === ModalWindowBG) {
        ModalWindowBG.classList.remove('visible');
        document.removeEventListener('mouseup', handleMouseUp)
        ModalWindowBG.removeEventListener('mousedown', handleMouseDown)
    }
}

function handleMouseDown (event) {
    if (event.target === ModalWindowBG) {
        document.addEventListener('mouseup', handleMouseUp);
    }
}


function OpenModalWindow(event) {
    event.stopPropagation();

    if (event.target.id === 'authorization-button') {
        ModalWindowBG.classList.add('visible');
        ModalWindowBG.addEventListener('mousedown', handleMouseDown)
    }
}

Buttons.addEventListener('click', OpenModalWindow);

const ButtonContainer2 = document.querySelector('.modal-choise');
const BackGroundToggle = document.querySelector('.toggle-bg');
const MainButton = document.querySelector('#main-button')

function AnimationBG(event) {
    if (event.target.id === 'button-log') {
        ModalWindowBG.classList.remove('register')
        MainButton.textContent = 'Войти';
    }
    
    if (event.target.id === 'button-reg') {
        ModalWindowBG.classList.add('register');
        MainButton.textContent = 'Зарегистрироваться';
    }

}

ButtonContainer2.addEventListener('click', AnimationBG);