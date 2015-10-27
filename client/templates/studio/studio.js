var canvas, context, dragging;

Template.studio.rendered = function() {
	canvas = $("#studioCanvas");
	context = canvas[0].getContext("2d");
	addQuestionMark();
}

var addQuestionMark = function() {
	var svgQuestionMark = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjbGFzcz0ibG9nbyI+DQogPGc+DQogIDx0aXRsZT5MYXllciAxPC90aXRsZT4NCiAgPHBhdGggZmlsbD0iI0ZGRiIgaWQ9InN2Z18yIiBkPSJtMzI5LjA5NjAwOCwxNDIuMjgxOTk4YzAsNDAuMTkzMDA4IC04Ljk1NDAxLDY5LjI2MyAtMjYuMzI0MDA1LDkwLjQ0MDAwMmMtMTUuMzA5OTk4LDE4LjY2MDAwNCAtMzQuODM1OTk5LDI4LjUzOTk5MyAtNTMuNTc1OTg5LDM3Ljg3OTk5Yy0yOC4yNTM5OTgsMTQuMDgyMDAxIC00Ny43MTI5OTcsMjUuNTc2MDE5IC00Ny43MTI5OTcsNTcuNzIwMDAxbDAsNS44ODhsLTExLjc3MzAxLDBsMCwtNS44ODY5OTNjMCwtNDEuMzgwMDA1IDI2LjAwMzAwNiwtNTQuMTkwMDAyIDU0LjIzNDAwOSwtNjguMjU3OTk2YzE3LjgwNTAwOCwtOC44Njk5OTUgMzYuMTUwMDA5LC0xOC40NTUwMDIgNTAuMDQyOTg0LC0zNS43NTE5OTljMTMuODkzMDA1LC0xNy4yOTY5OTcgMjMuMzM1MDIyLC00Mi4zMDcwMDcgMjMuMzM1MDIyLC04Mi4wMjk5OTljMCwtMjkuOTQwMDAyIC05LjQ2NjAwMywtNTMuMDY4MDA4IC0yNy4yMzMwMDIsLTY5LjI1ODAwM2MtMjAuNTE4MDA1LC0xOC42OTQgLTUyLjEwMzAxMiwtMjguMTM4IC05Mi45NjQwMDUsLTI4LjEzOGMtMzguMTkyMDAxLDAgLTczLjYyMzAwOSwyMC4zMDk5OTggLTk3LjI2MjAwOSw1NC41NDY5OTdsLTMuMzQ1OTkzLDQuODQ0MDAybC05LjY4ODAwNCwtNi42OTAwMDJsMy4zNDQwMDIsLTQuODQyOTk1YzI2LjQxMTk5NSwtMzguMjUwMDA0IDY1LjM3Mjk5MywtNTkuNjMwMDAxIDEwNi45NTAwMDUsLTU5LjYzMDAwMWM0Ni4yODM5OTcsMCA3OC44Mjk5ODcsMTAuMDYxOTk2IDEwMC43MzU5OTIsMzAuNjZjMTkuNzQzOTg4LDE4LjU1OTk5OCAzMS4yMzUwMTYsNDUuNzMzMDAyIDMxLjIzNTk5Miw3OC41MDY5OTZsMC4wMDEwMDcsMHptLTExOC44MTQwMTEsMjIyLjI5NjAwNWMwLDguOTk2MDAyIC00Ljk0OTk5NywxNC40MjE5OTcgLTEzLjQyMzAwNCwxNC40MjE5OTdjLTcuNzM3OTkxLDAgLTEzLjA4OTk5NiwtNS40NzI5OTIgLTEzLjA4OTk5NiwtMTQuNDIxOTk3YzAsLTkuMTEwMDE2IDUuNDg2MDA4LC0xNC40MjQwMTEgMTMuNDIxOTk3LC0xNC40MjQwMTFjNy44MzUwMDcsMCAxMy4wOTAwMTIsNS4xNjQwMDEgMTMuMDkwMDEyLDE0LjQyNDAxMWwwLjAwMDk5MiwweiIgc3Ryb2tlLXdpZHRoPSIzIi8+DQogIDxwYXRoIGZpbGw9IiNGRkYiIGlkPSJzdmdfNCIgZD0ibTc0LjMwMDAwMywxNTIuMDI5OTk5YzAsLTMyLjc3NDAwMiAxMS40ODk5OTgsLTU5Ljk0NTk5OSAzMS4yMzI5OTQsLTc4LjUxMDAwMmw3Ljc3MjAwMyw5LjI1MjAwN2MtMTcuNzY2OTk4LDE2LjE4OTk5NSAtMjcuMjMzMDAyLDM5LjMxNzk5MyAtMjcuMjMzMDAyLDY5LjI1Nzk5NiIgc3Ryb2tlLXdpZHRoPSIzIi8+DQogPC9nPg0KPC9zdmc+';
	var questionMark = new Image();
	questionMark.src = svgQuestionMark;
	questionMark.onload = function() {
		context.drawImage(questionMark, 0, 0, context.canvas.width, context.canvas.height);
	}
};

var getPageCoords = function(e) {
	return {
		x: e.pageX || e.originalEvent.changedTouches[0].pageX,
		y: e.pageY || e.originalEvent.changedTouches[0].pageY
	};
};

Template.studio.events({
    'mousedown #studioCanvas, touchstart #studioCanvas': function(e){
		context.strokeStyle = "#FFF";
		context.lineJoin = "round";
		context.lineWidth = 5;
		context.beginPath();
		var offset = canvas.offset();
		var pageCoords = getPageCoords(e);
		context.moveTo(pageCoords.x - offset.left, pageCoords.y - offset.top);
		dragging = true;
    },
    'mousemove #studioCanvas': function(e){
		if (dragging) {
			var offset = canvas.offset();
			var pageCoords = getPageCoords(e);
			context.lineTo(pageCoords.x - offset.left, pageCoords.y - offset.top);
			context.stroke();
		}
    },
    'touchmove #studioCanvas': function(e){
        e.preventDefault();
        if (dragging) {
            var offset = canvas.offset();
            var pageCoords = getPageCoords(e);
            context.lineTo(pageCoords.x - offset.left, pageCoords.y - offset.top);
            context.stroke();
        }
    },
    'mouseup #studioCanvas': function(e){
		if (dragging) {
			var offset = canvas.offset();
			var pageCoords = getPageCoords(e);
			context.lineTo(pageCoords.x - offset.left, pageCoords.y - offset.top);
			context.stroke();
			dragging = false;
		}
    },
    'click .clear-avatar': function(e){
  		context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  		addQuestionMark();
    },
    'click .select-avatar': function(e){
    	var dataUrl = canvas[0].toDataURL();
    	Meteor.call("createAvatar", dataUrl);
    	Router.go('/');
    }
});

