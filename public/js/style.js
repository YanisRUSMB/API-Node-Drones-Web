let loader = document.querySelector(".loading");
let compteur = document.querySelector(".compteur");
let loading_bar = document.querySelector(".loading_bar");
let valeurCompteur = 0;

document.addEventListener("DOMContentLoaded", function () {
    function fadeOutLoader() {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            ease: "power1.inOut",
            onComplete(){
                loader.remove()
            }
        });
    }
    gsap.set(compteur, {
        left: "0%"
    });
    gsap.set(loading_bar, {
        width: "1%"
    });
    function updateCompteur() {
        if (valeurCompteur >= 100) {
            valeurCompteur = 100;
            fadeOutLoader();
            return;
        }
        valeurCompteur += Math.floor(Math.random() * 15) + 1;
        if (valeurCompteur >= 100) {
            valeurCompteur = 100;
        }
        compteur.textContent = valeurCompteur + "%";
        gsap.to(compteur, {
            left: "calc("+valeurCompteur+"% - 30px)",
            duration: 0.5,
            ease: "power2.inOut"
        });
        gsap.to(loading_bar, {
            width: valeurCompteur+"%",
            duration: 0.5,
            ease: "power2.inOut"
        });
        let delay = Math.floor(Math.random() * 200) + 50;
        setTimeout(updateCompteur, delay);
    }
    updateCompteur();
});