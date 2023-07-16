let wrapper = document.querySelector(".conf-step__wrapper");

let selectButton = document.querySelector(".acceptin-button");

createRequest(`event=get_hallConfig&timestamp=${localStorage.getItem('timeStamp')}&hallId=${localStorage.getItem('hallId')}&seanceId=${localStorage.getItem('seanceId')}`, (response) => {
	if (response === null) {
		wrapper.innerHTML = localStorage.getItem("hallConfig");
	} else {
		wrapper.innerHTML = response;
	}
	let filmTitle = document.querySelector(".buying__info-title");
	let seanceStart = document.querySelector(".buying__info-start");
	let hallNumber = document.querySelector(".buying__info-hall");

	filmTitle.textContent = localStorage.getItem("filmTitle");
	seanceStart.textContent = localStorage.getItem("seanceStart");
	hallNumber.textContent = localStorage.getItem("hallNumber");

	let chairsArrays = Array.from(wrapper.querySelectorAll(".conf-step__chair"));

	chairsArrays.forEach(item => {
		item.addEventListener("click", event => {
			if (!item.classList.contains("conf-step__chair_selected") && !item.classList.contains("conf-step__chair_disabled")) {
				item.classList.add("conf-step__chair_selected");
			} else {
				item.classList.remove("conf-step__chair_selected");
			}

			if (wrapper.querySelector(".conf-step__chair_selected")) {
				selectButton.closest(".acceptin-button__link").classList.remove("unavailableFunction");
				selectButton.textContent = "Забронировать";
			} else {
				selectButton.closest(".acceptin-button__link").classList.add("unavailableFunction");
				selectButton.textContent = "Выберите место";
			}

		})
	})

	let configRows = Array.from(document.querySelectorAll(".conf-step__row"));
	for (let i = 0; i < configRows.length; i++) {
		configRows[i].dataset.rowNumber = i + 1;
		let rowChairs = Array.from(configRows[i].querySelectorAll(".conf-step__chair"));
		for (let i = 0; i < rowChairs.length; i++) {
			rowChairs[i].dataset.chairNumber = i + 1;
		}
	}
})

selectButton.addEventListener("click", event => {
	let selectedChairs = Array.from(wrapper.querySelectorAll(".conf-step__chair_selected"));
	let rowStorage = [];
	let chairStorage = [];
	let ticketTotal = 0;
	selectedChairs.forEach(item => {
		let newRow = item.closest(".conf-step__row").getAttribute("data-row-number");
		rowStorage.push(newRow);
		let newChair = item.getAttribute("data-chair-number");
		chairStorage.push(newChair);
		if (item.classList.contains("conf-step__chair_vip")) {
			ticketTotal += 350;
		} else {
			ticketTotal += 250;
		}
		item.classList.remove("conf-step__chair_selected");
		item.classList.add("conf-step__chair_taken");
	})
	localStorage.setItem("rowSelected", rowStorage);
	localStorage.setItem("chairSelected", chairStorage);
	localStorage.setItem("ticketCost", ticketTotal);
	localStorage.setItem("hallConfig", wrapper.innerHTML);
    console.log(localStorage.getItem("hallConfig"))
})



//conf-step__chair_standart
//conf-step__chair_taken
//conf-step__chair_selected