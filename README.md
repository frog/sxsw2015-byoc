"Ximon"
====================

An group interactive game prototype and demonstration as part of "BYOC" With a Pocket Full Of WebSockets workshop at SXSW Interactive 2015.
http://schedule.sxsw.com/2015/events/event_IAP36424

Uses Packaged Node Web Server
https://github.com/frog/packaged-node-web-server

# How To Use & Play

* Setup a dedicated and private Wi-Fi network within a dedicated space for multiple users with mobile devices (iOS, Android 4.1.1+, Windows Phone 8)
* A host computer for the game should attached to the network via ethernet if possible and assigned a static IP address ideally
* The host computer should be connected to a large display at 1080p for the environment with audio outputs (HDMI ideally)
* Edit the ximon/client/board.htm file and add the Wi-Fi network SSID and the URL for the host computer by name (if local DNS is used) or by IP address
* Use the node launcher script appropriate for the host computer platform (Windows, Mac OS X, Linux)
* To allow web traffic to the host computer, local firewall or iptables rules may need to be configured. Additionally, the node launcher may need to be run as administrator or sudo (per the platform).
* Once node has launched and the web server for the game is running, these endpoints become active for the game environment:
	* Player - / (loads player.htm by default config) - this is Ximon game player for the users via their mobile devices connected to the Wi-Fi network
	
	* Board - /board.htm - this is the Ximon game display board to project in the environment. It provides the visual and audio cues for the game sequence along with the player results. Note: the HTML/CSS layout for the board is optimize for up to 60 active players in the game. Should there be more than 60, the trick is to zoom the web browser out to 90% or 75% to allow more active players to be visible in the display.
	
	* Control - /control.htm - this is the Ximon game controller for the person acting as the host. Game start, reset, and sequence starts commands are available. Once players have joined the game, the controller starts the game and then manually starts each sequence as desired.

