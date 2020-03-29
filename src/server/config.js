var config =
{
	httpServerPort: 80,
	webRootDirName: "app",
	defaultDocument: "player.htm",
	isCachingDisabled: false,
	isLogOutputEnabled: true,
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
