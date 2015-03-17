var io = require("socket.io")();
var uuid = require("node-uuid");
var extend = require("node.extend");

var log = require("./log.js");

var namespaces =
{
	player: io.of("/player"),
	board: io.of("/board"),
	control: io.of("/control")
};

var gameState =
{
	WAITING: 1,
	READY: 2,
	STARTING: 3,
	RUNNING: 4,
	COMPLETED: 5
};

var game =
{
	state: gameState.WAITING,
	players: {},
	sequence: [],
	sequenceRunTimestamp: null
};

var __player =
{
	id: null,
	socketId: null,
	number: 0,
	errors: 0,
	sequenceIndex: 0,
	isSequenceCompleted: false,
	stats: { lastSequenceDuration: 0 },
	isConnected: false
};

function init(httpServer)
{
	io.attach(httpServer, { transports:["polling","websocket"] });

	log("Web application initialized");
}

namespaces.player.on("connection", function (socket)
{
	socket.on("RegisterPlayer", function (id, callback)
	{
		if (id == null)
		{
			id = uuid.v4();
		}

		callback(id);

		var player = extend(true, {}, __player);
		player.id = id;
		player.socketId = socket.id;
		player.isConnected = true;

		var _player = getPlayerById(id);
			
		if (_player == null)
		{
			if (game.state == gameState.WAITING)
			{
				player.number = Object.keys(game.players).length + 1;
			}
		}
		else
		{
			var player = extend(true, {}, _player);

			player.socketId = socket.id;
			player.sequenceIndex = 0;
			player.isSequenceCompleted = false;
			player.stats.lastSequenceDuration = 0;
			player.isConnected = true;

			delete game.players[_player.socketId];
		}

		if (player.number > 0)
		{
			game.players[socket.id] = player;
			updatePlayerToBoard(socket.id);
		}

		updatePlayer(player);
		updateGameState();
	});

	socket.on("ButtonPressed", function (buttonId)
	{
		var player = game.players[socket.id];

		if (player.errors < 3)
		{
			switch (game.state)
			{
				case gameState.WAITING:
					namespaces.board.emit("ButtonPressed",
					{
						playerNumber: player.number,
						buttonId: buttonId
					});
					break;

				case gameState.RUNNING:
					if (!player.isSequenceCompleted)
					{
						namespaces.board.emit("ButtonPressed",
						{
							playerNumber: player.number,
							buttonId: buttonId
						});

						if (buttonId == game.sequence[player.sequenceIndex])
						{
							player.sequenceIndex++;
							if (player.sequenceIndex == game.sequence.length)
							{
								player.isSequenceCompleted = true;
								player.stats.lastSequenceDuration = (Date.now() - game.sequenceRunTimestamp) / 1000;
							}
						}
						else
						{
							player.errors++;
							player.isSequenceCompleted = true;
						}

						if (player.isSequenceCompleted)
						{
							updatePlayerToBoard(socket.id);
							updatePlayer(player);
						}
					}
					break;

				default:
					break;
			}
		}
	});

	socket.on("disconnect", function ()
	{
		if (game.players[socket.id] != undefined)
		{
			game.players[socket.id].isConnected = false;
		}
		updatePlayerToBoard(socket.id);
	});
});

namespaces.board.on("connection", function (socket)
{
	updatePlayersToBoard();
	socket.on("RunSequence", function () { runSequence(); });
});

namespaces.control.on("connection", function (socket)
{
	updateGameState();
	socket.on("StartGame", function () { startGame(); });
	socket.on("StartSequence", function () { startSequence(); });
	socket.on("ResetGame", function () { resetGame(); });
	socket.on("ShowDebug", function ()
	{
		//log(io.eio);
		log(game);
	});
});

function startGame()
{
	setGameState(gameState.READY);
}

function startSequence()
{
	for (var socketId in game.players)
	{
		var player = game.players[socketId];
		player.isSequenceCompleted = false;
		player.sequenceIndex = 0;
		player.stats.lastSequenceDuration = 0;
	}
	updatePlayersToBoard();
	game.sequence.push(Math.floor((Math.random() * 4) + 1));
	setGameState(gameState.STARTING);
	namespaces.board.emit("SequenceStarted", game.sequence);
}

function runSequence()
{
	game.sequenceRunTimestamp = Date.now();
	setGameState(gameState.RUNNING);
	setTimeout(function () { completeSequence(); }, 3500 + (game.sequence.length * 750));
}

function completeSequence()
{
	var activePlayers = [];

	for (var socketId in game.players)
	{
		var player = game.players[socketId];
		if (player.errors < 3 && !player.isSequenceCompleted)
		{
			player.errors++;
			player.isSequenceCompleted = true;
			updatePlayer(player);
		}
		if (player.errors < 3) { activePlayers.push(player.number); }
	}
	updatePlayersToBoard();
	namespaces.board.emit("SequenceCompleted", activePlayers);

	setGameState((activePlayers.length > 0) ? gameState.READY : gameState.COMPLETED);
}

function setGameState(state)
{
	game.state = state;
	updateGameState();
}

function updateGameState()
{
	namespaces.control.emit("GameStateUpdated", game.state);
	namespaces.player.emit("GameStateUpdated", game.state);
}

function resetGame()
{
	game.players = {};
	game.sequence = [];
	game.sequenceRunTimestamp = null;
	setGameState(gameState.WAITING);
	namespaces.board.emit("GameReset", null);
	namespaces.player.emit("GameReset", null);
}

function updatePlayersToBoard()
{
	namespaces.board.emit("PlayersUpdated", game.players);
}

function updatePlayerToBoard(socketId)
{
	namespaces.board.emit("PlayerUpdated", game.players[socketId]);
}

function updatePlayer(player)
{
	namespaces.player.to(player.socketId).emit("PlayerUpdated", player);
}

function getPlayerById(id)
{
	for (var socketId in game.players)
	{
		if (game.players[socketId].id == id)
		{
			return game.players[socketId];
		}
	}
	return null;
}

module.exports.init = init;
