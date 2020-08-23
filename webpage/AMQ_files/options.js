/*exported options*/
"use strict";

function Options() {
	this.menuItem = $("#menuBarOptionContainer");
	this.optionMenuContainer = $("#optionsContainer");

	this._$blockedPlayerModalContent = $("#blockedPlayerModal .modal-body");
	this._$blockedPlayerModal = $("#blockedPlayerModal");
	this._$blockedPlayerTable = $("#blockedPlayerModal table");

	this._blockedPlayerTemplate = $("#blockedPlayerEntryTemplate").html();

	this.$CPM_CURRENT_PASSWORD = $("#cpmCurrentPassword");
	this.$CPM_NEW_PASSWORD = $("#cpmNewPassword");
	this.$CPM_REPEAT_PASSWORD = $("#cpmRepeatPassword");
	this.$CPM_MESSAGE_CONTAINER = $("#cpmMessageContainer");

	this.$MAl_SHARE_CHECKBOX = $("#malShareEntriesCheckbox");
	this.$SHARE_SCORE_CHECKBOX = $("#shareScoreCheckbox");
	this.$SHARE_SCORE_CONTAINER = $("#shareScoreContainer");
	this.$AUTO_SUBMIT_CHECKBOX = $("#smAutoSubmit");
	this.$AUTO_VOTE_GUESS = $("#smAutoSkipGuess");
	this.$AUTO_VOTE_REPLAY = $("#smAutoSkipReplay");
	this.$DISABLE_EMOJIS = $("#smDisableEmojis");

	this.$INCLUDE_WATCHING_CHECKBOX = $("#includeWatchingCheckbox");
	this.$INCLUDE_COMPLETED_CHECKBOX = $("#includeCompletedCheckbox");
	this.$INCLUDE_ON_HOLD_CHECKBOX = $("#includeOnHoldCheckbox");
	this.$INCLUDE_DROPPED_CHECKBOX = $("#includeDroppedCheckbox");
	this.$INCLUDE_PLANNING_CHECKBOX = $("#includePlanningCheckbox");

	this.$DISABLE_FLOATING_TEXT = $("#smDisableFloatText");
	this.DEFAULT_FLOATING_TEXT = false;
	this.disableFloatingText;

	this.$PARTICLE_SLIDER = $("#smParticle");
	this.DEFAULT_PARTICLE_QUALITY = 2;
	this.particleQuality;

	this.$HOST_PRIOTISE_SLIDER = $("#smHostPriorise");
	this.HOST_PRIO = {
		RESOLUTION: 0,
		HOST: 1
	};
	this.DEFAULT_HOST_PRIORITY = this.HOST_PRIO.RESOLUTION;

	this.$LIST_NAME_INPUTS = {
		1: $("#aniListUserNameInput"),
		2: $("#kitsuUserNameInput"),
		3: $("#malUserNameInput")
	};

	this.autoSubmit;
	this.autoVoteSkipGuess;
	this.autoVoteSkipReplay;
	this.disableEmojis;
	this.useRomajiNames;
	

	this.$SHOW_NAME_SLIDER = $("#smShowName");

	this.$SETTING_TABS = $("#settingModal .tab");
	this.$SETTING_CONTAINERS = $(".settingContentContainer");

	$("#changePasswordModal").on('show.bs.modal', () => {
		this.$CPM_CURRENT_PASSWORD.val("");
		this.$CPM_NEW_PASSWORD.val("");
		this.$CPM_REPEAT_PASSWORD.val("");
		this.$CPM_MESSAGE_CONTAINER.addClass("hidden");
	});

	$("#settingModal").on('shown.bs.modal', () => {
		this.$PARTICLE_SLIDER.slider('relayout');
		this.$SHOW_NAME_SLIDER.slider('relayout');
		this.$HOST_PRIOTISE_SLIDER.slider('relayout');
	});

	this.timeoutTime = 500;
	this.lastHoverTimeout = null;
	this._SERVER_STATUS_TABLE; //Set in setup

	this._malLastUpdateListener = new Listener("malLastUpdate update", function (newDate) {
		this.setMalLastUpdate(newDate);
	}.bind(this));

	this._aniListLastUpdateListener = new Listener("aniListLastUpdate update", (dateString) => {
		this.setAniListLastUpdate(dateString);
	});

	this._kitsuLastUpdateListener = new Listener("kitsuLastUpdate update", (dateString) => {
		this.setKitsuLastUpdate(dateString);
	});
}

