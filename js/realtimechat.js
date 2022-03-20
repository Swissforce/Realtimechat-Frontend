/**
 * @author Martin Düppenbecker
 * @since 16.03.22
 *
 */


//Funktionen


/**
 * Spawned einen Chat mit einer inkrementierenden id
 */
var anzGespawnterChats = 0;
function spawnChat(){
    anzGespawnterChats++;

    var chatDiv = document.createElement('div');
    chatDiv.className = "chatDiv";
    chatDiv.id = anzGespawnterChats;


    var chatDivHeader = document.createElement('div');
    chatDivHeader.className = "chatDivHeader";
    chatDivHeader.textContent = "Realtime-Chat Nr." + anzGespawnterChats;

    var chatSchliessen = document.createElement('button');
    chatSchliessen.className = "chatSchliessen";
    chatSchliessen.innerHTML = '<img src="icons/close.png" height=10 width=10>';

    chatSchliessen.addEventListener('click', () => {
        destroyChat(chatDiv.id);
    })


    var text = document.createElement('p');
    text.textContent = "Ich bin ein Chat";


    chatDivHeader.appendChild(chatSchliessen);
    chatDiv.appendChild(chatDivHeader);
    chatDiv.appendChild(text);

    document.body.appendChild(chatDiv);


    addDragElement(chatDiv);
}

/**
 * Entfernt ein Chat-Fenster mit bestimmter id
 */
function destroyChat(id){
    document.body.removeChild(document.getElementById(id));
    showChatButton();
}

/**
 * Bewegt den angeklickten Chat in Vordergrund
 */
var previousForegroundElement;
function moveElementIntoForeground(){
    if (previousForegroundElement === undefined){
        this.style.zIndex = 1;
    }
    else {
        var zIndex = Number(previousForegroundElement.style.zIndex) + 1;
        this.style.zIndex = zIndex;
    }
    previousForegroundElement = this;
}


function addAllDragElements(elements){
    for(var i = 0; i < elements.length; i++){
        addDragElement(elements[i]);
    }
}

//https://www.w3schools.com/howto/howto_js_draggable.asp
function addDragElement(element) {
    element.addEventListener("click", moveElementIntoForeground);

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    //sucht das Header-Element, das draggable werden soll
    var kinder = element.childNodes;
    for(var i = 0; i < kinder.length; i++){
        if (kinder[i].className == "chatDivHeader"){
            kinder[i].onmousedown = dragMouseDown;
            break;
        }
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


/**
 * Erstellt den Chat-Button, sofern noch nicht erstellt
 * Ansonsten macht es den Button wieder sichtbar
 */
function showChatButton(){
    var chatButton = document.getElementById("chatButton");

    if (chatButton === null){
        chatButton = document.createElement('button');
        chatButton.innerHTML = '<img src="icons/chat.png" height=50 width=50>';
        chatButton.id = "chatButton";

        chatButton.addEventListener('click', () => {
            chatButton.style = "display: none";
            spawnChat();
        })



        document.body.appendChild(chatButton);
    }
    else {
        chatButton.style = "display: inline";
    }

}







//Ausführen beim Laden der Webseite



showChatButton();

addAllDragElements(document.getElementsByClassName("chatDiv"));