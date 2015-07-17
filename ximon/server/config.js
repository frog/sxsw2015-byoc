var config =
{
	httpServerPort: 80,
	webRootDirName: "client",
	defaultDocument: "player.htm",
	isCachingDisabled: false,
	isLogOutputEnabled: false,
	doBrowserLaunch: false,
	contentTypes:
	{
		".htm": "text/html",
		".css": "text/css",
		".js": "text/javascript",
		".svg": "image/svg+xml",
		".json": "application/json",
		".mp3": "audio/mpeg",
	}
};

module.exports = config;
