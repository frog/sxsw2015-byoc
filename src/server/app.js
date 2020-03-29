var io = require("socket.io")();
var uuid = require("uuid/v4");

var log = require("./log.js");

var namespaces =
{
	player: io.of("/player"),
	board: io.of("/board"),
	control: io.of("/control")
};

var gameState =
{
	WAITING: 0,
	READY: 1,
	STARTING: 2,
	RUNNING: 3,
	COMPLETED: 4
};

var game =
{
	state: gameState.WAITING,
	players: {},
	sequence: [],
	sequenceDuration: 0,
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
  lastSequenceDuration: 0,
	isConnected: false,
	userAgent: null
};

namespaces.player.on("connect", function (socket)
{	
  // TODO: look at event registration outside of connect operation

	socket.on("RegisterPlayer", function (id, callback)
	{
		if (id == null)
		{
      id = uuid();
		}

		callback(id);

		var player = clone(__player);
		player.id = id;
		player.socketId = socket.id;
		player.isConnected = true;
		player.userAgent = socket.handshake.headers["user-agent"];

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
			var player = clone(_player);

			player.socketId = socket.id;
			player.sequenceIndex = 0;
			player.isSequenceCompleted = false;
			player.lastSequenceDuration = 0;
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

	socket.on("ButtonDown", function (buttonId)
	{
		log(socket.id + "|" + buttonId);
		
		var player = game.players[socket.id];

		if (player) 
		{
			if (player.errors < 3)
			{
				switch (game.state)
				{
					case gameState.WAITING:
						namespaces.board.emit("ButtonDown",
						{
							playerNumber: player.number,
							buttonId: buttonId
						});
						break;

					case gameState.RUNNING:
						if (!player.isSequenceCompleted)
						{
							namespaces.board.emit("ButtonDown",
							{
								playerNumber: player.number,
								buttonId: buttonId
							});

							if (buttonId == game.sequence[player.sequenceIndex])
							{
								player.sequenceIndex += 1;
								if (player.sequenceIndex == game.sequence.length)
								{
									player.isSequenceCompleted = true;
									player.lastSequenceDuration = Date.now() - game.sequenceRunTimestamp;
								}
							}
							else
							{
								player.errors += 1;
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
		}
	});

	socket.on("disconnect", function ()
	{
    // TODO: release socket event handlers?

		if (game.players[socket.id] != undefined)
		{
			game.players[socket.id].isConnected = false;
		}
		updatePlayerToBoard(socket.id);
	});
});

namespaces.board.on("connect", function (socket)
{
	updatePlayersToBoard();
	socket.on("RunSequence", function () { runSequence(); });
});

namespaces.control.on("connect", function (socket)
{
	updateGameState();
	socket.on("StartGame", function () { startGame(); });
	socket.on("StartSequence", function () { startSequence(); });
	socket.on("ResetGame", function () { resetGame(); });
	socket.on("ShowDebug", function ()
	{
		log(io.eio);
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
		player.lastSequenceDuration = 0;
	}
	updatePlayersToBoard();
	game.sequence.push(Math.floor((Math.random() * 4) + 1));
	game.sequenceDuration = 2500 + (game.sequence.length * 500); 
	setGameState(gameState.STARTING);
	namespaces.board.emit("SequenceStarted", { sequence: game.sequence, sequenceDuration: game.sequenceDuration });
}

function runSequence()
{
	game.sequenceRunTimestamp = Date.now();
	setGameState(gameState.RUNNING);
	setTimeout(function () { completeSequence(); }, game.sequenceDuration);
}

function completeSequence()
{
	namespaces.board.emit("SequenceCompleted");
	
	var activePlayers = [];
	var sequenceWinner = null;
	
	for (var socketId in game.players)
	{
		var player = game.players[socketId];
		if (player.errors < 3) 
		{
			if (!player.isSequenceCompleted)
			{
				player.errors += 1;
				player.isSequenceCompleted = true;
				updatePlayer(player);
			}
		}
		if (player.errors < 3)
		{
			if (player.isSequenceCompleted && player.lastSequenceDuration > 0)
			{
				if (sequenceWinner == null || player.lastSequenceDuration < sequenceWinner.lastSequenceDuration)
				{
					sequenceWinner = player; 
				}
			}
			activePlayers.push(player);	
		}		
	}
	
	if (sequenceWinner != null && sequenceWinner.errors > 0) 
	{
		sequenceWinner.errors -= 1;
		updatePlayer(sequenceWinner);
	}
	
	updatePlayersToBoard();
	
	if (sequenceWinner != null) 
	{
		namespaces.board.emit("SequenceWon", sequenceWinner.number);
	}

	switch (activePlayers.length)
	{
		case 1:
			setGameState(gameState.COMPLETED);
			namespaces.board.emit("GameWon", activePlayers[0].number);
			break;
		case 0:
			setGameState(gameState.COMPLETED);
			break;
		default:
			setGameState(gameState.READY);
			break;
	}
}

function setGameState(gameState)
{
	game.state = gameState;
	updateGameState();
}

function updateGameState()
{
  Object.values(namespaces).forEach(function(namespace) {
    namespace.emit("GameStateUpdated", game.state);
  });
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
  const { id, number, errors, lastSequenceDuration } = player;
	namespaces.player.to(player.socketId).emit("PlayerUpdated", { id, number, errors, lastSequenceDuration });
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

function clone(obj) 
{
  return JSON.parse(JSON.stringify(obj));
}

module.exports.init = function(httpServer)
{
	io.attach(httpServer, { transports:["polling","websocket"] });
	log("Web application initialized");
}
