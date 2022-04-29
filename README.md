Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@MicheleGiammarini33 
MicheleGiammarini33
/
MQTTMessenger
Public
forked from zyzalfors/MQTTMessenger
Code
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings
MQTTMessenger/main.html
@zyzalfors
zyzalfors Add files via upload
Latest commit 3a9d1f1 on 9 Feb
 History
 1 contributor
30 lines (30 sloc)  1.29 KB
   
<!DOCTYPE html>
<html>
<head>
<title>MQTT Messenger 1.0.7</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js"></script>
<script src="script.js"></script>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
MQTT Messenger 1.0.7
<hr>
<label>Broker URL:</label><input type="text" id="brokerURL">
<br><br>
<label>Port:</label><input type="number" min="0" id="port">
<br><br>
<label>Topic:</label><input type="text" id="topic">
<br><br>
<input type="button" value="Connect" id="connect" onclick="connect()">
<input type="button" value="Disconnect" id="disconnect" onclick="disconnect()" disabled>
<input type="button" value="Clear messages" id="clear" onclick="clearMessages()" disabled>
<hr>
<textarea id="logs" rows="5" cols="90" placeholder="Logs appears here ..." readonly></textarea>
<hr>
<textarea id="messages" rows="25" cols="90" placeholder="Messages appears here ..." readonly></textarea>
<br><br>
<label>Username:</label><input type="text" id="username">
<br><br>
<textarea id="message" rows="2" cols="90" onkeydown="onKeyPressed()" oninput="checkText()" placeholder="Enter your message here and press CTRL to send it ..."></textarea>
<br>
<input type="button" value="Send message" id="send" onclick="sendMessage()" disabled>
</html>
© 2022 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete
