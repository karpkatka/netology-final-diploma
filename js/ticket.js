//createRequest(`event=sale_add&timestamp=${localStorage.getItem('timeStamp')}&hallId=${localStorage.getItem('hallId')}&seanceId=${localStorage.getItem('seanceId')}&hallConfiguration=${localStorage.getItem('hallConfig')}`, (response) => {
//    let boop = JSON.parse(response);
//    wrapper.insertAdjacentHTML("beforeEnd",boop)
//})

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

let stringQR = ("seanceId:" + localStorage.getItem("seanceId") + ";" + "film:" + localStorage.getItem("filmTitle") + ";" + "places:" + chairRow.textContent + ";" + "seanceTime" + seanceTime.textContent + ";" + "cost:" + localStorage.getItem("ticketCost")).split(" ").join("");
const qrcode = QRCreator(stringQR, {
	image: 'svg'
});

let qrCodePlacement = document.querySelector(".ticket__info-qr");

qrCodePlacement.append(qrcode.result);

//const content = (qrcode) =>{
//return qrcode.error ?
//`недопустимые исходные данные ${qrcode.error}`:
//qrcode.result;
//};