let client = null, topic = null;

function checkText() {
 const disabled = document.getElementById("text").value.trim().length === 0;
 document.getElementById("send").disabled = disabled;
 document.getElementById("retain").disabled = disabled;
}

function afterDisconnection() {
 document.getElementById("disconnect").disabled = true;
 document.getElementById("connect").disabled = false;
 document.getElementById("text").value = "";
 document.getElementById("text").disabled = true;
 document.getElementById("send").disabled = true;
 document.getElementById("retain").disabled = true;
}

function connect() {
 const brokerURL = document.getElementById("brokerURL").value.trim();
 const port = parseInt(document.getElementById("port").value.trim());
 const useSSL = document.getElementById("useSSL").checked;
 const reconnect = document.getElementById("reconnect").checked;
 topic = document.getElementById("topic").value.trim();
 if(brokerURL.length === 0 || isNaN(port) || topic.length === 0) {
  console.error(new Date().toISOString() + " | Invalid broker URL, port or topic");
  return;
 }
 console.log(new Date().toISOString() + " | Connecting to " + brokerURL + " on port " + port + " ...");
 try {
  client = new Paho.Client(brokerURL, port, "");
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({onSuccess: onSuccess, onFailure: onFailure, useSSL: useSSL, reconnect: reconnect});
 }
 catch(err) {
  console.error(new Date().toISOString() + " | " + err.message);
 }
}

function onSuccess() {
 console.log(new Date().toISOString() + " | Subscribing to topic " + topic + " ...");
 client.subscribe(topic);
 console.log(new Date().toISOString() + " | Connected");
 document.getElementById("disconnect").disabled = false;
 document.getElementById("connect").disabled = true;
 document.getElementById("text").disabled = false;
}

function onFailure(err) {
 console.error(err.errorMessage ? new Date().toISOString() + " | Failure: " + err.errorMessage : new Date().toISOString() + " | Failure");
}

function disconnect() {
 client.disconnect();
 console.log(new Date().toISOString() + " | Disconnected");
 afterDisconnection();
}

function onConnectionLost(err) {
 if(err.errorCode === 0) { return; }
 console.error(err.errorMessage ? new Date().toISOString() + " | Connection lost: " + err.errorMessage : new Date().toISOString() + " | Connection lost");
 afterDisconnection();
}

function onMessageArrived(mes) {
 try {
  const message = JSON.parse(mes.payloadString);
  if(!message.u || !message.t) { throw new Error("Invalid message"); }
  updateMessages(new Date().toISOString() + " | " + mes.destinationName + " | " + message.u + ":\n" + message.t);
 }
 catch(err) {
  console.error(new Date().toISOString() + " | Invalid message received: " + mes.payloadString);
 }
}

function updateMessages(message) {
 const textarea = document.getElementById("messages");
 textarea.value = textarea.value.length > 0 ? textarea.value + "\n" + message : message;
 textarea.scrollTop = textarea.scrollHeight;
 document.getElementById("clear").disabled = false;
}

function sendMessage() {
 const val = document.getElementById("username").value.trim();
 const username = val.length > 0 ? val : "none";
 const text = document.getElementById("text").value.trim();
 const retain = document.getElementById("retain").checked;
 const message = JSON.stringify({u: username, t: text});
 document.getElementById("text").value = "";
 checkText();
 client.publish(topic, message, 1, retain);
}

function clearMessages() {
 document.getElementById("messages").value = "";
 document.getElementById("clear").disabled = true;
}
