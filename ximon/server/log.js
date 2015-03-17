module.exports = function log(message)
{
	console.log("[" + new Date().toJSON() + "]", message);
};
