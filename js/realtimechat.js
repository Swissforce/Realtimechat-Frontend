/**
 * @author Martin Düppenbecker
 * @since 20.03.22
 * 
 */

//Festsetzung der benutzerdefinierten Konstanten

const CHATSERVER = "127.0.0.1";


//Festsetzung anderer Konstanten & Variablen

const seiteLogin = 1;
const seiteAuswahl = 2;
const seiteChat = 3;


var aktuelleSeite;
var chatDiv;
var chatDivHeader;
var chatDivContent;
var chatSchliessen;
var chatZurueck;
var chatTestButton;
var chatDivContent;
//Map mit allen Chats. So kann man sehen, welchem Chat was gehört
var chatMap = new Map(); 



//Funktionen


/**
 * Spawned einen Chat mit einer inkrementierenden id
 */
var anzGespawnterChats = 0;
function spawnChat(){
  anzGespawnterChats++;

  chatDiv = document.createElement('div');
  chatDiv.className = "chatDiv";
  chatDiv.id = anzGespawnterChats;

  chatDivHeader = document.createElement('div');
  chatDivHeader.className = "chatDivHeader";
  chatDivHeader.textContent = "Realtime-Chat Nr." + anzGespawnterChats;
  
  chatSchliessen = document.createElement('button');
  chatSchliessen.className = "chatSchliessen";
  chatSchliessen.innerHTML = '<img src="icons/close.png" height=10 width=10>';
  chatSchliessen.addEventListener('click', () => {
    destroyChat(chatDiv.id);
  })

  chatZurueck = document.createElement('button');
  chatZurueck.className = "chatZurueck";
  chatZurueck.innerHTML = '<img src="icons/back.png" height=10 width=10>';
  chatZurueck.addEventListener('click', () => {
    neueSeite(aktuelleSeite - 1, chatDiv.id);
  });
  
  

  chatTestButton = document.createElement('button');
  chatTestButton.textContent = "test";
  chatTestButton.addEventListener('click', () => {
    neueSeite(2, chatDiv.id);
  });


  chatDivContent = document.createElement('div');
  chatDivContent.className = "chatDivContent";

  aktuelleSeite = seiteLogin;


  chatDivHeader.appendChild(chatSchliessen);
  chatDivHeader.appendChild(chatZurueck);
  chatDivHeader.appendChild(chatTestButton);
  chatDiv.appendChild(chatDivHeader);
  chatDiv.appendChild(chatDivContent);

  document.body.appendChild(chatDiv);


  updateVars(anzGespawnterChats);


  neueSeite(seiteLogin, anzGespawnterChats);

  addDragElement(chatDiv);

}

/**
 * Ladet die Variablen aus der Map in die des Programmes ein
 */
function loadVars(id){
  var chatObj = chatMap.get(id);

  this.chatDiv = chatObj.chatDiv;
  this.chatDivHeader = chatObj.chatDivHeader;
  this.chatSchliessen = chatObj.chatSchliessen;
  this.chatZurueck = chatObj.chatZurueck;
  this.chatTestButton = chatObj.chatTestButton;
  this.chatDivContent = chatObj.chatDivContent;
  this.aktuelleSeite = chatObj.aktuelleSeite;
}

/**
 * Ladet die Variablen des Programmes in die der Map ein
 */
function updateVars(id){
  var chatObj = {
    chatDiv:chatDiv,
    chatDivHeader:chatDivHeader,
    chatSchliessen:chatSchliessen,
    chatZurueck:chatZurueck,
    chatTestButton:chatTestButton,
    chatDivContent:chatDivContent,
    aktuelleSeite:aktuelleSeite
  };

  chatMap.set(id, chatObj);
}

/**
 * Ändert den Zustand des Chatfensters.
 * Siehe konstanten oben definiert
 */
function neueSeite(seiteNeu, id){
  loadVars(Number(id));

  //Löscht den Content des Fensters (ausser Header)
  while(chatDivContent.hasChildNodes()){
    chatDivContent.removeChild(chatDivContent.lastChild);
  }

  chatZurueck.style = "display: inline";

  //Muss erneuert werden
  chatZurueck.addEventListener('click', () => {
    neueSeite(aktuelleSeite, chatDiv.id);
  });
  


  switch (seiteNeu) {
    case seiteLogin:
      loginSeite();
      chatZurueck.style = "display: none";
      break;

    case seiteAuswahl:
      auswahlSeite();
      break;

    default:
      console.log("Es ist ein Fehler aufgetreten!");
      break;
  }


  aktuelleSeite = seiteNeu;

  updateVars(Number(id));





  function loginSeite(){
    var loginForm =  document.createElement('form');
    loginForm.id = "loginForm";
  
    var emailTitel = document.createElement('p');
    emailTitel.textContent = "Email";
  
    var emailInput = document.createElement('input');
    emailInput.type = "email";
    emailInput.required = true;
    emailInput.autofocus = true;
  
    var passwortTitel = document.createElement('p');
    passwortTitel.textContent = "Passwort";
  
    var passwortInput = document.createElement('input');
    passwortInput.type = "password";
    passwortInput.required = true;
  
    var loginButton = document.createElement('button');
    loginButton.type = "submit";
    loginButton.textContent = "Login";


    chatDivContent.appendChild(emailTitel);
    chatDivContent.appendChild(emailInput);
  
    chatDivContent.appendChild(passwortTitel);
    chatDivContent.appendChild(passwortInput);

    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(loginButton);

  }


  function auswahlSeite(){
    //TODO
    var emailTitel = document.createElement('p');
    emailTitel.textContent = "test";
    
    chatDivContent.appendChild(emailTitel);
  }
}

/**
 * Entfernt ein Chat-Fenster mit bestimmter id
 */
function destroyChat(id){
  document.body.removeChild(document.getElementById(id));
  chatMap.delete(Number(id));
  showChatButton();
}

/**
 * Bewegt den angeklickten Chat in Vordergrund
 */
function moveElementIntoForeground(){
  document.body.removeChild(this);
  document.body.appendChild(this);

  loadVars(Number(this.id));
}


function addAllDragElements(elements){
  for(var i = 0; i < elements.length; i++){
    addDragElement(elements[i]);
  }
}

//https://www.w3schools.com/howto/howto_js_draggable.asp
function addDragElement(element) {
  element.addEventListener('mousedown', moveElementIntoForeground);

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
  else if (chatMap === undefined || chatMap.size == 0) {
    chatButton.style = "display: inline";
  }

}








//Ausführen beim Laden der Webseite


showChatButton();

addAllDragElements(document.getElementsByClassName("chatDiv"));


