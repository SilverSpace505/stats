
var ws = new WebSocket("wss://server.silverspace.online:443")
var connected = false
var got = false

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
	}
}

ws.addEventListener("open", (event) => {
	ws.send(JSON.stringify({connect: "analytics"}))
})

ws.addEventListener("message", (event) => {
    var msg = JSON.parse(event.data)
    if ("connected" in msg) {
        connected = true
        console.log("Connected")
        getViews(apps[selected])
        getClicks(cpps[selected])
    }
    if ("ping" in msg) {
        sendMsg({ping: true})
    }
    if ("views" in msg) {
        if (!got) {
            got = true
            clicks = null
        }
        views = msg.views
    }
    if ("clicks" in msg) {
        if (!got) {
            got = true
            views = null
        }
        clicks = msg.clicks
    }
    if ("online" in msg) {
        online = msg.online
    }
})