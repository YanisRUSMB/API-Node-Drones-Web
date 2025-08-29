document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(MorphSVGPlugin)
    let playBtn = document.querySelector(".icon_scenario");
    let playBtnPath = playBtn.querySelector("#play");
    let pauseBtnPath = playBtn.querySelector("#pause");
    function playScenario(){
        gsap.to(playBtnPath, {
            duration:0.2,
            morphSVG:pauseBtnPath,
            ease: "power1.inOut",
        })
    }
    function pauseScenario(){
        gsap.to(playBtnPath, {
            duration:0.2,
            morphSVG:playBtnPath,
            ease: "power1.inOut",
        })
    }
    playBtn.addEventListener("click", function () {
        if (playBtn.classList.contains("playing")) {
            playBtn.classList.remove("playing");
            pauseScenario();
        } else {
            playBtn.classList.add("playing");
            playScenario();
        }
    });
});