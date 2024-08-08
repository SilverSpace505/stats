
utils.setup()
utils.ignoreSafeArea()
utils.setStyles()

ui.targetSize.x = 800
ui.textShadow.bottom = "auto"

var delta = 0
var lastTime = 0
var su = 0

var views = null
var clicks = null
var online = 0

var apps = ["silver", "pyramids-of-giza", "platformer", "speedwing", "battle-cubes", "road-weaver", "space-shoote-ai", "the-farlands", "earth", "life-3", "life-2", "life", "sand", "powerfall", "jims-adventure", "tritag"]
var cpps = ["Silver", "Pyramids of Giza", "Platformer", "Speedwing", "Battle Cubes", "Road Weaver", "Space Shooter AI", "The Farlands", "Earth", "Life 3", "Life 2", "Life", "SAND", "Powerfall", "Jim's Adventure", "Tritag"]
var selected = 0

var dayNames = ["Sunday", "Monday", "Tuesday", "Wensday", "Thursday", "Friday", "Saturday"]

var points = 30
var gotTime = 0

var appsDrop = new ui.Dropdown(cpps)
appsDrop.bgColour = [22, 22, 22, 1]
appsDrop.outlineColour = [255, 255, 255, 1]

function getViews(app) {
    sendMsg({getViews: app, online: app})
}

function getClicks(app) {
    sendMsg({getClicks: app})
}

