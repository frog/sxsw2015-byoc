var player =
{
	io: null,
	id: null,
	game:
	{
		number: 0,
		errors: 0,
		state: 0
	}
};

var gameState =
{
	WAITING: 1,
	READY: 2,
	STARTING: 3,
	RUNNING: 4,
	COMPLETED: 5
};

player.init = function ()
{
	player.io = window.io("/player");

	player.io.on("connect", function ()
	{
		player.register();
	});

	player.io.on("PlayerUpdated", function (_player)
	{
		player.game.number = _player.number;
		player.game.errors = _player.errors;

		player.update();

		if (_player.stats.lastSequenceDuration > 0)
		{
			$("button").attr("disabled", true);
			setTimeout(function ()
			{
				$(".button").toggleClass("active", true);
				$(".button").velocity({ rotateZ: "360deg" }).velocity("reverse");
			}, 500);
		}
	});

	player.io.on("GameStateUpdated", function (gameState)
	{
		player.game.state = gameState;
		player.update();
	});

	player.io.on("GameReset", function ()
	{
		player.register();
	});

	$(".button").on("touchstart touchend pointerdown pointerup mousedown mouseup", function (e)
	{
		e.preventDefault();
		var button = $(this);
		switch (e.type)
		{
			case "touchstart":
			case "pointerdown":
			case "mousedown":
				var buttonId = parseInt(button.data("id"));
				button.toggleClass("active", true);
				if (e.type == "pointerdown")
				{
					e.target.setPointerCapture(e.originalEvent.pointerId);
				}
				player.io.emit("ButtonPressed", buttonId);
				break;
			default:
				button.toggleClass("active", false);
				break;
		}
	});

	$("main").on("touchmove pointermove mousemove", function (e)
	{
		e.preventDefault();
	});
};

player.register = function ()
{
	player.id = (localStorage.length > 0) ? localStorage.getItem("id") : cookieStorage.getItem("id");

	player.io.emit("RegisterPlayer", player.id, function (id)
	{
		player.id = id;
		try 
		{
			localStorage.setItem("id", id);
		}
		catch (e)
		{
			cookieStorage.setItem("id", id, Infinity, "/", "byoc.sxsw", false);
		}
	});
};

player.update = function ()
{
	if (player.game.number > 0)
	{
		$("#player .number").html(player.game.number);

		$("#player").toggleClass("disabled", false);
		$(".button").toggleClass("active", false);

		var isEnabled = (player.game.errors < 3 && (player.game.state == gameState.WAITING || player.game.state == gameState.RUNNING));

		$("#player .buttons").toggleClass("disabled", !isEnabled);
		$("button").attr("disabled", !isEnabled);
		
		$("#player .errors .icon").each(function (index)
		{
			$(this).toggleClass("enabled", (index < player.game.errors));
		});
	}
	else
	{
		$("#player").toggleClass("disabled", true);
		$("button").attr("disabled", true);	
	}
};

