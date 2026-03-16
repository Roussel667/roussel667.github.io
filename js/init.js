//Bouton Retour en haut
const btn = document.querySelector('#retourHaut');
window.addEventListener('scroll', () => {    
const largeurEcran = window.innerWidth;
const positionScroll = window.scrollY;
if(largeurEcran > 800 && positionScroll > 500) {
    btn.classList.add('display');
}
else {
    btn.classList.remove('display');
}
});
btn.addEventListener('click', () =>{
    window.scrollTo({

        top: 0,
        behavior : 'smooth'
    });
});
//Bouton Retour en haut

