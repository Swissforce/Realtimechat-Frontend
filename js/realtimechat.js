/**
 * @author Martin Düppenbecker
 * @since 28.04.22
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
var chatTitel;
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
var ichTechsupport = false;


//Funktionen


/**
 * Spawned einen Chat mit einer inkrementierenden id
 */
var anzGespawnterChats = 0;
function spawnChat(chatBoolean){
  anzGespawnterChats++;

  chatDiv = document.createElement('div');
  chatDiv.className = "chatDiv";
  chatDiv.id = anzGespawnterChats;

  chatDivHeader = document.createElement('div');
  chatDivHeader.className = "chatDivHeader";
  chatDivHeader.textContent = "Realtime-Chat Nr." + anzGespawnterChats;

  
  //https://www.tutorialspoint.com/generating-random-hex-color-in-javascript
  const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++){
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    };
    return color;
 };


  if (chatBoolean){
    chatDivHeader.style = "background-color: " +  randomColor();
  }
  
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

  if(chatBoolean){
    aktuelleSeite = SEITE_CHAT;
  }

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
  this.chatTitel = chatObj.chatTitel;
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
    nachrichtenDivRechts:nachrichtenDivRechts,
    chatTitel:chatTitel
  };

  chatMap.set(id, chatObj);
}

//https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeChildNodes(parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
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

  //man soll nicht aus Chat herausgehen können
  if (seiteNeu != SEITE_CHAT){
    chatZurueck.style = "display: inline";
    chatZurueck.style = "float: left";
  
    //Muss erneuert werden
    chatZurueck.addEventListener('click', () => {
      neueSeite(aktuelleSeite, chatDiv.id);
    });
  }
  else {
    chatZurueck.style = "display: none";
  }


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

    //schaut, ob der eingeloggte User Techsupport ist
    /*
    var userrolle;
    let response = await fetch(CHATSERVER + 'getUser.php', {
      method: 'POST',
      credentials: "include"
    })
    .then(response=>response.json())
    .then(data=>{ userrolle = data["user_id"] });

    if(userrolle == 1){
      ichTechsupport = true;
    }
    */

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
    
    if (ichTechsupport){
      supportButton.setAttribute("disabled", true);
    }
    else {
      supportButton.addEventListener('click', () => {
        createChat();
      });
    }


    var versendenButton = document.createElement('button');
    versendenButton.textContent = "Letzten Chat an Email senden";
    versendenButton.addEventListener('click', () => {
      var emailVerschickt = sendEmail(null);

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
    var chatId;
    var data = new URLSearchParams({
      'email': eingeloggteEmail
    });

    disEnableAll();
    let response = await fetch(CHATSERVER + 'CreateChat.php', {
      method: 'POST',
      credentials: "include",
      body: data
    })
    .then(response=>response.text())
    .then(text=>{ chatId = text });
    disEnableAll();

    if (chatId){
      chatNrToId.set(chatDiv.id, chatId);
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
    chatTitel = document.createElement('h1');
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
  
    var unsichtbarNachricht = document.createElement('div');
    unsichtbarNachricht.innerText = text;
    unsichtbarNachricht.style = "";
    
  
    if(fremd){
      nachricht.style = "float: left; padding: 10px 10px 10px 10px; text-align: left; max-width: 270px; overflow-wrap: break-word";
      nachrichtenDivLinks.appendChild(nachricht);
  
      unsichtbarNachricht.style = "float: left; padding: 10px 10px 10px 10px; text-align: left; max-width: 270px; overflow-wrap: break-word; visibility: hidden";
      nachrichtenDivRechts.appendChild(unsichtbarNachricht);
    }
    else {
      nachricht.style = "float: right; padding: 10px 10px 10px 10px; text-align: right; max-width: 270px; overflow-wrap: break-word";
      nachrichtenDivRechts.appendChild(nachricht);
  
      unsichtbarNachricht.style = "float: right; padding: 10px 10px 10px 10px; text-align: right; max-width: 270px; overflow-wrap: break-word; visibility: hidden";
      nachrichtenDivLinks.appendChild(unsichtbarNachricht);
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
  
    //https://stackoverflow.com/questions/956719/number-of-elements-in-a-javascript-object
    if (Object.keys(nachrichten).length > 0){
      console.log(nachrichten);

      
      removeChildNodes(nachrichtenDivLinks);
      removeChildNodes(nachrichtenDivRechts);

      var ersteNachricht = true;
      for (var nachrichtId in nachrichten ){
        if (ichTechsupport && ersteNachricht){
          chatTitel.textContent = nachrichten[nachrichtId].username;
          ersteNachricht = false;
        }
        var zeit = "(" + nachrichten[nachrichtId].send_time.substr(-8,5) + ")";
        if (nachrichten[nachrichtId].email == eingeloggteEmail){
          nachrichtSpawnen(nachrichten[nachrichtId].content + " " + zeit, false);
        }
        else {
          nachrichtSpawnen(zeit + " " + nachrichten[nachrichtId].content, true);
        }
      }
      return true;
    }
    return false;
  }

  var letzte_chat_ids = null;
  async function getAllOpenChatsFromUser(){
    while (eingeloggt){
      var chat_ids;
      let response = await fetch(CHATSERVER + 'GetAllOpenChatsFromUser.php', {
        method: 'POST',
        credentials: "include"
      })
      .then(response=>response.json())
      .then(data=>{ chat_ids = data.chat_id });


      
      if (letzte_chat_ids != null) {  //sucht nach geschlossenen Chats
        if (letzte_chat_ids != chat_ids){
          function valueInChatIds(value){
            for (var j = 0; i < chat_ids.length; j++){
              if(chat_ids[j] == value){
                return chat_ids[j];
              }
            }
            return null;
          }

          for (var i = 0; i < letzte_chat_ids.length; i++){
            if (valueInChatIds(letzte_chat_ids[i]) == null){
              try{
                loadVars(Number(valueInMap(letzte_chat_ids[i])));
                disEnableAll();

                var chatFertig = document.createElement('p');
                chatFertig.textContent = "Chat wurde beendet!";
                chatDivContent.appendChild(chatFertig);

                updateVars(Number(valueInMap(letzte_chat_ids[i])));
              }
              catch(error){}
            }
          }
        }
      }
      
     
      for (var i = 0; i < chat_ids.length; i++){
        var nrVonId = valueInMap(chat_ids[i]);
        if (nrVonId === null){
          spawnChat(true);
          //neueSeite(SEITE_CHAT, chatDiv.id);
          chatNrToId.set(chatDiv.id, chat_ids[i]);
        }
        else {
          try{ //wenn chat von Client geschlossen wird, dann sind die chat_ids noch nicht geupdated
            loadVars(Number(nrVonId));
          }
          catch(error){
            console.log("catch: " + nrVonId)
          }
        }
        await getMessages();
      }

      letzte_chat_ids = chat_ids;

      //break;

      

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

  function valueInMap(idValue){
    for (var iterator of chatNrToId){
      console.log(iterator);
      if (iterator[1] == idValue){
        return iterator[0];
      }
    }
    return null;
  }

  //https://www.javatpoint.com/javascript-sleep
  function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
  }  
}






async function sendEmail(chat_id){
  let response;

  var data = new URLSearchParams({
    'chat_id': chat_id
  });

  response = await fetch(CHATSERVER + 'SendEmail.php', {
    method: 'POST',
    credentials: "include",
    body: data
  });


  if (response.ok){
    return true;
  }
  else {
    return false;
  }
}



/**
 * Entfernt ein Chat-Fenster mit bestimmter id
 */
function destroyChat(id){
  if (aktuelleSeite == SEITE_CHAT){
    //https://www.w3schools.com/js/js_popup.asp
    if (confirm("Wollen Sie den Chatverlauf per Email versenden?")){
      sendEmail(chatNrToId.get(id));
    }
  }
  document.body.removeChild(document.getElementById(id));
  chatMap.delete(Number(id));
  //chatNrToId.delete(id);
  endChat(id);
  showChatButton();
}

async function endChat(idNr, richtigeIdBoolean){
  let chatId = chatNrToId.get(idNr);
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
      endChat(chat_ids[i], true);
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


