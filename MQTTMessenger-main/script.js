let client = null;

function connect() {
 let brokerURL = document.getElementById("brokerURL").value.trim();
 let port = parseInt(document.getElementById("port").value.trim());
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | Connecting to " + brokerURL + " on port " + port, "logs");
 client = new Paho.Client(brokerURL, port, "");
 client.onConnectionLost = onConnectionLost;
 client.onMessageArrived = onMessageArrived;
 client.connect({onSuccess: onConnect, onFailure: onFailure, useSSL: true});
}

function onConnect() {
 let topic = document.getElementById("topic").value;
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | Subscribing to topic " + topic, "logs");
 client.subscribe(topic);
 date = new Date().toLocaleString().replace(",","");
 updateMessages(date + " | Connected", "logs");
 document.getElementById("disconnect").disabled = false;
 checkText();
}

function onFailure(obj) {
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | " + obj.errorMessage, "logs");	
}

function disconnect() {
 client.disconnect();
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | Disconnected", "logs");
 document.getElementById("disconnect").disabled = true;
 document.getElementById("send").disabled = true;
}

function onConnectionLost(message) {
 if(message.errorCode !== 0) {
  let date = new Date().toLocaleString().replace(",", "");
  updateMessages(date + " | Connection lost: " + message.errorMessage, "logs");
  document.getElementById("disconnect").disabled = true;
  document.getElementById("send").disabled = true;
 }
}

function onMessageArrived(message) {
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | " + message.destinationName + " | " + message.payloadString, "messages");
}

function updateMessages(message, textAreaID) {
 let textarea = document.getElementById(textAreaID);
 let messages = textarea.value !== "" ? textarea.value + "\n" : textarea.value;
 textarea.value = messages + message;
 textarea.scrollTop = textarea.scrollHeight;
}

function sendMessage() {
 let topic = document.getElementById("topic").value;
 let username = document.getElementById("username").value.trim() !== "" ? document.getElementById("username").value.trim() : "nousername";
 let message = username + ":\n" + document.getElementById("message").value.trim();
 document.getElementById("message").value = "";
 document.getElementById("send").disabled = true;
 client.publish(topic, message, 1, false);
}

function checkText() {
 let message = document.getElementById("message").value.trim();
 if(message !== "" && !document.getElementById("disconnect").disabled) {
   document.getElementById("send").disabled = false;
 }
 else {
   document.getElementById("send").disabled = true;
 }
}