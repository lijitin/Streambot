"use strict";
var ROOM_TILE_TEMPLATE = $("#rbRoomTileTemplate").html();

function RoomTile(
	settings,
	host,
	hostAvatar,
	id,
	numberOfPlayers,
	numberOfSpectators,
	players,
	inLobby,
	parent,
	songLeft
) {
	this.settings = settings;
	this.id = id;
	this.host = host;
	this._inLobby = inLobby;

	this._roomSize = this.settings.roomSize;
	this._numberOfPlayers = numberOfPlayers;
	this._numberOfSpectators = numberOfSpectators;
	this._players = players;

	this._private = this.settings.privateRoom;
	this.modalPreviewOpen = false;

	//Calculate number of friends
	this._friendsInGameMap = {};

	let openingClass = this.getSelectionClass(
		this.settings.songType.standardValue.openings &&
			(this.settings.songType.advancedValue.openings || this.settings.songType.advancedValue.random)
	);
	let endingClass = this.getSelectionClass(
		this.settings.songType.standardValue.endings &&
			(this.settings.songType.advancedValue.endings || this.settings.songType.advancedValue.random)
	);
	let insertClass = this.getSelectionClass(
		this.settings.songType.standardValue.inserts &&
			(this.settings.songType.advancedValue.inserts || this.settings.songType.advancedValue.random)
	);

	let avatar = hostAvatar.avatar;
	this.parent = parent;
	this.parent.appendRoomTile(
		format(
			ROOM_TILE_TEMPLATE,
			escapeHtml(this.settings.roomName),
			this.host,
			id,
			numberOfSpectators,
			Object.keys(this._friendsInGameMap).length,
			this._numberOfPlayers,
			this._roomSize,
			this.translateGuessTime(this.settings.guessTime),
			this.settings.numberOfSongs,
			this.translateSongSelection(this.settings.songSelection),
			openingClass,
			endingClass,
			insertClass,
			(this._numberOfPlayers / this._roomSize) * 100,
			cdnFormater.newAvatarSrc(
				avatar.avatarName,
				avatar.outfitName,
				avatar.optionName,
				avatar.optionActive,
				avatar.colorName,
				cdnFormater.AVATAR_POSE_IDS.BASE
			),
			cdnFormater.newAvatarSrcSet(
				avatar.avatarName,
				avatar.outfitName,
				avatar.optionName,
				avatar.optionActive,
				avatar.colorName,
				cdnFormater.AVATAR_POSE_IDS.BASE
			),
			this.settings.gameMode
		)
	);

	this.$tile = $("#rbRoom-" + id);
	this.$tile.find("[data-toggle=popover]").popover();
	this.$tile.find('[data-toggle="tooltip"]').tooltip();

	this.$tile.find(".rbrFriendPopover").popover({
		trigger: "hover",
		placement: "auto top",
		title: "Friends",
		container: "#roomBrowserPage",
		content: "",
		html: true,
	});

	this.updateFriends();

	this.resizeRoomName();

	this.togglePrivate();

	this.$joinButton = this.$tile.find(".rbrJoinButton");

	this.toggleJoinButton();

	let background = hostAvatar.background;

	let $imgContainer = this.$tile.find(".rbrRoomImageContainer");
	$imgContainer.css(
		"background-image",
		'url("' +
			cdnFormater.newAvatarBackgroundSrc(background.backgroundHori, cdnFormater.BACKGROUND_GAME_SIZE) +
			'")'
	);

	if (background.avatarName === "Honoka") {
		if (background.outfitName === "Spring") {
			$imgContainer.css("background-position", "-40px 0px");
		} else {
			$imgContainer.css("background-position", "center").css("background-size", "112%");
		}
	} else if (background.avatarName === "Komugi") {
		if (background.outfitName === "Winter") {
			$imgContainer.css("background-position", "36px center").css("background-size", "80%");
		} else if (background.outfitName === "Tribal Sorcerer") {
			$imgContainer
				.css("background-position", "109px -11px")
				.css("background-size", "57%")
				.css("background-repeat", "no-repeat");
		} else {
			$imgContainer.css("background-position", "-36px center").css("background-size", "100%");
		}
	} else if (background.avatarName === "Miyu") {
		if (background.outfitName === "Winter") {
			$imgContainer
				.css("background-position", "15px center")
				.css("background-size", "95%")
				.css("background-repeat", "no-repeat");
		} else {
			$imgContainer
				.css("background-position", "117px center")
				.css("background-size", "48%")
				.css("background-repeat", "no-repeat");
		}
	} else if (background.avatarName === "Shiina") {
		$imgContainer.css("background-position", "center").css("background-size", "80%");
	} else if (background.avatarName === "Noel") {
		if (background.outfitName === "Spring") {
			$imgContainer.css("background-position", "-40px 0px");
		} else {
			$imgContainer.css("background-position", "-35px -30px");
		}
	} else if (background.avatarName === "Kyouko") {
		$imgContainer.css("background-position", "-35px -30px");
	} else if (background.avatarName === "Hikari") {
		$imgContainer.css("background-position", "-30px center");
	} else if (background.avatarName === "Kuriko") {
		if (background.outfitName === "Summer") {
			$imgContainer.css("background-position", "120px center").css("background-size", "40%");
		} else {
			$imgContainer.css("background-position", "109px -17px").css("background-size", "57%");
		}
		$imgContainer.css("background-repeat", "no-repeat");
	} else if (background.avatarName === "Ritsu") {
		$imgContainer.css("background-position", "3px -15px").css("background-size", "100%");
	}

	if (avatar.avatarName === "Komugi" && avatar.outfitName === "Tribal Sorcerer") {
		$imgContainer.find(".rbrRoomImage").css("width", "140px").css("top", "-11px").css("left", "2px");
	} else if (avatar.avatarName === "Miyu") {
		$imgContainer.find(".rbrRoomImage").css("width", "150px").css("top", "-23px").css("left", "5px");
	} else if (avatar.avatarName === "Kuriko") {
		$imgContainer.find(".rbrRoomImage").css("width", "121px").css("top", "-28px");
	} else if (avatar.avatarName === "Ritsu") {
		$imgContainer.find(".rbrRoomImage").css("width", "110px").css("top", "-13px");
	} else if (
		avatar.avatarName === "Kyouko" &&
		avatar.outfitName === "Standard" &&
		(avatar.colorName === "demon" || avatar.colorName === "angel")
	) {
		$imgContainer.find(".rbrRoomImage").css("width", "120px").css("top", "-18px");
	}

	if (!this._inLobby) {
		this.setSongsLeft(songLeft);
		this.$tile.addClass("rbrPlaying");
	}

	//LISTENERS
	this._changeListner = new Listener(
		"Room Change",
		function (payload) {
			if (this.id === payload.roomId) {
				if (payload.changeType === "settings") {
					for (let key in payload.change) {
						if (payload.change.hasOwnProperty(key)) {
							this.updateSetting(key, payload.change[key]);
							this.toggleJoinButton();
						}
					}
					if (this.modalPreviewOpen) {
						hostModal.changeSettings(payload.change);
					}
				} else if (payload.changeType === "players") {
					if (payload.player) {
						if (payload.playerCount > this._numberOfPlayers) {
							this._players.push(payload.player);
						} else {
							this._players.splice(this._players.indexOf(payload.player), 1);
						}
						if (socialTab.onlineFriends.indexOf(payload.player) > -1) {
							this.updateFriends();
						}
					}
					this._numberOfPlayers = payload.playerCount;
					this.$tile.find(".rbrPlayerCount").text(this._numberOfPlayers);
					this.updateProgressBar();
					this.toggleJoinButton();
					if (payload.newHost) {
						this.$tile.find(".rbrHost").text(payload.newHost.name);
						this.host = payload.newHost.name;
					}
				} else if (payload.changeType === "spectators") {
					if (payload.player) {
						if (payload.spectatorCount > this._numberOfSpectators) {
							this._players.push(payload.player);
						} else {
							this._players.splice(this._players.indexOf(payload.player), 1);
						}
						if (socialTab.onlineFriends.indexOf(payload.player) > -1) {
							this.updateFriends();
						}
					}
					this.$tile.find(".rbrNumberOfSpectators").text(payload.spectatorCount);
					this._numberOfSpectators = payload.spectatorCount;
				} else if (payload.changeType === "songsLeft") {
					this.setSongsLeft(payload.songsLeft);
				} else if (payload.changeType === "game start") {
					this._inLobby = false;
					this.toggleJoinButton();
					this.setSongsLeft(this.settings.numberOfSongs);
					this.$tile.addClass("rbrPlaying");
				} else if (payload.changeType === "game over") {
					this._inLobby = true;
					this.toggleJoinButton();
					this.$tile.removeClass("rbrPlaying");
				} else {
					this.delete();
					if (this.modalPreviewOpen) {
						hostModal.hide();
						displayMessage("Room Closed");
					}
				}
				roomBrowser.applyTileFilterToRoom(this);
			}
		}.bind(this)
	);
	this._changeListner.bindListener();

	this.$tile.find(".rbrJoinButton").click(() => {
		this.joinGame();
	});

	this.$tile.find(".rbrSpectateButton").click(() => {
		this.spectateGame();
	});

	this.$tile.find(".rbrAllOptionsIcon").click(() => {
		this.previewSettings();
	});

	roomBrowser.applyTileFilterToRoom(this);
}

