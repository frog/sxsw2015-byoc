var config =
{
	httpServerPort: 80,
	webRootDirName: "client",
	defaultDocument: "player.html",
	isCachingDisabled: false,
	isLogOutputEnabled: true,
	doBrowserLaunch: false,
	contentTypes:
	{
		".html": "text/html",
		".css": "text/css",
		".js": "text/javascript",
		".svg": "image/svg+xml",
		".json": "application/json",
		".mp3": "audio/mpeg",
	}
};

module.exports = config;
