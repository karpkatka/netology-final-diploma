const mainBlock = document.querySelector("main");
mainBlock.innerHTML = "";
const daysNav = Array.from(document.querySelectorAll(".page-nav__day"));
let time = new Date()
time.setHours(00, 00, 00);
let timeStamp = time.getTime();

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

	daysNav[i].addEventListener("click", event => {
		daysNav.forEach(item => {
			if (item.classList.contains("page-nav__day_chosen")) {
				item.classList.remove("page-nav__day_chosen")
			}
		})
		daysNav[i].classList.add("page-nav__day_chosen");
		//код ниже дублируется для отметки прошедших сеансов на сегодня при загрузке страницы (строка 114)
		const seanceTime = Array.from(document.querySelectorAll(".movie-seances__time"));
		seanceTime.forEach(item => {
			let timeStampDay = Number(document.querySelector(".page-nav__day_chosen").getAttribute("data-time-stamp"));
			let timeStampSeance = Number(item.closest(".movie-seances__time-block").getAttribute("data-seance-time-stamp"));
			item.dataset.seanceTimeStamp = Math.trunc(timeStampDay / 1000) + (timeStampSeance * 60);

			if ((timeStampDay + (timeStampSeance * 60 * 1000)) < Date.now()) {
				item.textContent = "Сеанс завершён";
				item.closest(".movie-seances__time-block").classList.add("unavailableFunction");
				//добавить класс-блокировку перехода по ссылке
			} else {
				item.textContent = item.getAttribute("data-clock");
				item.closest(".movie-seances__time-block").classList.remove("unavailableFunction");
			}
		})


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
					`<li class="movie-seances__time-block" data-seance-time-stamp="${seancesArr[i].seance_start}" data-seance-id="${seancesArr[i].seance_id}"><a class="movie-seances__time" href="hall.html" data-clock="${seancesArr[i].seance_time}">${seancesArr[i].seance_time}</a></li>`)
			} else {
				hallCounter.push(seancesArr[i].seance_hallid);
				const hallName = hallsArr.filter(hall => hall.hall_id === seancesArr[i].seance_hallid);
				const hallNameNumber = (`${hallName[0].hall_name}`).slice(3, 4);
				lastMovie.insertAdjacentHTML("beforeEnd",
					`<div class="movie-seances__hall" data-hall-id="${seancesArr[i].seance_hallid}" data-hall-config='${hallName[0].hall_config}'>
      <h3 class="movie-seances__hall-title" >Зал ${hallNameNumber}</h3>
      <ul class="movie-seances__list">
        <li class="movie-seances__time-block" data-seance-time-stamp="${seancesArr[i].seance_start}" data-seance-id="${seancesArr[i].seance_id}"><a class="movie-seances__time" href="hall.html" data-clock="${seancesArr[i].seance_time}">${seancesArr[i].seance_time}</a></li>    
      </ul>
    </div>`)

			}
		}
		//*тут код добавления невозможности выбрать прошедших сеансов дублируется, не придумала, как ещё это решить
		const seanceTime = Array.from(document.querySelectorAll(".movie-seances__time"));
		seanceTime.forEach(item => {
			let timeStampDay = Number(document.querySelector(".page-nav__day_chosen").getAttribute("data-time-stamp"));
			let timeStampSeance = Number(item.closest(".movie-seances__time-block").getAttribute("data-seance-time-stamp"));
			item.dataset.seanceTimeStamp = Math.trunc(timeStampDay / 1000) + (timeStampSeance * 60);

			if ((timeStampDay + (timeStampSeance * 60 * 1000)) < Date.now()) {
				item.textContent = "Сеанс завершён";
				item.closest(".movie-seances__time-block").classList.add("unavailableFunction");
				//добавить класс-блокировку перехода по ссылке
			} else {
				item.textContent = item.getAttribute("data-clock");
				item.closest(".movie-seances__time-block").classList.remove("unavailableFunction");
			}
		})
	})


	const seanceTime = Array.from(document.querySelectorAll(".movie-seances__time"));
	seanceTime.forEach(item => {

		item.addEventListener("click", event => {
			let hallIdSeance = item.closest(".movie-seances__hall").getAttribute("data-hall-id");
			let chosenSeanceId = item.closest(".movie-seances__time-block").getAttribute("data-seance-id");
			let filmTimeStamp = item.getAttribute("data-seance-time-stamp");
			let filmHallConfig = item.closest(".movie-seances__hall").getAttribute("data-hall-config");
			let filmTitle = item.closest(".movie").querySelector(".movie__description").querySelector(".movie__title");
			let seanceStart = item.getAttribute("data-clock");
			let hallNumber = item.closest(".movie-seances__hall").querySelector(".movie-seances__hall-title");

			localStorage.setItem("timeStamp", filmTimeStamp);
			localStorage.setItem("hallId", hallIdSeance);
			localStorage.setItem("seanceId", chosenSeanceId);
			localStorage.setItem("hallConfig", filmHallConfig);
			localStorage.setItem("filmTitle", filmTitle.textContent);
			localStorage.setItem("seanceStart", seanceStart);
			localStorage.setItem("hallNumber", hallNumber.textContent)
			console.log(localStorage.getItem("hallConfig"))
		})

	})

})