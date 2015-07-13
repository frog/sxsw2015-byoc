var soundJs = window.createjs.Sound;

var board =
{
	io: null,
	playerTemplate: null,
	sounds: []
};

board.init = function ()
{	
	board.playerTemplate = $("#players .template").clone().toggleClass("template", false);
	$("#players .template").remove();
	
	soundJs.registerSounds(
		[
			{src: "1.mp3", id: "1"},
			{src: "2.mp3", id: "2"},
			{src: "3.mp3", id: "3"},
			{src: "4.mp3", id: "4"}
		],
		"/_/sounds/"
	);

	board.io = window.io("/board");

	board.io.on("connect", function () {});

	board.io.on("PlayersUpdated", function (players)
	{
		var keys = new Array(Object.keys(players).length);

		for (var id in players)
		{
			keys[players[id].number - 1] = id;
		}

		for (var i = 0, ic = keys.length; i < ic; i++)
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
		player.find(".stats").html(_player.stats.lastSequenceDuration + "s");
		player.find(".stats").toggleClass("success", (_player.stats.lastSequenceDuration > 0));
		player.toggleClass("disabled", _player.errors == 3);
		player.toggleClass("disconnected", !_player.isConnected);
	};

	board.io.on("ButtonPressed", function (args)
	{
		var button = $(".player:nth-child(" + (args.playerNumber) + ") > .buttons > .button:nth-child(" + args.buttonId + ")");
		button.toggleClass("active", true);
		setTimeout(function () { button.toggleClass("active", false); }, 100);
	});

	board.io.on("SequenceStarted", function (sequence)
	{
		$("#watermark").toggleClass("hidden", true);
		$("#winner").toggleClass("hidden", true);
		$("#sequence").toggleClass("hidden", false);
		$("#sequence .count").html(sequence.length);
		setTimeout(function ()
		{
			var accel = sequence.length;
			var intId = setInterval(function ()
			{
				if (sequence.length == 0)
				{
					clearInterval(intId);
					board.io.emit("RunSequence");
					setTimeout(function () { $("#sequence").toggleClass("hidden", true); }, 750);
					return;
				}
				var id = sequence.shift();
				soundJs.play(id);
				var button = $("#sequence .button:nth-child(" + id + ")");
				button.toggleClass("active", true);
				setTimeout(function () { button.toggleClass("active", false); }, 300 - (accel * 3));
			}, 450 - (accel * 6));
		}, 750);
	});

	board.io.on("SequenceCompleted", function (activePlayers)
	{
		$("#sequence .count").html("");
		$("#sequence").toggleClass("hidden", false);
		$("#sequence .button").toggleClass("active", true);
		$("#sequence .button").velocity({ rotateZ: "360deg" }).velocity("reverse");
		soundJs.play(1);
		soundJs.play(2);
		soundJs.play(3);
		soundJs.play(4);
		setTimeout(function ()
		{
			$("#sequence").toggleClass("hidden", true);
			$("#sequence .button").toggleClass("active", false);
			if (activePlayers.length == 1)
			{
				$("#winner .number").html(activePlayers[0]);
				$("#winner").toggleClass("hidden", false);
			}
		}, 1000);
	});

	board.io.on("GameReset", function ()
	{
		$("#players").empty();
		$("#watermark").toggleClass("hidden", false);
		$("#winner").toggleClass("hidden", true);
	});
};
