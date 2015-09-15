#"Ximon"

An group interactive game prototype and demonstration as part of "BYOC" With a Pocket Full Of WebSockets workshop at SXSW Interactive 2015.

http://schedule.sxsw.com/2015/events/event_IAP36424

Adapted From Packaged Node Web Server

https://github.com/frog/packaged-node-web-server

# Getting Started

* Requires node, npm, and bower to be installed globally 
* From the server directory, run "npm install"
* From the client/_/js/lib directory, run "npm install" and "bower install"
* From the server directory, run "node server.js"

# How To Use & Play

* Setup a dedicated and private Wi-Fi network within a collective space for multiple users with mobile devices (iOS, Android 4.1.1+, Windows Phone 8). Using a Netgear "Nighthawk" R7000 router and EX7000 extender/AP, this software has successfully run with up to 95 active users on mobile devices.
* A host computer for the game should be attached to the network via ethernet directly into the Wi-Fi router if possible and ideally assigned a static IP address
* The host computer should be connected to a large display or projection visible to all users at 1080p for the environment along with audio speakers with enough volume to broadcast game sequence sound effects
* Edit the ximon/client/board.htm file and add the current Wi-Fi network SSID and URL for the host computer by name (if local DNS is used) or by IP address in the appropriate sections of the HTML markup
* To allow web traffic to the host computer, local firewall or iptables rules may need to be configured. Additionally, the node launcher may need to be run as administrator or with sudo (per the host platform).
* Once node has launched and the web server for the game is running (see Getting Started above), these endpoints become active for the game environment:
	* Player - / (loads player.htm by default config) - the Ximon game player for the users via their mobile devices connected to the Wi-Fi network using a responsive web UI. In similar fashion to playing the original game, the player buttons are disabled while the board is presenting each sequence so users must wait until the sequence completes and their device UI becomes enabled before starting to replay it.
	
	* Board - /board.htm - the Ximon game display board to project for users in the environment. F11/full screen is recommended for game play. It provides the visual and audio cues for the game sequence along with the player results. Note: the HTML/CSS layout for the board is optimized for up to 60 active players in the game. Should there be more than 60, the easy option is to zoom the web browser out to 90% or 75% as needed to allow more active players to be visible in the display.
	
	* Control - /control.htm - the Ximon game controller for the person acting as the host. Game start, reset, and sequence start commands are available. Once players have had a chance to access the Wi-Fi network and join the game, the host starts the game and then manually starts each sequence as desired. The game flow continues until one player remains active and is declared the winner on the board UI.

