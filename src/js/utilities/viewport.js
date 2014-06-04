define([], function () {

    function Viewport() {

        if (!(this instanceof Viewport)) {
            throw new TypeError("Viewport constructor cannot be called as a function.");
        }
    }

	Viewport.getSize = function()
	{
		var width  = Math.max(document.documentElement.clientWidth, window.innerWidth   || 0);
		var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		return {'width':width, 'height': height};
	}

	return Viewport;
});