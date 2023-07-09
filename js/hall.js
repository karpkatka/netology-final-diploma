createRequest(`event=get_hallConfig&timeStamp=${localStorage.getItem('timeStamp')}&hallId=${localStorage.getItem('hallId')}&seanceId=${localStorage.getItem('seanceId')}`, (response) => {
    console.log(JSON.parse(response));
})

const place = Array.from(document.querySelectorAll(".conf-step__chair "));

place.forEach(item => {
    item.addEventListener("click", event => {
        if (!item.classList.contains("conf-step__chair_selected")){
        item.classList.add("conf-step__chair_selected");
        } else {
            item.classList.remove("conf-step__chair_selected");
        }
    })
})



//const wrapper = document.querySelector(".conf-step__wrapper"); 
