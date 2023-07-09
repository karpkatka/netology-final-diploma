const mainBlock = document.querySelector("main");
mainBlock.innerHTML = "";
const daysNav = Array.from(document.querySelectorAll(".page-nav__day"));
let time = new Date()
time.setHours(00, 00, 00);
let timeStamp = time.getTime();
//time.setHours(00,00,00) //текущий таймстэмп
for (let i = 0; i < daysNav.length; i++) {
	let dateNav = timeStamp + (24 * 60 * 60 * 1000 * i);
	let dateFormat = new Date(dateNav);
	let oneDay = daysNav[i];
	oneDay.dataset.timeStamp = dateNav;

	//каждому элементу присваиваем таймтэмп: таймстэмп + сутки * на индекс элемента
	// Считаем дату и меняем в дочерних элементах текстконтент
	// Если СБ или ВС - тоглаем класс page-nav__day_weekend
	const dateWeek = (oneDay.getElementsByClassName("page-nav__day-week"))[0];
	const dateNumber = (oneDay.getElementsByClassName("page-nav__day-number"))[0];

	function getWeekDay(date) {
		let days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

		return days[date.getDay()];
	}
	dateWeek.textContent = String(getWeekDay(dateFormat));
	dateNumber.textContent = String(dateFormat.getDate());
	if (dateWeek.textContent === "ВС" || dateWeek.textContent === "СБ") {
		oneDay.classList.add("page-nav__day_weekend")
	}
	// вещаем прослушку на клик: по клику убираем у другого элемента и добавляем этому класс page-nav__day_chosen
	//
	daysNav[i].addEventListener("click", event => {
		daysNav.forEach(item => {
			if (item.classList.contains("page-nav__day_chosen")) {
				item.classList.remove("page-nav__day_chosen")
			}
		})
		daysNav[i].classList.add("page-nav__day_chosen");
		console.log(document.querySelector(".page-nav__day_chosen").getAttribute("data-time-stamp"))
		event.preventDefault();
	})


}


createRequest("event=update", (response) => {
	response.films.result.forEach(item => {
		const filmDescription = item.film_description;
		const filmDuration = item.film_duration;
		const filmId = item.film_id;
		const filmName = item.film_name;
		const filmOrigin = item.film_origin;
		const filmPoster = item.film_poster;


		mainBlock.insertAdjacentHTML("beforeEnd",
			`<section class="movie">
    <div class="movie__info">
      <div class="movie__poster">
        <img class="movie__poster-image" alt="${filmName} постер" src=${filmPoster}>
      </div>
      <div class="movie__description">
        <h2 class="movie__title">${filmName}</h2>
        <p class="movie__synopsis">${filmDescription}</p>
        <p class="movie__data">
          <span class="movie__data-duration">${filmDuration} мин</span>
          <span class="movie__data-origin">${filmOrigin}</span>
        </p>
      </div>
    </div>  
  </section>`
		)
		const lastMovie = mainBlock.lastChild;
		const seancesArr = response.seances.result.filter(seance => seance.seance_filmid === filmId);
		const hallsArr = response.halls.result;
		const hallCounter = [];
		for (let i = 0; i < seancesArr.length; i++) {
			if (hallCounter.includes(seancesArr[i].seance_hallid)) {
				const hallExist = lastMovie.querySelector(`[data-hall-id="${seancesArr[i].seance_hallid}"]`).lastElementChild;
				hallExist.insertAdjacentHTML("beforeEnd",
					`<li class="movie-seances__time-block" data-seance-time-stamp="${seancesArr[i].seance_start}" data-seance-id="${seancesArr[i].seance_id}"><a class="movie-seances__time" href="hall.html">${seancesArr[i].seance_time}</a></li>`)
			} else {
				hallCounter.push(seancesArr[i].seance_hallid);
				const hallName = hallsArr.filter(hall => hall.hall_id === seancesArr[i].seance_hallid);
				const hallNameNumber = (`${hallName[0].hall_name}`).slice(3, 4)
				lastMovie.insertAdjacentHTML("beforeEnd",
					`<div class="movie-seances__hall" data-hall-id="${seancesArr[i].seance_hallid}">
      <h3 class="movie-seances__hall-title" >Зал ${hallNameNumber}</h3>
      <ul class="movie-seances__list">
        <li class="movie-seances__time-block" data-seance-time-stamp="${seancesArr[i].seance_start}" data-seance-id="${seancesArr[i].seance_id}"><a class="movie-seances__time" href="hall.html">${seancesArr[i].seance_time}</a></li>    
      </ul>
    </div>`)

			}
		}
	})

	const seanceTime = Array.from(document.querySelectorAll(".movie-seances__time"));
	seanceTime.forEach(item => {
		item.addEventListener("click", event => {
			localStorage.clear();
			let timeStampDay = document.querySelector(".page-nav__day_chosen").getAttribute("data-time-stamp");
			let timeStampSeance = item.closest(".movie-seances__time-block").getAttribute("data-seance-time-stamp");
			let hallIdSeance = item.closest(".movie-seances__hall").getAttribute("data-hall-id");
			let chosenSeanceId = item.closest(".movie-seances__time-block").getAttribute("data-seance-id");
			let filmTimeStamp = Math.trunc(Number(timeStampDay) / 1000) + (Number(timeStampSeance) * 60);
			console.log(timeStampSeance)
			localStorage.setItem("timeStamp", filmTimeStamp);
			localStorage.setItem("hallId", hallIdSeance);
			localStorage.setItem("seanceId", chosenSeanceId);
		})
	})

})