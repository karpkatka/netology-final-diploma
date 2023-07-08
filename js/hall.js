console.log(localStorage);
const stamp = localStorage.getItem('timeStamp');
createRequest(`"event=get_hallConfig&timestamp=${stamp}&hallId=${localStorage.getItem('hallId')}&seanceId=${localStorage.getItem('seanceId')}"`, (response) => {
    console.log(response)
})