Options.prototype.setup = function (malName, malLastUpdate, settings, aniListName, aniListLastUpdate, kitsuName, kitsuLastUpdate, useRomajiNames, serverStatuses, hostNames) {
	createHoverFunction(this.menuItem, this.hoverHandler.bind(this));
	createHoverFunction(this.optionMenuContainer, this.hoverHandler.bind(this));

	$("#malUserNameInput").val(malName);
	this.setMalLastUpdate(malLastUpdate);

	$("#aniListUserNameInput").val(aniListName);
	this.setAniListLastUpdate(aniListLastUpdate);

	$("#kitsuUserNameInput").val(kitsuName);
	this.setKitsuLastUpdate(kitsuLastUpdate);

	this.autoSubmit = settings.autoSubmit;
	this.autoVoteSkipGuess = settings.voteSkipGuess;
	this.autoVoteSkipReplay = settings.voteSkipReplay;
	this.disableEmojis = settings.disableEmojis;
	this.useRomajiNames = useRomajiNames;

	this.$MAl_SHARE_CHECKBOX.prop('checked', settings.shareMal);
	if(!settings.shareMal) {
		this.$SHARE_SCORE_CONTAINER.addClass('disabled');
	}
	this.$SHARE_SCORE_CHECKBOX.prop('checked', settings.shareScore);

	this.$AUTO_SUBMIT_CHECKBOX.prop('checked', this.autoSubmit);
	this.$AUTO_VOTE_GUESS.prop('checked', this.autoVoteSkipGuess);
	this.$AUTO_VOTE_REPLAY.prop('checked', this.autoVoteSkipReplay);
	this.$DISABLE_EMOJIS.prop('checked', this.disableEmojis);

	this.$INCLUDE_WATCHING_CHECKBOX.prop('checked', settings.useWatched);
	this.$INCLUDE_COMPLETED_CHECKBOX.prop('checked', settings.useCompleted);
	this.$INCLUDE_ON_HOLD_CHECKBOX.prop('checked', settings.useOnHold);
	this.$INCLUDE_DROPPED_CHECKBOX.prop('checked', settings.useDropped);
	this.$INCLUDE_PLANNING_CHECKBOX.prop('checked', settings.usePlanning);

	setOneCheckBoxAlwaysOn([
		this.$INCLUDE_WATCHING_CHECKBOX,
		this.$INCLUDE_COMPLETED_CHECKBOX,
		this.$INCLUDE_ON_HOLD_CHECKBOX,
		this.$INCLUDE_DROPPED_CHECKBOX,
		this.$INCLUDE_PLANNING_CHECKBOX
	], "One List Type Must be Selected");

	this._$blockedPlayerModalContent.perfectScrollbar({
		suppressScrollX: true
	});
	this._$blockedPlayerModal.on('shown.bs.modal', () => {
		this._$blockedPlayerModalContent.perfectScrollbar('update');
	});
	this._$blockedPlayerModal.on('show.bs.modal', () => {
		this._$blockedPlayerTable.html("");
		socialTab.blockedPlayers.sort();
		socialTab.blockedPlayers.forEach(playerName => {
			this._$blockedPlayerTable.append(format(this._blockedPlayerTemplate, playerName));
		});
	});

	let disableFloatingText = Cookies.get('disable_floating_text');
	if(disableFloatingText) {
		this.disableFloatingText = disableFloatingText === "true";
	} else {
		this.disableFloatingText = this.DEFAULT_FLOATING_TEXT;
	}
	this.$DISABLE_FLOATING_TEXT.prop('checked', this.disableFloatingText);

	let particleQuality = Cookies.get('particle_quality');
	if (particleQuality !== undefined) {
		particleQuality = parseInt(particleQuality);
	} else {
		particleQuality = this.DEFAULT_PARTICLE_QUALITY;
	}
	this.setParticleQuality(particleQuality);

	this.$PARTICLE_SLIDER.slider({
		ticks: [0, 1, 2],
		ticks_labels: ["Off", "Low", "High"],
		ticks_snap_bounds: 1,
		value: this.particleQuality,
		selection: 'none',
		formatter: function (value) {
			switch (value) {
				case 0: return "Off";
				case 1: return "Low";
				case 2: return "High";
				default: return "Unknown";
			}
		}
	});

	this.$PARTICLE_SLIDER.on('change', (changeEvent) => {
		this.setParticleQuality(changeEvent.value.newValue);
	});


	let hostPriority = Cookies.get('hostPrio');
	if (hostPriority !== undefined) {
		hostPriority = parseInt(hostPriority);
	} else {
		hostPriority = this.DEFAULT_HOST_PRIORITY;
	}

	this.$HOST_PRIOTISE_SLIDER.slider({
		ticks: [this.HOST_PRIO.RESOLUTION, this.HOST_PRIO.HOST],
		ticks_labels: ["Resolution", "Host"],
		ticks_snap_bounds: 1,
		value: hostPriority,
		selection: 'none',
		formatter: function (value) {
			switch (value) {
				case 0: return "Resolution";
				case 1: return "Host";
				default: return "Unknown";
			}
		}
	});
	this.$HOST_PRIOTISE_SLIDER.on('change', (changeEvent) => {
		Cookies.set('hostPrio', changeEvent.value.newValue, { expires: 365 });
	});

	this.$SHOW_NAME_SLIDER.slider({
		ticks: [0, 1],
		ticks_labels: ["English", "Romaji"],
		ticks_snap_bounds: 1,
		value: this.useRomajiNames,
		selection: 'none',
		formatter: function (value) {
			switch (value) {
				case 0: return "English";
				case 1: return "Romaji";
				default: return "Unknown";
			}
		}
	});

	this.$SHOW_NAME_SLIDER.on('change', (changeEvent) => {
		this.setUseRomajiNames(changeEvent.value.newValue);
	});

	this._SERVER_STATUS_TABLE = new ServerStatusTable(serverStatuses);
	this._HOST_PRIO_LIST = new HostPrioList(hostNames);

	this._malLastUpdateListener.bindListener();
	this._aniListLastUpdateListener.bindListener();
	this._kitsuLastUpdateListener.bindListener();
};

