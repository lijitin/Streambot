'use strict';
/*exported AnimationController AnimationCanvasCenter AnimationElement*/

class AnimationController {
	constructor(staticAnimationCanvas, dynamicAnimationCanvas) {
		this.staticCanvas = staticAnimationCanvas;
		this.dynamicCanvas = dynamicAnimationCanvas;
	}

	updateCanvasSize() {
		this.staticCanvas.updateCanvasSize();
		this.dynamicCanvas.updateCanvasSize();
	}

	drawFrame(deltaTimeSeconds) {
		this.staticCanvas.redraw();
		this.dynamicCanvas.redraw(deltaTimeSeconds);
	}

	clearFrame() {
		this.staticCanvas.clearCanvas();
		this.dynamicCanvas.clearCanvas();
	}
}
