let loader = document.querySelector(".loading");
let compteur = document.querySelector(".compteur");
let loading_bar = document.querySelector(".loading_bar");
let valeurCompteur = 0;

/* ---------------  MENU  ------------------ */
let scenarioBtn = document.querySelector("#scene");
let mapBtn = document.querySelector("#map");
let windBtn = document.querySelector("#wind");
let hoverBtn = document.querySelector("#diffusion");
windBtn.addEventListener("click", function () {
    window.location.href = "/";
});
mapBtn.addEventListener("click", function () {
    window.location.href = "/map";
});
scenarioBtn.addEventListener("click", function () {
    window.location.href = "/scenes";
});
hoverBtn.addEventListener("click", function () {
    window.location.href = "/hover";
});
if (window.location.pathname === "/") {
    windBtn.classList.add("active");
}
if (window.location.pathname === "/map") {
    mapBtn.classList.add("active");
}
if (window.location.pathname === "/scenes") {
    scenarioBtn.classList.add("active");
}
if (window.location.pathname === "/hover") {
    hoverBtn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(MorphSVGPlugin)
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