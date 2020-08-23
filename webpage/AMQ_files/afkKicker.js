'use strict';
/*exported afkKicker*/

function AfkKicker() {
	this.afkWarningTimeout;
	this.hostAfkWarningTimeout;

	this._AFK_TIMEOUT_TIME = 30 * 60 * 1000; //30 min, 1.800.000 ms
	this._HOST_AFK_TIMEOUT_TIME = 3 * 60 * 1000; //ms
}

AfkKicker.prototype.setup = function () {
	this.setupAfkTimeout();

	$('body')
		.click(() => {
			this.resetTimers();
		})
		.keypress(() => {
			this.resetTimers();
		});
};

AfkKicker.prototype.resetTimers = function () {
	clearTimeout(this.afkWarningTimeout);
	this.setupAfkTimeout();

	if (this.hostAfkWarningTimeout) {
		clearTimeout(this.hostAfkWarningTimeout);
		this.setupHostTimeout();
	}
};

AfkKicker.prototype.setupAfkTimeout = function () {
	this.afkWarningTimeout = setTimeout(() => {
		displayHtmlMessage("You have been detected as AFK", "You'll be logged out in <span id='afkLogoutWarningTime'>60</span> seconds", "Stay Online", function () {
			clearInterval(logoutInterval);
			//Next timeout setup by resetTimers
		}.bind(this));
		let $timeLeft = $("#afkLogoutWarningTime");
		let logoutInterval = setInterval(() => {
			let timeLeft = parseInt($timeLeft.text()) - 1;
			if (timeLeft <= 0) {
				window.location.href = './signout?reason=' + encodeURIComponent("Kicked Due to Inactivity");
			} else {
				$timeLeft.text(timeLeft);
			}
		}, 1000);

	}, this._AFK_TIMEOUT_TIME);
};

AfkKicker.prototype.setHostTimeout = function () {

};

AfkKicker.prototype.setupHostTimeout = function () {
	this.hostAfkWarningTimeout = setTimeout(() => {
		displayHtmlMessage("You have been detected as AFK", "You'll lost host status (and be changed to spectator, if you aren't already) in <span id='afkHostWarningTime'>10</span> seconds", "Stay Host", function () {
			clearInterval(removeHostInterval);
			//Next timeout setup by resetTimers
		}.bind(this));
		let $timeLeft = $("#afkHostWarningTime");
		let removeHostInterval = setInterval(() => {
			let timeLeft = parseInt($timeLeft.text()) - 1;
			if (timeLeft <= 0) {
				socket.sendCommand({
					type: "lobby",
					command: "host afk"
				});
				this.clearHostTimeout();
				clearInterval(removeHostInterval);
				swal.close();
			} else {
				$timeLeft.text(timeLeft);
			}
		}, 1000);

	}, this._HOST_AFK_TIMEOUT_TIME);
};

AfkKicker.prototype.clearHostTimeout = function () {
	clearTimeout(this.hostAfkWarningTimeout);
	this.hostAfkWarningTimeout = null;
};

AfkKicker.prototype.setInExpandLibrary = function (active) {
	if (active) {
		this._AFK_TIMEOUT_TIME = 120 * 60 * 1000;
	} else {
		this._AFK_TIMEOUT_TIME = 30 * 60 * 1000;
	}
	this.resetTimers();
};

let afkKicker = new AfkKicker();