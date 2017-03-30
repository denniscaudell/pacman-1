"use strict"

const socket = io.connect("http://127.0.0.1:3000")
const send = msg => socket.emit('clientmessage', msg)

const canvas = select('canvas')
const context = canvas.getContext('2d')

// Creates a new image object.
const sheet = new Image()
sheet.src = "images/sprites.png"

// Loads the sounds we will use.
// All .wav files are from: http://www.classicgaming.cc/classics/pac-man/sounds
const opening = new Audio("sounds/opening.ogg")
const waka = new Audio("sounds/waka.ogg")
const dead = new Audio("sounds/dead.ogg")

// opening.play()

const Gamestate = {
        START: 0,
        DEAD: 1,
        PLAYING: 2,
        WIN: 3
}

const Direction = {
        NEUTRAL : 0,
        RIGHT: 39,
        DOWN: 40,
        LEFT: 37,
        UP: 38
}

function moveCharacter(keyCode) {
        //player1 is de player die jij bent
        if (keyCode == Direction.RIGHT) {
                players["player1"]["direction"] = Direction.RIGHT
                players["player1"]["coords"]["x"] +=1
        }
        else if (keyCode == Direction.DOWN) {
                players["player1"]["direction"] = Direction.DOWN
                players["player1"]["coords"]["y"] -=1
        }
        else if (keyCode == Direction.LEFT) {
                players["player1"]["direction"] = Direction.LEFT
                players["player1"]["coords"]["x"] -=1
        }
        else if (keyCode == Direction.UP) {
                players["player1"]["direction"] = Direction.UP
                players["player1"]["coords"]["y"] += 1
        }
        //broadcast de veranderde coords naar clients
        var data = {
                player: "player1",
                x: players["player1"]["coords"]["x"],
                y: players["player1"]["coords"]["y"],
                direction: players["player1"]["direction"]
        }
        socket.emit("updatePlayerLocation", data)
}


let balls = []
let gameState = Gamestate.START

const players = {
        "player1" :{
                role: "pacman",
                coords: { x: 0, y: 0 },
                direction: Direction.NEUTRAL
        }, "player2" : {
                role: "blinky",
                coords: { x: 0, y: 0 },
                direction: Direction.NEUTRAL
        }, "player3": {
                role: "pinky",
                coords: { x: 0, y: 0 },
                direction: Direction.NEUTRAL
        }, "player4": {
                role: "inky",
                coords: { x: 0, y: 0 },
                direction: Direction.NEUTRAL
        }, "player5": {
                role: "clyde",
                coords: { x: 0, y: 0 },
                direction: Direction.NEUTRAL
        }}


        // Gets every key the user presses and sends them to the server.
        window.onkeypress = e => send(e.key)

        window.onkeydown = e => moveCharacter(e.keyCode)


        function doStuff() {
                context.drawImage(sheet, 0, 0, 224, 248, 0, 24, 224, 248)
                //context.drawImage(sheet, 209, 314, 13, 13, 150, 150, 13, 13)
                //drawBalls()
                drawPlayers()
        }

        function drawBalls() {
                for (var ball = 0; ball < balls.length; ball++) {
                        context.fillRect(ball[0]-3, ball[1]-3,6,6)
                }
        }

        function drawPlayers() {
                let localplayers = Object.keys(players)
                for (var i = 0; i < 5; i++) {
                        x = players[localplayers[i]]["coords"].x
                        y = players[localplayers[i]]["coords"].y
                        heightSpritePacman = 0 //To get the right pacman from the spritesheet
                        if (players[localplayers[i]]["direction"] == Direction.RIGHT) { heightSpritePacman = 298 }
                        if (players[localplayers[i]]["direction"] == Direction.DOWN) { heightSpritePacman = 330 }
                        if (players[localplayers[i]]["direction"] == Direction.LEFT) { heightSpritePacman = 282 }
                        if (players[localplayers[i]]["direction"] == Direction.UP) { heightSpritePacman = 314 }

                        context.drawImage(sheet, 209, heightSpritePacman, 13, 13, x, y, 13, 13)
                }
        }

        socket.on("updatePlayerLocation", updateBroadcastedPlayer)

        function updateBroadcastedPlayer(data) {
                players[data.player]["coords"]["x"] = data.x
                players[data.player]["coords"]["y"] = data.y
                players[data.player]["direction"] = data.direction
                console.log(players[data.player])
        }



        context.font = "20px Roboto"
        socket.on("UpdatePlayer", data => {
                context.drawImage(sheet, 0, 0, 224, 248, 0, 24, 224, 248)
                players.forEach(x => x.coords = data)
                doStuff = context.fillText(data, 0, 0)

                context.fillText(data, 0, 0)
        })

        const game = window.setInterval(_ => doStuff(), 100)
