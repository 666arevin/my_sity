
const ButtonContainer2 = document.querySelector('.modal-choise');
const BackGroundToggle = document.querySelector('.toggle-bg')

function AnimationBG(event) {

    if (event.target.id === 'button-log') {
        BackGroundToggle.classList.remove('active')
    }
    
    if (event.target.id === 'button-reg') {

        BackGroundToggle.classList.add('active')
    }

}

ButtonContainer2.addEventListener('click', AnimationBG);