Options.prototype.setMalLastUpdate = function (date) {
	if(date) {
		$("#malLastUpdateDate").text(date.replace(/T.*/, ''));
	} else {
		$("#malLastUpdateDate").text("");
	}
};

Options.prototype.setAniListLastUpdate = function (date) {
	if (date) {
		$("#aniListLastUpdateDate").text(date.replace(/T.*/, ''));
	} else {
		$("#aniListLastUpdateDate").text("");
	}
};

Options.prototype.setKitsuLastUpdate = function (date) {
	if (date) {
		$("#kitsuLastUpdated").text(date.replace(/T.*/, ''));
	} else {
		$("#kitsuLastUpdated").text("");
	}
};

Options.prototype.hoverHandler = function (hover) {
	if (hover) {
		clearTimeout(this.lastHoverTimeout);
		this.optionMenuContainer.addClass("open");
		this.optionMenuContainer.removeClass("closed");
	} else {
		this.lastHoverTimeout = setTimeout(() => {
			this.optionMenuContainer.removeClass("open");
			this.optionMenuContainer.addClass("closed");
		}, this.timeoutTime);
	}
};

Options.prototype.logout = function () {
	window.location.href = "./signout";
};

Options.prototype.updateMal = function () {
	var malName = $("#malUserNameInput").val();

	$("#malUpdateButton").addClass("disabled");
	$("#malUpdateSpinner").removeClass("hidden");

	//Register listner
	var listner = new Listener("anime list update result", function (result) {
		if (result.success) {
			displayMessage("Updated Successful", result.message);
		} else {
			displayMessage("Update Unsuccessful", result.message);
		}

		$("#malUpdateButton").removeClass("disabled");
		$("#malUpdateSpinner").addClass("hidden");

		listner.unbindListener();
	}.bind(this));
	listner.bindListener();

	//Send request to server
	socket.sendCommand({
		type: "library",
		command: "update anime list",
		data: {
			newUsername: malName,
			listType: 'MAL'
		}
	});
};