RoomTile.prototype.joinGame = function () {
	if (this._private) {
		swal({
			title: "Password Required",
			input: "password",
			showCancelButton: true,
			confirmButtonText: "Join",
			inputAttributes: {
				maxlength: 50,
				minlength: 1,
			},
		}).then((result) => {
			if (!result.dismiss) {
				roomBrowser.fireJoinLobby(this.id, result.value);
			}
		});
	} else {
		roomBrowser.fireJoinLobby(this.id);
	}
};

RoomTile.prototype.spectateGame = function () {
	if (this._private) {
		swal({
			title: "Password Required",
			input: "password",
			showCancelButton: true,
			confirmButtonText: "Spectate",
			inputAttributes: {
				maxlength: 50,
				minlength: 1,
			},
		}).then(
			(result) => {
				if (!result.dismiss) {
					roomBrowser.fireSpectateGame(this.id, result.value);
				}
			},
			() => {}
		);
	} else {
		roomBrowser.fireSpectateGame(this.id);
	}
};

RoomTile.prototype.togglePrivate = function () {
	let $privateContainer = this.$tile.find(".rbrPrivateContainer");
	if (this._private) {
		$privateContainer.removeClass("hidden");
	} else {
		$privateContainer.addClass("hidden");
	}
};

RoomTile.prototype.isPrivate = function () {
	return this._private;
};

