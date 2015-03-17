var control =
{
	io: null
};

var gameState =
{
	WAITING: 1,
	READY: 2,
	STARTING: 3,
	RUNNING: 4,
	COMPLETED: 5
};

control.init = function ()
{
	control.io = io("/control");

	control.io.on("connect", function ()
	{	
	});

	control.io.on("GameStateUpdated", function (state)
	{
		$("#gameState").html(Object.keys(gameState)[state - 1]);
		$("#startgame").toggleClass("disabled", (state != gameState.WAITING));
		$("#startsequence").toggleClass("disabled", (state != gameState.READY));
	});

	$("#startgame").on("click", function ()
	{
		control.io.emit("StartGame", null);
	});

	$("#startsequence").on("click", function ()
	{
		control.io.emit("StartSequence", null);
	});

	$("#resetgame").on("click", function ()
	{
		control.io.emit("ResetGame", null);
	});

	$("#showdebug").on("click", function ()
	{
		control.io.emit("ShowDebug", null);
	});
};
