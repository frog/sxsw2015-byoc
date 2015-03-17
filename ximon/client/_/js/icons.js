(function ()
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/_/img/icons.svg", false);
	xhr.send();
	document.body.insertBefore(xhr.responseXML.firstChild, document.body.firstChild);
}());

(function($)
{
	var _fn = $.fn.toggleClass;
	$.fn.toggleClass = function (name, state)
	{
		if (this[0].className instanceof SVGAnimatedString)
		{
			var e = this[0];
			var classes = e.className.baseVal.split(" ");
			var pos = classes.indexOf(name);
			if (state)
			{
				if (pos == -1)
				{
					classes.push(name);
				}
			}
			else
			{
				if (pos != -1)
				{
					classes.splice(pos, 1);
				}
			}
			e.className.baseVal = classes.join(" ");
		}
		else
		{
			return _fn.apply(this, arguments);
		}
	};
})(jQuery);
