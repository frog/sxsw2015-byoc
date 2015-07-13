var config =
{
	httpServerPort: 80,
	webRootDirName: "client",
	defaultDocument: "player.htm",
	isCachingDisabled: false,
	doBrowserLaunch: false,
	contentTypes: // TODO: add other MIME content type entries as needed for your specific web site or app
	{
		".htm": "text/html",
		".css": "text/css",
		".js": "text/javascript",
		".png": "image/png",
		".jpg": "image/jpg",
		".gif": "image/gif",
		".svg": "image/svg+xml",
		".json": "application/json",
		".ttf": "font/truetype",
		".otf": "font/opentype",
		".woff": "application/x-font-woff",
		".mp3": "audio/mpeg",
		".mp4": "video/mp4"
	}
};

module.exports = config;
