var board =
{
	io: null,
	playerTemplate: null
};

var gameState =
{
	WAITING: 1,
	READY: 2,
	STARTING: 3,
	RUNNING: 4,
	COMPLETED: 5
};

var sounds =
[
  new Howl({ src: ["/_/sounds/1.mp3"] }),
  new Howl({ src: ["/_/sounds/2.mp3"] }),
  new Howl({ src: ["/_/sounds/3.mp3"] }),
  new Howl({ src: ["/_/sounds/4.mp3"] }),
  new Howl({ src: ["/_/sounds/5.mp3"] })
];

board.init = function ()
{	
	board.playerTemplate = $("#players .template").clone().toggleClass("template", false);
	$("#players .template").remove();

	board.io = window.io("/board");

	board.io.on("connect", function () {});

	board.io.on("PlayersUpdated", function (players)
	{
		var keys = new Array(Object.keys(players).length);
		for (var id in players)
		{
			keys[players[id].number - 1] = id;
		}
		for (var i = 0, ic = keys.length; i < ic; i += 1)
		{
			board.updatePlayer(players[keys[i]]);
		}
	});

	board.io.on("PlayerUpdated", function (_player)
	{
		board.updatePlayer(_player);
	});

	board.updatePlayer = function (_player)
	{
		var player = $(".player:nth-child(" + _player.number + ")");

		if (player.length == 0)
		{
			player = board.playerTemplate.clone();
			player.appendTo("#players");			
			player.find(".number").html(_player.number);
			player.velocity({ translateY: 100 }, { duration: 0 }).velocity({ translateY: 0 }, { duration: 750, easing: "spring" });
		}
		player.find(".errors .icon").each(function (index)
		{
			$(this).toggleClass("enabled", (index < _player.errors));
		});
		player.find(".stats").html(_player.stats.lastSequenceDuration / 1000 + "s");
		player.find(".stats").toggleClass("success", (_player.stats.lastSequenceDuration > 0));
		player.toggleClass("disabled", _player.errors == 3);
		player.toggleClass("disconnected", !_player.isConnected);

		var device = "html5";
		var devices = ["Windows Phone", "Android", "iPhone"];
		for (var i = 0, ic = devices.length; i < ic; i += 1)
		{	
			if (new RegExp(devices[i]).test(_player.userAgent))
			{
				switch (devices[i])
				{
					case "Windows Phone":
						device = "windows";
						break;
					case "Android":
						device = "android";
						break;	
					case "iPhone":
						device = "ios";
						break;
					default:
						break;
				}
				break;
			}
		}
		player.find(".device .icon").find("use").attr("xlink:href", "#icon-device-" + device);
	};

	board.io.on("ButtonPressed", function (args) 
	{
		var button = $(".player:nth-child(" + (args.playerNumber) + ") > .buttons > .button:nth-child(" + args.buttonId + ")");
		button.toggleClass("active", true);
		setTimeout(function () { button.toggleClass("active", false); }, 100);
	});

	board.io.on("SequenceStarted", function (game)
	{
		$("#watermark").toggleClass("hidden", true);
		$("#winner").toggleClass("hidden", true);
		$("#sequence").toggleClass("hidden", false);
		$("#sequence .count").html(game.sequence.length);
		$(".player").find(".stats").velocity("stop", true).velocity({ opacity: 1 });
		setTimeout(function ()
		{
			var accel = game.sequence.length;
			var sequenceInterval = setInterval(function ()
			{
				if (game.sequence.length == 0)
				{
					clearInterval(sequenceInterval);
					setTimeout(function () 
					{ 
						board.io.emit("RunSequence");
						$("#sequence").toggleClass("hidden", true);
						$("#countdown").velocity({ translateX: [0, 0] }).velocity({ translateX: "-=100%" }, { duration: game.sequenceDuration - 500, easing: "linear" });
					}, 750);
					return;
				}
				var id = game.sequence.shift();
				sounds[id - 1].play();
				var button = $("#sequence .button:nth-child(" + id + ")");
				button.toggleClass("active", true);
				setTimeout(function () { button.toggleClass("active", false); }, 300 - (accel * 3));
			}, 450 - (accel * 6));
		}, 750);
	});

	board.io.on("SequenceCompleted", function ()
	{
		$("#sequence .count").html("");
		$("#sequence").toggleClass("hidden", false);
		$("#sequence .button").toggleClass("active", true);
		$("#sequence .button").velocity({ rotateZ: "360deg" }).velocity("reverse");
		sounds[4].play();
		setTimeout(function ()
		{
			$("#sequence").toggleClass("hidden", true);
			$("#sequence .button").toggleClass("active", false);
		}, 1000);
	});
	
	board.io.on("SequenceWon", function (playerNumber)
	{
		$(".player:nth-child(" + playerNumber + ")").find(".stats").velocity({ opacity: .2 }, { loop: true });
	});
	
	board.io.on("GameWon", function (playerNumber)
	{
		$("#winner .number").html(playerNumber);
		$("#winner").toggleClass("hidden", false);
	});

	board.io.on("GameReset", function ()
	{
		$("#players").empty();
		$("#watermark").toggleClass("hidden", false);
		$("#winner").toggleClass("hidden", true);
	});
};
