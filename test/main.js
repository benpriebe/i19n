require.config({
	paths: {
		"i19n": "../i19n"
	},

    config: {
    	i19n: {
        	locale: "en-au"
    	}
 	}
});

require([
	"i19n!strings"
],

function(strings) {
	var $strings = $("#strings");

	var showHeader = function(header) {
		$strings.append("<h2>" + header + "</h2>");
	};

	var enumerateStrings = function(container) {
		_.each(container, function(value, key) {
			if (typeof value === "string") {
				$strings.append(key + ": " + value + "<br />");

			} else {
				showHeader(key);
				enumerateStrings(value);
			}
		});
	};

	showHeader("Root");
	enumerateStrings(strings);
});