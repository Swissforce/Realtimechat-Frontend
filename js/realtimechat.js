/**
 * @author Martin Düppenbecker
 * @since 27.03.22
 * 
 */

//Festsetzung der benutzerdefinierten Konstanten

const CHATSERVER = "127.0.0.1";


//Festsetzung anderer Konstanten & Variablen

const SEITE_LOGIN = 1;
const SEITE_REGISTRIEREN = 2;
const SEITE_AUSWAHL = 3;
const SEITE_CHAT = 4;


var aktuelleSeite;
var chatDiv;
var chatDivHeader;
var chatDivContent;
var chatSchliessen;
var chatZurueck;
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
    if (aktuelleSeite - 1 == 2){  //Skip Registrier-Seite
      aktuelleSeite--;
    }
    neueSeite(aktuelleSeite - 1, chatDiv.id);
  });
  



  chatDivContent = document.createElement('div');
  chatDivContent.className = "chatDivContent";

  aktuelleSeite = SEITE_LOGIN;


  chatDivHeader.appendChild(chatSchliessen);
  chatDivHeader.appendChild(chatZurueck);
  chatDiv.appendChild(chatDivHeader);
  chatDiv.appendChild(chatDivContent);

  document.body.appendChild(chatDiv);


  updateVars(anzGespawnterChats);


  neueSeite(SEITE_LOGIN, anzGespawnterChats);

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
  chatZurueck.style = "float: left";

  //Muss erneuert werden
  chatZurueck.addEventListener('click', () => {
    neueSeite(aktuelleSeite, chatDiv.id);
  });
  


  switch (seiteNeu) {
    case SEITE_LOGIN:
      loginSeite();
      chatZurueck.style = "display: none";
      break;

    case SEITE_REGISTRIEREN:
      registrierenSeite();
      break;

    case SEITE_AUSWAHL:
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
    emailInput.setAttribute("required", true);
    emailInput.setAttribute("autofocus", true);
  
    var passwortTitel = document.createElement('p');
    passwortTitel.textContent = "Passwort";
  
    var passwortInput = document.createElement('input');
    passwortInput.type = "password";
    passwortInput.setAttribute("required", true);
  
    var loginButton = document.createElement('button');
    //loginButton.type = "submit";
    loginButton.textContent = "Login";

    loginButton.addEventListener('click', () => {
      //TODO AJAX-Request zum Webserver
      //Login
      neueSeite(SEITE_AUSWAHL, chatDiv.id);
    });

    var registrierButton = document.createElement('button');
    registrierButton.textContent = "Neuer Account";

    registrierButton.addEventListener('click', () => {
      neueSeite(SEITE_REGISTRIEREN, chatDiv.id);
    })

    chatDivContent.appendChild(emailTitel);
    chatDivContent.appendChild(emailInput);
  
    chatDivContent.appendChild(passwortTitel);
    chatDivContent.appendChild(passwortInput);

    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(loginButton);

    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(registrierButton);

  }


  function registrierenSeite(){
    var loginForm =  document.createElement('form');
    loginForm.id = "registrierForm";

    var benutzernameTitel = document.createElement('p');
    benutzernameTitel.textContent = "Benutzername";

    var benutzernameInput = document.createElement('input');
    benutzernameInput.type = "text";
    benutzernameInput.setAttribute("required", true);
    benutzernameInput.setAttribute("autofocus", true);
  
    var emailTitel = document.createElement('p');
    emailTitel.textContent = "Email";
  
    var emailInput = document.createElement('input');
    emailInput.type = "email";
  
    var passwortTitel = document.createElement('p');
    passwortTitel.textContent = "Passwort";
  
    var passwortInput = document.createElement('input');
    passwortInput.type = "password";
    passwortInput.setAttribute("required", true);
  
    var registrierButton = document.createElement('button');
    //registrierButton.type = "submit";
    registrierButton.textContent = "Registrieren";

    registrierButton.addEventListener('click', () => {
      //TODO AJAX-Request zum Webserver
      //Registrieren

      neueSeite(SEITE_AUSWAHL, chatDiv.id);
    });

    
    chatDivContent.appendChild(benutzernameTitel);
    chatDivContent.appendChild(benutzernameInput);

    chatDivContent.appendChild(emailTitel);
    chatDivContent.appendChild(emailInput);
  
    chatDivContent.appendChild(passwortTitel);
    chatDivContent.appendChild(passwortInput);

    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(registrierButton);

  }


  function auswahlSeite(){
    var supportButton = document.createElement('button');
    supportButton.textContent = "Support kontaktieren";
    supportButton.addEventListener('click', () => {
      neueSeite(SEITE_CHAT, chatDiv.id);
    })

    var versendenButton = document.createElement('button');
    versendenButton.textContent = "Letzten Chat an Email senden";
    versendenButton.addEventListener('click', () => {
      //TODO AJEX-Request
      //Chat verschicken
      var emailVerschickt = true;

      var infoVersendet = document.createElement('p');

      if (emailVerschickt){  //Check ob Email versendet wurde
        infoVersendet.textContent = "Email mit Chatverlauf wurde erfolgreich versendet!";
        versendenButton.setAttribute("disabled", true);
      }
      else {
        infoVersendet.textContent = "Es ist ein Fehler aufgetreten!";
      }

      chatDivContent.appendChild(infoVersendet);

    })
    
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));

    chatDivContent.appendChild(supportButton);

    chatDivContent.appendChild(document.createElement('br'));
    chatDivContent.appendChild(document.createElement('br'));

    chatDivContent.appendChild(versendenButton);
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