RoomTile.prototype.translateSongSelection = function (songSelection) {
	if (songSelection.advancedOn) {
		return "Custom";
	} else {
		switch (songSelection.standardValue) {
			case 1:
				return "Random";
			case 2:
				return "Mainly Watched";
			case 3:
				return "Only Watched";
		}
	}
};

RoomTile.prototype.translateGuessTime = function (guessTimeEntry) {
	let guessTimeString = "";
	if (guessTimeEntry.randomOn) {
		let guessTime = guessTimeEntry.randomValue;
		guessTimeString = guessTime[0] + "-" + guessTime[1];
	} else {
		guessTimeString = guessTimeEntry.standardValue;
	}
	return guessTimeString;
};

RoomTile.prototype.updateFriendInfo = function () {
	this.$tile.find(".rbrNumberOfFriends").text(Object.keys(this._friendsInGameMap).length);

	let popoverContent;
	if (Object.keys(this._friendsInGameMap).length) {
		let $friendList = $("<ul></ul>");
		Object.keys(this._friendsInGameMap)
			.sort((a, b) => {
				return a.toLowerCase().localeCompare(b.toLocaleLowerCase());
			})
			.forEach((friends) => {
				$friendList.append($("<li></li>").text(friends));
			});
		popoverContent = $friendList[0].outerHTML;
	}

	this.$tile.find(".rbrFriendPopover").data("bs.popover").options.content = popoverContent;
};

RoomTile.prototype.updateSetting = function (setting, change) {
	switch (setting) {
		case "guessTime":
			this.$tile.find(".rbrGuessTime").text(this.translateGuessTime(change));
			break;
		case "songSelection":
			this.$tile.find(".rbrSongFilter").text(this.translateSongSelection(change));
			break;
		case "numberOfSongs":
			this.$tile.find(".rbrSongCount").text(change);
			break;
		case "roomSize":
			this.$tile.find(".rbrMaxPlayerCount").text(change);
			this._roomSize = change;
			this.updateProgressBar();
			break;
		case "songType":
			this.updateSelection(
				".rbrTypeOpening",
				change.standardValue.openings &&
					(change.advancedValue.openings || change.advancedValue.random)
			);
			this.updateSelection(
				".rbrTypeEnding",
				change.standardValue.endings && (change.advancedValue.endings || change.advancedValue.random)
			);
			this.updateSelection(
				".rbrTypeInsert",
				change.standardValue.inserts && (change.advancedValue.inserts || change.advancedValue.random)
			);
			break;
		case "roomName":
			this.$tile.find(".rbrRoomName").text(change);
			this.resizeRoomName();
			break;
		case "privateRoom":
			this._private = change;
			this.togglePrivate();
			break;
		case "gameMode":
			this.$tile.find(".rbrGameMode").text(change);
			break;
	}
	this.settings[setting] = change;
};

