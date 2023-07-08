// Адрес (URL) - https://jscp-diplom.netoserver.ru/
// Метод (Method) - POST
// HTTP заголовок (HttpRequest) - Название: Content-Type Значение: application/x-www-form-urlencoded
// Ответ приходит в JSON парсим JSON.parse() 
// функция запроса: 1ый аргумент - строка запроса (который наужно отправить на сервер) 2ой - callback, куда передаём ответ сервера (это один единственный аргумент этой фуекции)

const createRequest = (body,callback) => {
    const xhr = new XMLHttpRequest();
    try {
        xhr.open("POST","https://jscp-diplom.netoserver.ru/");
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.responseType = "json";
        xhr.send(body); 
        xhr.onload = () => {
        callback(xhr.response); 
        }
    } catch (error) {
    console.log(error)
}
    

};