Options.prototype.updateAniList = function () {
	var aniListName = $("#aniListUserNameInput").val();

	$("#anilistUpdateButton").addClass("disabled");
	$("#anilistUpdateSpinner").removeClass("hidden");

	//Register listner
	var listner = new Listener("anime list update result", function (result) {
		if (result.success) {
			displayMessage("Updated Successful", result.message);
		} else {
			displayMessage("Update Unsuccessful", result.message);
		}

		$("#anilistUpdateButton").removeClass("disabled");
		$("#anilistUpdateSpinner").addClass("hidden");

		listner.unbindListener();
	}.bind(this));
	listner.bindListener();

	//Send request to server
	socket.sendCommand({
		type: "library",
		command: "update anime list",
		data: {
			newUsername: aniListName,
			listType: 'ANILIST'
		}
	});
};

Options.prototype.updateKitsu = function () {
	var username = $("#kitsuUserNameInput").val();

	$("#kitsuUpdateButton").addClass("disabled");
	$("#kitsuUpdateSpinner").removeClass("hidden");

	//Register listner
	var listner = new Listener("anime list update result", function (result) {
		if (result.success) {
			displayMessage("Updated Successful", result.message);
		} else {
			displayMessage("Update Unsuccessful", result.message);
		}

		$("#kitsuUpdateButton").removeClass("disabled");
		$("#kitsuUpdateSpinner").addClass("hidden");

		listner.unbindListener();
	}.bind(this));
	listner.bindListener();

	//Send request to server
	socket.sendCommand({
		type: "library",
		command: "update anime list",
		data: {
			newUsername: username,
			listType: 'KITSU'
		}
	});
};

Options.prototype.updatePassword = function () {
	let currentPassword = this.$CPM_CURRENT_PASSWORD.val();
	let newPassword = this.$CPM_NEW_PASSWORD.val();
	let repeatPassword = this.$CPM_REPEAT_PASSWORD.val();

	if (newPassword.length < 5) {
		this.showCPMWarning("New password must be at least 5 characters", true);
	} else if (newPassword.length > 9999) {
		this.showCPMWarning("Password must be at most 9999 characters", true);
	} else if (newPassword !== repeatPassword) {
		this.showCPMWarning("Passwords doesn't match", true);
	} else if (!currentPassword) {
		this.showCPMWarning("Missing current password", true);
	} else {
		try {
			$.ajax({
				url: "/changePassword",
				type: "POST",
				dataType: 'json',
				data: JSON.stringify({
					current: currentPassword,
					new: newPassword,
					repeat: repeatPassword
				}),
				contentType: "application/json",
				success: (data) => {
					if (data.success) {
						this.showCPMWarning("Password Updated");
						this.$CPM_CURRENT_PASSWORD.val("");
						this.$CPM_NEW_PASSWORD.val("");
						this.$CPM_REPEAT_PASSWORD.val("");
					} else {
						this.showCPMWarning(data.error, true);
					}
				},
				error: () => {
					this.showCPMWarning("Something went wrong, please try again", true);
				}
			});
		} catch (err) {
			this.showCPMWarning("Error communicating with server, please try again later", true);
		}
	}

};

Options.prototype.showCPMWarning = function (msg, danger) {
	this.$CPM_MESSAGE_CONTAINER.text(msg);
	this.$CPM_MESSAGE_CONTAINER.removeClass("hidden");
	if (danger) {
		this.$CPM_MESSAGE_CONTAINER.addClass("alert-danger");
		this.$CPM_MESSAGE_CONTAINER.removeClass("alert-success");
	} else {
		this.$CPM_MESSAGE_CONTAINER.addClass("alert-success");
		this.$CPM_MESSAGE_CONTAINER.removeClass("alert-danger");
	}
};