RoomTile.prototype.updateAdvancedSetting = function (className, newValue) {
	let $extraOptionIcon = this.$tile.find(".rbrAllOptionsIcon");
	let newPopout = $("<div>" + $extraOptionIcon.attr("data-content") + "</div>");
	newPopout.find(className).text(newValue);
	$extraOptionIcon.attr("data-content", newPopout.html());
};

RoomTile.prototype.updateAdvancedSelection = function (className, selected) {
	let $extraOptionIcon = this.$tile.find(".rbrAllOptionsIcon");
	let newPopout = $("<div>" + $extraOptionIcon.attr("data-content") + "</div>");
	if (selected) {
		newPopout.find(className).addClass("rbrSelected");
	} else {
		newPopout.find(className).removeClass("rbrSelected");
	}
	$extraOptionIcon.attr("data-content", newPopout.html());
};

RoomTile.prototype.updateSelection = function (className, selected) {
	if (selected) {
		this.$tile.find(className).addClass("rbrSelected");
	} else {
		this.$tile.find(className).removeClass("rbrSelected");
	}
};

RoomTile.prototype.updateProgressBar = function () {
	let newPercent = (this._numberOfPlayers / this._roomSize) * 100;
	this.$tile.find(".progress-bar").css("width", newPercent + "%");
};

RoomTile.prototype.toggleJoinButton = function () {
	let off = this._numberOfPlayers === this._roomSize || !this._inLobby;
	if (off) {
		this.$joinButton.addClass("disabled");
	} else {
		this.$joinButton.removeClass("disabled");
	}
	if (this.modalPreviewOpen) {
		hostModal.toggleJoinButton(!off);
	}
};

RoomTile.prototype.isInLobby = function () {
	return this._inLobby;
};

RoomTile.prototype.isFull = function () {
	return this._numberOfPlayers === this._roomSize;
};

RoomTile.prototype.getSelectionClass = function (checked) {
	if (checked) {
		return "rbrSelected";
	} else {
		return "";
	}
};

RoomTile.prototype.delete = function () {
	this._changeListner.unbindListener();
	this.$tile.find("[data-toggle=popover]").popover("destroy");
	this.$tile.find('[data-toggle="tooltip"]').tooltip("destroy");
	this.$tile.find(".rbrFriendPopover").popover("destroy");
	this.parent.removeRoomTile(this.id);
};

RoomTile.prototype.setHidden = function (hide) {
	if (hide) {
		this.$tile.addClass("hidden");
	} else {
		this.$tile.removeClass("hidden");
	}
};

RoomTile.prototype.updateFriends = function () {
	this._friendsInGameMap = {};
	this._players.forEach((player) => {
		if (socialTab.onlineFriends.indexOf(player) > -1) {
			this._friendsInGameMap[player] = true;
		}
	});

	this.updateFriendInfo();
};

RoomTile.prototype.resizeRoomName = function () {
	fitTextToContainer(this.$tile.find(".rbrRoomName"), this.$tile.find(".rbrRoomNameContainer"), 21, 13);
};

RoomTile.prototype.setSongsLeft = function (newValue) {
	this.$tile.find(".rbrSongsLeft").text(newValue);
};

RoomTile.prototype.previewSettings = function () {
	this.modalPreviewOpen = true;
	hostModal.changeSettings(this.settings);
	hostModal.setModePreviewGame(this);
	this.toggleJoinButton();
	hostModal.showSettings();
	hostModal.show();
};

RoomTile.prototype.settingPreviewClosed = function () {
	this.modalPreviewOpen = false;
};

RoomTile.prototype.getFriendsInGame = function () {
	return Object.keys(this._friendsInGameMap);
};
