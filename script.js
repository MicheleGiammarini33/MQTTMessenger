let client = null;
let topic = null;

function connect()
{
 let brokerURL = document.getElementById("brokerURL").value.trim();
 let port = parseInt(document.getElementById("port").value.trim());
 topic = document.getElementById("topic").value.trim();
 let date = new Date().toLocaleString().replace(",", "");
 if(brokerURL === "" || isNaN(port) || topic === "")
 {
  updateMessages(date + " | Invalid broker URL, port or topic", "logs");
  return;
 }
 updateMessages(date + " | Connecting to " + brokerURL + " on port " + port, "logs");
 client = new Paho.Client(brokerURL, port, "");
 client.onConnectionLost = onConnectionLost;
 client.onMessageArrived = onMessageArrived;
 client.connect({onSuccess: onSuccess, onFailure: onFailure, useSSL: true});
}

function onSuccess()
{
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | Subscribing to topic " + topic, "logs");
 client.subscribe(topic);
 date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | Connected", "logs");
 document.getElementById("disconnect").disabled = false;
 document.getElementById("connect").disabled = true;
 checkText();
}

function onFailure(obj)
{
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | " + obj.errorMessage, "logs");
}

function disconnect()
{
 client.disconnect();
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | Disconnected", "logs");
 document.getElementById("disconnect").disabled = true;
 document.getElementById("connect").disabled = false;
 document.getElementById("send").disabled = true;
}

function onConnectionLost(message)
{
 if(message.errorCode !== 0)
 {
  let date = new Date().toLocaleString().replace(",", "");
  updateMessages(date + " | Connection lost: " + message.errorMessage, "logs");
  document.getElementById("disconnect").disabled = true;
  document.getElementById("connect").disabled = false;
  document.getElementById("send").disabled = true;
 }
}

function onMessageArrived(message)
{
 let date = new Date().toLocaleString().replace(",", "");
 updateMessages(date + " | " + message.destinationName + " | " + message.payloadString, "messages");
}

function updateMessages(message, textAreaID)
{
 let textarea = document.getElementById(textAreaID);
 let messages = textarea.value !== "" ? textarea.value + "\n" : textarea.value;
 textarea.value = messages + message;
 textarea.scrollTop = textarea.scrollHeight;
 if(textAreaID === "messages")
 {
  document.getElementById("clear").disabled = false;
 }
}

function sendMessage()
{
 let username = document.getElementById("username").value.trim() !== "" ? document.getElementById("username").value.trim() : "nousername";
 let message = username + ":\n" + document.getElementById("message").value.trim();
 document.getElementById("message").value = "";
 document.getElementById("send").disabled = true;
 client.publish(topic, message, 1, false);
}

function checkText()
{
 let message = document.getElementById("message").value.trim();
 if(message !== "" && document.getElementById("connect").disabled)
 {
  document.getElementById("send").disabled = false;
 }
 else
 {
  document.getElementById("send").disabled = true;
 }
}

function clearMessages()
{
 document.getElementById("messages").value = "";
 document.getElementById("clear").disabled = true;
}

function onKeyPressed()
{
 let key = window.event.keyCode;
 if(key === 17 && !document.getElementById("send").disabled)
 {
  sendMessage();
 }
}