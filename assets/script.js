var header = document.querySelector('.header');
var headerTitle = document.querySelector('.header h2');
var newElement = document.createElement("div");
var textElement = document.createTextNode("Jestem tutaj createElement");
    newElement.appendChild(textElement);

header.addEventListener('click', function() {
    headerTitle.innerHTML = "Jestem tutaj z innerHTML";    
    header.insertBefore(newElement, header.lastChild);
});