function update(timestamp) {
    requestAnimationFrame(update)

    utils.getDelta(timestamp)
    input.setGlobals()
    ui.resizeCanvas()
    ui.getSu()

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [22, 22, 22, 1])
    ui.rect(canvas.width/2, 200*su, canvas.width, 5*su, [255, 255, 255, 1])

    if (wConnect && !document.hidden) {
        wConnect = false
        connectToServer()
    }

    if (jKeys["KeyA"] || jKeys["ArrowLeft"] || (mouse.lclick && mouse.x < 100*su)) {
        if (selected > 0) {
            selected--
            appsDrop.selected = selected
            got = false
            gotTime
            getViews(apps[selected])
            getClicks(cpps[selected])
        }
    }
    if (jKeys["KeyD"] || jKeys["ArrowRight"] || (mouse.lclick && mouse.x > canvas.width-100*su && mouse.y > 100*su && !appsDrop.open)) {
        if (selected < apps.length-1) {
            selected++
            appsDrop.selected = selected
            got = false
            gotTime = 0
            getViews(apps[selected])
            getClicks(cpps[selected])
        }
    }

    let dw = 300*su
    appsDrop.set(canvas.width - 80*su - dw/2, 45*su, dw, 50*su)
    appsDrop.set2(25*su, 5*su)
    appsDrop.basic()
    appsDrop.draw()

    gotTime += delta
    if (!got && gotTime >= 0.2) {
        got = true
        clicks = null
        views = null
    }

    if (jKeys["KeyW"] || jKeys["ArrowUp"] || (mouse.lclick && mouse.y < 100*su && mouse.x < canvas.width - dw - 20*su)) {
        points += 1
    }
    if (jKeys["KeyS"] || jKeys["ArrowDown"] || (mouse.lclick && mouse.y > canvas.height-100*su)) {
        points -= 1
    }
    if (jKeys["KeyE"]) {
        points += 5
    }
    if (jKeys["KeyQ"]) {
        points -= 5
    }
    if (jKeys["KeyR"]) {
        points = 30
    }
    if (mouse.lclick) {
        latencies = []
        startP = performance.now()
        sendMsg({testPing: true})
    }

    ui.text(canvas.width/2, 100*su, 100*su, cpps[selected], {align: "center"})

    let hoverText = ""

    let y = 0
    if (views) {
        ui.text(canvas.width/2, canvas.height/2-250*su, 50*su, "Views", {align: "center"})
        ui.text(canvas.width/2-250*su, canvas.height/2-250*su, 30*su, "Total: "+views.views)
        ui.text(canvas.width/2+250*su, canvas.height/2-250*su, 30*su, "Online: "+online, {align: "right"})
        ui.rect(canvas.width/2, canvas.height/2-65.5*su, 640*su, 300*su, [255, 255, 255, 1], 10*su, [127, 127, 127, 1])
        let recent = {}
        let day = Math.round(new Date().getTime()/1000 / 86400) - 19720
        let max = 0
        for (let i = 0; i < points; i++) {
            let day2 = (i + day-points+1).toString()
            if (day2 in views.days) {
                recent[i] = views.days[day2]
                if (views.days[day2] > max) {
                    max = views.days[day2]
                }
            }
        }
        for (let i = 0; i < points; i++) {
            if (i in recent) {
                let h = recent[i] / max
                let date = new Date((i+day-points+1 + 19720)*86400*1000)
                let datet = dayNames[date.getDay()] + " | " + date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
                let rect = [canvas.width/2-630/2*su + i*(630/points)*su + (630/points/2)*su, canvas.height/2-65.5*su + 140*su - h*140 * su, (630/points/1.1)*su, h*280*su]
                ui.rect(...rect, [0, 127, 255, 1])
                ui.text(canvas.width/2-630/2*su + i*(630/points)*su + (630/points/2)*su, canvas.height/2-65.5*su + 120*su, 20*su, recent[i].toString(), {align: "center"})
                if (ui.hovered(...rect)) {
                    hoverText = datet
                }
            }
        }
        y += 375*su
    }

    if (clicks) {
        ui.text(canvas.width/2, canvas.height/2-250*su + y, 50*su, "Clicks", {align: "center"})
        ui.text(canvas.width/2-250*su, canvas.height/2-250*su + y, 30*su, "Total: "+clicks.clicks)
        ui.rect(canvas.width/2, canvas.height/2-65.5*su + y, 630*su, 300*su, [255, 255, 255, 1], 10*su, [127, 127, 127, 1])
        let recent = {}
        let day = Math.round(new Date().getTime()/1000 / 86400) - 19720
        let max = 0
        for (let i = 0; i < points; i++) {
            let day2 = (i + day-points+1).toString()
            if (day2 in clicks.days) {
                recent[i] = clicks.days[day2]
                if (clicks.days[day2] > max) {
                    max = clicks.days[day2]
                }
            }
        }
        for (let i = 0; i < points; i++) {
            if (i in recent) {
                let h = recent[i] / max
                let date = new Date((i+day-points+1 + 19720)*86400*1000)
                let datet = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
                let rect = [canvas.width/2-630/2*su + i*(630/points)*su + (630/points/2)*su, canvas.height/2-65.5*su + 140*su - h*140 * su + y, (630/points/1.1)*su, h*280*su]
                ui.rect(...rect, [0, 127, 255, 1])
                ui.text(canvas.width/2-630/2*su + i*(630/points)*su + (630/points/2)*su, canvas.height/2-65.5*su + 120*su + y, 20*su, recent[i].toString(), {align: "center"})
                if (ui.hovered(...rect)) {
                    hoverText = datet
                }
            }
        }
    }

    ui.text(mouse.x+10, mouse.y+15+15*su, 25*su, hoverText)

    ui.text(80*su, 50*su, 50*su, Math.round(latencyV)+"ms")

    if (mouse.ldown) {
        let poses = []

        for (let i in latencies) {
            poses.push([210*su - i*5, 200*su - latencies[i]*su])
        }

        if (poses.length > 0) {
            ui.path(poses, 5*su, [0, 127, 255, 1])
        }
    

    }
    
    input.updateInput()
}

appsDrop.changed = (value) => {
    selected = appsDrop.selected
    got = false
    gotTime = 0
    getViews(apps[selected])
    getClicks(cpps[selected])
}

requestAnimationFrame(update) 