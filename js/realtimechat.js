/**
 * @author Martin Düppenbecker
 * @since 27.04.22
 * 
 */

//Festsetzung der benutzerdefinierten Konstanten

const CHATSERVER = "https://realtime-chat-idpa.herokuapp.com/";


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

var nachrichtenDivLinks;
var nachrichtenDivRechts;

var chatNr;
//Map mit allen Chats. So kann man sehen, welchem Chat was gehört
var chatMap = new Map(); 
var chatNrToId = new Map();

var eingeloggt = false;
var eingeloggteEmail;


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

  chatDivHeader.appendChild(chatSchliessen);
  chatDivHeader.appendChild(chatZurueck);
  chatDiv.appendChild(chatDivHeader);
  chatDiv.appendChild(chatDivContent);

  document.body.appendChild(chatDiv);

  aktuelleSeite = SEITE_LOGIN;

  updateVars(anzGespawnterChats);

  neueSeite(aktuelleSeite, anzGespawnterChats);

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
  this.chatNr = chatObj.chatNr;
  this.nachrichtenDivLinks = chatObj.nachrichtenDivLinks;
  this.nachrichtenDivRechts = chatObj.nachrichtenDivRechts;
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
    aktuelleSeite:aktuelleSeite,
    chatNr:chatNr,
    nachrichtenDivLinks:nachrichtenDivLinks,
    nachrichtenDivRechts:nachrichtenDivRechts
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


  if (eingeloggt && seiteNeu == SEITE_LOGIN){
    seiteNeu = SEITE_AUSWAHL;
  }
  

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

    case SEITE_CHAT:
      chatSeite();
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
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("required", true);
    emailInput.setAttribute("autofocus", true);
  
    var passwortTitel = document.createElement('p');
    passwortTitel.textContent = "Passwort";
  
    var passwortInput = document.createElement('input');
    passwortInput.type = "password";
    passwortInput.setAttribute("id", "password");
    passwortInput.setAttribute("required", true);
  
    var loginButton = document.createElement('button');
    //loginButton.type = "submit";
    loginButton.textContent = "Login";

    loginButton.addEventListener('click', () => {
      logIn(document.getElementById("email").value, document.getElementById("password").value)
      .then(nachLogInFunktion);
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
    benutzernameInput.setAttribute("id", "username");
    benutzernameInput.setAttribute("required", true);
    benutzernameInput.setAttribute("autofocus", true);
  
    var emailTitel = document.createElement('p');
    emailTitel.textContent = "Email";
  
    var emailInput = document.createElement('input');
    emailInput.type = "email";
    emailInput.setAttribute("id", "email");
  
    var passwortTitel = document.createElement('p');
    passwortTitel.textContent = "Passwort";
  
    var passwortInput = document.createElement('input');
    passwortInput.type = "password";
    passwortInput.setAttribute("id", "password");
    passwortInput.setAttribute("required", true);
  
    var registrierButton = document.createElement('button');
    //registrierButton.type = "submit";
    registrierButton.textContent = "Registrieren";

    registrierButton.addEventListener('click', () => {
     register(document.getElementById("email").value, document.getElementById("username").value, document.getElementById("password").value);
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

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  async function logIn(emailP, passwordP){
    if (!(emailP && passwordP)){
      alert("Bitte füllen Sie alle Felder aus");
      return false;
    }
    var data = new URLSearchParams({
      'email': emailP,
      'password': passwordP
    });

    disEnableAll();
    let response = await fetch(CHATSERVER + 'LogIn.php', {
      method: 'POST',
      credentials: "include",
      body: data
    });
    disEnableAll();

    if (response.ok){
      eingeloggt = true;
      eingeloggteEmail = emailP;
      return true;
    }
    else {
      if (response.status == 401){
        alert("Das Login ist inkorrekt");
        document.getElementById("password").value = "";
      }
      else {
        alert("Ein Fehler ist aufgetreten");
      }
      return false;
    }
  }

  function nachLogInFunktion(){
    if(eingeloggt){
      neueSeite(SEITE_AUSWAHL, chatDiv.id);
      getAllOpenChatsFromUser();
    }
  }

  async function register(emailP, usernameP, passwordP){
    if (!(emailP && usernameP && passwordP)){
      alert("Bitte füllen Sie alle Felder aus");
      return false;
    }
    var data = new URLSearchParams({
      'email': emailP,
      'username': usernameP,
      'password': passwordP
    });

    disEnableAll();
    let response = await fetch(CHATSERVER + 'Register.php', {
      method: 'POST',
      credentials: "include",
      body: data
    })
    disEnableAll();

    if (response.ok){
      logIn(emailP, passwordP)
      .then(nachLogInFunktion);
      return true;
    }
    else {
      if (response.status == 401){
        alert("Diese Email ist inkorrekt oder wird bereits verwendet");
      }
      else {
        alert("Ein Fehler ist aufgetreten");
      }
      return false;
    }
  }

  https://stackoverflow.com/questions/15523396/how-to-disable-whole-div-contents-without-using-jquery
  function disEnableAll(){
    var disableBool = false;
    var allChildNodes = chatDivContent.getElementsByTagName('*');

    if(!allChildNodes[0].disabled){
      disableBool = true;
    }
    for(var i = 0; i < allChildNodes.length; i++)
      {
        allChildNodes[i].disabled = disableBool;
      }
  }
  

  function auswahlSeite(){
    var supportButton = document.createElement('button');
    supportButton.textContent = "Support kontaktieren";
    supportButton.addEventListener('click', () => {
      createChat();
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

  async function createChat(){
    //TODO soll eigentlich ohne Parameter auskommen (Die Email soll Serverseitig genommen werden)
    var data = new URLSearchParams({
      'email': eingeloggteEmail
    });

    disEnableAll();
    let response = await fetch(CHATSERVER + 'CreateChat.php', {
      method: 'POST',
      credentials: "include",
      body: data
    })
    disEnableAll();

    if (response.ok){
      chatNrToId.set(chatDiv.id, response.text);
      neueSeite(SEITE_CHAT, chatDiv.id);
      return true;
    }

    else {
      if (response.status == 503){
        alert("Es sind momentan keine TechSupports verfügbar. Bitte probieren Sie es später wieder");
      }
      else {
        alert("Ein Fehler ist aufgetreten");
      }
      return false;
    }
  }

  function chatSeite(){
    var chatTitel = document.createElement('h1');
    chatTitel.textContent = "Tech Support"; //TODO soll vom Server fetchen

    var nachrichtenDiv = document.createElement('div');
    nachrichtenDiv.className = "nachrichtenDiv";
    

    nachrichtenDivLinks = document.createElement('div');
    nachrichtenDivLinks.className = "nachrichtenDivLinks";
    nachrichtenDivLinks.style = "display: flex; flex-direction: column; width: 280px"

    nachrichtenDivRechts = document.createElement('div');
    nachrichtenDivRechts.className = "nachrichtenDivRechts";
    nachrichtenDivRechts.style = "display: flex; flex-direction: column; width: 280px"

    
    var nachrichtenFooterDiv = document.createElement('div');
    nachrichtenFooterDiv.className = "nachrichtenFooterDiv";



    var nachrichtenFooterTextfeld = document.createElement('textarea');
    nachrichtenFooterTextfeld.setAttribute('id', 'textarea');
    nachrichtenFooterTextfeld.style = "width: 300px; height: 25px";


    var nachrichtenFooterAbsendenButton = document.createElement('button');
    nachrichtenFooterAbsendenButton.innerHTML = '<img src="icons/send.png" height=25 width=25>';
    nachrichtenFooterAbsendenButton.style = "float: right";
    nachrichtenFooterAbsendenButton.addEventListener('click', () => {

      
      nachrichtSenden(nachrichtenFooterTextfeld.value, false);

      //TODO Absenden an Server

      nachrichtenFooterTextfeld.value = "";
    });


    var nachrichtenFooterEmoji = document.createElement('select');
    nachrichtenFooterEmoji.setAttribute('id', 'emojiAuswahl');
    nachrichtenFooterEmoji.style = "float: left; height: 25px";
    
    var auswahl1 = document.createElement('option');
    auswahl1.text = "😀";
    auswahl1.addEventListener('click', () => {
      nachrichtenFooterTextfeld.value += auswahl1.text;
    });

    var auswahl2 = document.createElement('option');
    auswahl2.text = "😐";
    auswahl2.addEventListener('click', () => {
      nachrichtenFooterTextfeld.value += auswahl2.text;
    });

    var auswahl3 = document.createElement('option');
    auswahl3.text = "🙁";
    auswahl3.addEventListener('click', () => {
      nachrichtenFooterTextfeld.value += auswahl3.text;
    });

    var auswahl4 = document.createElement('option');
    auswahl4.text = "👍";
    auswahl4.addEventListener('click', () => {
      nachrichtenFooterTextfeld.value += auswahl4.text;
    });

    var auswahl5 = document.createElement('option');
    auswahl5.text = "👎";
    auswahl5.addEventListener('click', () => {
      nachrichtenFooterTextfeld.value += auswahl5.text;
    });



    

    nachrichtenFooterEmoji.add(auswahl1);
    nachrichtenFooterEmoji.add(auswahl2);
    nachrichtenFooterEmoji.add(auswahl3);
    nachrichtenFooterEmoji.add(auswahl4);
    nachrichtenFooterEmoji.add(auswahl5);


    nachrichtenFooterDiv.appendChild(nachrichtenFooterEmoji);
    nachrichtenFooterDiv.appendChild(nachrichtenFooterTextfeld);
    nachrichtenFooterDiv.appendChild(nachrichtenFooterAbsendenButton);

    nachrichtenDiv.appendChild(nachrichtenDivLinks);
    nachrichtenDiv.appendChild(nachrichtenDivRechts);

    chatDivContent.appendChild(chatTitel);
    chatDivContent.appendChild(nachrichtenDiv);
    chatDivContent.appendChild(nachrichtenFooterDiv);

  }

  function nachrichtSpawnen(text, fremd){
    var nachricht = document.createElement('div');
    nachricht.innerText = text;
    nachricht.style = "";

    

    if(fremd){
      nachricht.style = "float: left; padding: 10px 10px 10px 10px; text-align: left; width: 280px; overflow-wrap: break-word";
      nachrichtenDivLinks.appendChild(nachricht);
    }
    else {
      nachricht.style = "float: right; padding: 10px 10px 10px 10px; text-align: right; width: 280px; overflow-wrap: break-word";
      nachrichtenDivRechts.appendChild(nachricht);
    }
  

    
  }

  async function nachrichtSenden(text){
    var data = new URLSearchParams({
      'content': text,
      'chat_id': chatNrToId.get(chatDiv.id)
    });
  
    let response = await fetch(CHATSERVER + 'NewMessage.php', {
      method: 'POST',
      credentials: "include",
      body: data
    });
  
    if (response.ok){
      nachrichtSpawnen(text, false);
      return true;
    }
    return false;
  }


  async function getMessages(){
    var nachrichten;

    var url = CHATSERVER + 'GetMessages.php?chat_id=' + chatNrToId.get(chatDiv.id);
    console.log(url);

    //https://stackoverflow.com/questions/35038857/setting-query-string-using-fetch-get-request
    var response = await fetch(url, {
      method: 'GET',
      credentials: "include"
    })
    .then(response=>response.json())
    .then(data=>{ nachrichten = data });
  
    if (nachrichten){
      console.log(nachrichten);
      nachrichtenDivLinks.value = "";
      nachrichtenDivRechts.value = "";

      
      for (var nachrichtId in nachrichten ){
        if (nachrichten[nachrichtId].email== eingeloggteEmail){
          nachrichtSpawnen(nachrichten[nachrichtId].content, false);
        }
        else {
          nachrichtSpawnen(nachrichten[nachrichtId].content, true);
        }
      }
      /*  PSEUDOCODE  
      nachrichtenDivLinks.clear()
      nachrichtenDivRechts.clear()
      for (mes in messages){
        if (mes.nichtMeine){
          nachrichtSpawnen(mes.text, true)
        }
        else {
          nachrichtSpawnen(mes.text, false)
        }
      }
      */
      return true;
    }
    return false;
  }


  async function getAllOpenChatsFromUser(){
    while (eingeloggt){
      var chat_ids;
      let response = await fetch(CHATSERVER + 'GetAllOpenChatsFromUser.php', {
        method: 'POST',
        credentials: "include"
      })
      .then(response=>response.json())
      .then(data=>{ chat_ids = data.chat_id });


      for (var i = 0; i < chat_ids.length; i++){
        var nrVonId = valueInMap(i)
        if (nrVonId === null){
          spawnChat();
          neueSeite(SEITE_CHAT, chatDiv.id);
          chatNrToId.set(chatDiv.id, chat_ids[i]);
        }
        else {
          loadVars(nrVonId);
        }
        getMessages();
      }

      break;

      

      /*  PSEUDOCODE
      while (alleChatsVonResponseDurchgehen){
        chatNrToId.set(nrVomChat, idVonChatVonResponseBekommen)
        moveElementIntoForeground()
        getMessages()
      }
      */
      

      await sleep(2000);
    }
  }

  function valueInMap(value){
    var iterator = chatNrToId.values();
    for (var i = 0; i < chatNrToId.size; i++){
      if (iterator.next() == value){
        return i;
      }
    }
    return null;
  }

  //https://www.javatpoint.com/javascript-sleep
  function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
  }  
}







/**
 * Entfernt ein Chat-Fenster mit bestimmter id
 */
function destroyChat(id){
  document.body.removeChild(document.getElementById(id));
  chatMap.delete(Number(id));
  //endChat(id);
  showChatButton();
}

async function endChat(idNr, richtigeIdBoolean){
  let chatId = chatNrToId.get(Number(idNr));
  if (richtigeIdBoolean){
    chatId = idNr;
  } 
  if (chatId){
    var data = new URLSearchParams({
      'chat_id': chatId
    });
  
    let response = await fetch(CHATSERVER + 'endChat.php', {
      method: 'POST',
      credentials: "include",
      body: data
    });
  
    if (response.ok){
      return true;
    }
  }
  return false;
}

async function logOff(){
  //TODO soll eigentlich ohne Parameter auskommen (Die Email soll Serverseitig genommen werden)
  if (eingeloggteEmail){

    //Alle Chats schliessen
    eingeloggt = false;
    var chat_ids;
    let response = await fetch(CHATSERVER + 'GetAllOpenChatsFromUser.php', {
      method: 'POST',
      credentials: "include"
    })
    .then(response=>response.json())
    .then(data=>{ chat_ids = data.chat_id });


    for(var i = 0; i < chat_ids.length; i++){
      console.log(chat_ids[i]);
      endChat(chat_ids[i], true)
    }

    //Ausloggen
    var data = new URLSearchParams({
      'email': eingeloggteEmail
    });
  
    response = await fetch(CHATSERVER + 'LogOff.php', {
      method: 'POST',
      credentials: "include",
      body: data
    })
  
    if (response.ok){
      return true;
    }
  }
  return false;
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
  else if (chatMap === undefined || chatMap.size == 0) {  //Wenn alle Fenster geschlossen sind
    logOff();
    chatButton.style = "display: inline";
  }

}








//Ausführen beim Laden der Webseite


showChatButton();

addAllDragElements(document.getElementsByClassName("chatDiv"));