Options.prototype.updateShareMal = function () {
	let enabled = this.$MAl_SHARE_CHECKBOX.prop('checked');
	socket.sendCommand({
		type: "settings",
		command: "update share mal",
		data: {
			shareMal: enabled
		}
	});
	if(enabled) {
		this.$SHARE_SCORE_CONTAINER.removeClass('disabled');
	} else {
		this.$SHARE_SCORE_CONTAINER.addClass('disabled');
	}
};

Options.prototype.updateShareScore = function () {
	socket.sendCommand({
		type: "settings",
		command: "update share score",
		data: {
			shareScore: this.$SHARE_SCORE_CHECKBOX.prop('checked')
		}
	});
};

Options.prototype.updateListInclusion = function (checkbox, name) {
	let $checkbox = $(checkbox);
	socket.sendCommand({
		type: "settings",
		command: "update use list entry " + name,
		data: {
			on: $checkbox.prop('checked')
		}
	});
};

Options.prototype.updateAutoSubmit = function () {
	this.autoSubmit = this.$AUTO_SUBMIT_CHECKBOX.prop('checked');
	socket.sendCommand({
		type: "settings",
		command: "update auto submit",
		data: {
			autoSubmit: this.autoSubmit
		}
	});
};

Options.prototype.updateAutoVoteSkipGuess = function () {
	this.autoVoteSkipGuess = this.$AUTO_VOTE_GUESS.prop('checked');
	socket.sendCommand({
		type: "settings",
		command: "update auto vote skip guess",
		data: {
			autoVote: this.autoVoteSkipGuess
		}
	});
};

Options.prototype.updateAutoVoteSkipReplay = function () {
	this.autoVoteSkipReplay = this.$AUTO_VOTE_REPLAY.prop('checked');
	socket.sendCommand({
		type: "settings",
		command: "update auto vote skip replay",
		data: {
			autoVote: this.autoVoteSkipReplay
		}
	});
};

Options.prototype.updateDisableEmojis = function () {
	this.disableEmojis = this.$DISABLE_EMOJIS.prop('checked');
	socket.sendCommand({
		type: "settings",
		command: "update disable emojis",
		data: {
			disable: this.disableEmojis
		}
	});
};

Options.prototype.updateDisableFloatingText = function() {
	this.disableFloatingText = this.$DISABLE_FLOATING_TEXT.prop('checked');
	Cookies.set("disable_floating_text", this.disableFloatingText, { expires: 365 });
};

Options.prototype.setParticleQuality = function (newValue) {
	Cookies.set("particle_quality", newValue, { expires: 365 });
	this.particleQuality = newValue;
};

Options.prototype.setUseRomajiNames = function (newValue) {
	this.useRomajiNames = newValue;
	socket.sendCommand({
		type: "settings",
		command: "update use romaji names",
		data: {
			use: newValue ? true : false
		}
	});
};

Options.prototype.selectTab = function (contentContainerId, tab) {
	this.$SETTING_TABS.removeClass("selected");
	$(tab).addClass("selected");
	this.$SETTING_CONTAINERS.addClass('hide');
	$('#' + contentContainerId).removeClass('hide');

	this.$PARTICLE_SLIDER.slider('relayout');
	this.$SHOW_NAME_SLIDER.slider('relayout');
	this.$HOST_PRIOTISE_SLIDER.slider('relayout');
};

Options.prototype.getHostPriorityList = function () {
	return this._HOST_PRIO_LIST.getOrder();
};

Options.prototype.getHostResPrio = function () {
	return this.$HOST_PRIOTISE_SLIDER.slider('getValue');
};

Options.prototype.getListUsername = function(listId) {
	return this.$LIST_NAME_INPUTS[listId].val();
};

function createHoverFunction(target, handler) {
	let hoveDelayTimeout;
	target.hover(() => {
		hoveDelayTimeout = setTimeout(() => {
			handler(true);
		}, 400);
	}, () => {
		clearTimeout(hoveDelayTimeout);
		handler(false);
	});
}

var options = new Options();