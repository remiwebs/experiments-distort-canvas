define([], function () {

    function Utilities() {

        if (!(this instanceof Context)) {
            throw new TypeError("Context constructor cannot be called as a function.");
        }
    }

	Context.randomColor = function()
	{
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}



	return Context;
});