function Switch($switch) {
	this.$switch = $switch;
	this._on = false;

	this.$switch.click(() => {
		this.setOn(!this._on);
	});

	this._listeners = [];
}

Switch.prototype.setOn = function (on) {
	this._on = on;

	if (on) {
		this.$switch.addClass("active");
	} else {
		this.$switch.removeClass("active");
	}

	this._listeners.forEach((listener => {
		listener(on);
	}));
};

Switch.prototype.addListener = function (listener) {
	this._listeners.push(listener);
};

Switch.prototype.addContainerToggle = function ($onContainer, $offContainer) {
	this.addListener(on => {
		if (on) {
			$offContainer.addClass('hidden');
			$onContainer.removeClass('hidden');
		} else {
			$onContainer.addClass('hidden');
			$offContainer.removeClass('hidden');
		}
	});
};

Switch.prototype.getOn = function () {
	return this._on;
};