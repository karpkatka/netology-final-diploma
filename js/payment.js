let filmTItle = document.querySelector(".ticket__title");
let chairRow = document.querySelector(".ticket__chairs");
let hallNumber = document.querySelector(".ticket__hall");
let seanceTime = document.querySelector(".ticket__start");
let totalCost = document.querySelector(".ticket__cost");
let rowsSelected = Array.from(localStorage.getItem("rowSelected"));
let chairsSelected = Array.from(localStorage.getItem("chairSelected"));
rowsSelected = rowsSelected.filter(item => item != ",");
chairsSelected = chairsSelected.filter(item => item != ",");
let rowChairArray = [];
for (let i = 0; i < rowsSelected.length; i++) {
	if (rowsSelected.length === 1 || i === rowsSelected.length - 1) {
		rowChairArray.push(rowsSelected[i] + "/" + chairsSelected[i]);
	} else {
		rowChairArray.push(rowsSelected[i] + "/" + chairsSelected[i] + ", ");
	}
}

filmTItle.textContent = localStorage.getItem("filmTitle");
chairRow.textContent = rowChairArray.join("");
hallNumber.textContent = localStorage.getItem("hallNumber").slice(4); //slice
seanceTime.textContent = localStorage.getItem("seanceStart");
totalCost.textContent = localStorage.getItem("ticketCost");