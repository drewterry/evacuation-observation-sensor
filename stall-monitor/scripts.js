const http = new XMLHttpRequest();
const url = "http://10.1.5.135:3000/stall";

function setBathroomStatus(occupied) {
  document.getElementById('toilet').style.display = 'block';
  document.getElementById('occupied').style.display = occupied ? 'block' : 'none';
  document.getElementById('vacant').style.display = occupied ? 'none' : 'block';
};

function log(msg) {
  document.getElementById('log').textContent = msg;
}
    
// Create a client instance
client = new Paho.MQTT.Client(
  location.hostname||"10.1.5.121",
  parseInt(location.port||1888),
  location.pathname.substr(0,location.pathname.lastIndexOf("/")+1),
  Math.random().toString(36).substring(7)
);
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
log("MQTT Connecting...");
// connect the client
client.connect({onSuccess:onConnect});
// called when the client connects
function onConnect() {
log("MQTT Connected");
  client.subscribe("#"); // get everything
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    document.getElementById('toilet').style.display = 'none';
    log("MQTT connection lost:"+responseObject.errorMessage);
  }
}
// called when a message arrives
function onMessageArrived(message) {
  log(""+message.destinationName+"  ->  "+JSON.stringify(message.payloadString));
  if (message.destinationName.startsWith("/ble/advertise/stall-monitor-men/l")) {
    // console.log(message.destinationName, ": ", message.payloadString);
    setBathroomStatus(message.payloadString === "1");
  }
}
