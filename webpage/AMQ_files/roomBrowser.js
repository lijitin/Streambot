"use strict";
/*exported roomBrowser*/

function RoomBrowser() {
	this.$view = $("#roomBrowserPage");
	this.$roomContainer = $("#rbRoomContainer");
	this.$roomHider = $("#rbRoomHider");

	this.$totalRoomCount = $("#rbTotalGameCount");
	this.$shownRoomCount = $("#rbShowGameCount");

	this.activeRooms = {};

	this.numberOfRooms = 0;

	//LISTENERS
	this._roomListner = new Listener("New Rooms", function (rooms) {
		rooms.forEach(room => {
			this.numberOfRooms++;
			this.activeRooms[room.id] = new RoomTile(room.settings, room.host, room.hostAvatar, room.id, room.numberOfPlayers, room.numberOfSpectators, room.players, room.inLobby, this, room.songLeft);
		});
		this.updateNumberOfRoomsText();

	}.bind(this));

}

RoomBrowser.prototype.setup = function () {
	this.$roomHider.perfectScrollbar({
		suppressScrollX: true
	});
};

RoomBrowser.prototype.closeView = function () {
	this.$view.addClass("hidden");
	roomFilter.reset();
	//Remove all listnters
	this._roomListner.unbindListener();
	socket.sendCommand({
		type: 'roombrowser',
		command: 'remove roombrowser listners'
	});
	//Remove all tiles
	for (let key in this.activeRooms) {
		if (this.activeRooms.hasOwnProperty(key)) {
			this.activeRooms[key].delete();
		}
	}
};

RoomBrowser.prototype.openView = function (callback) {
	this._roomListner.bindListener();

	//Request all active room
	socket.sendCommand({
		type: "roombrowser",
		command: "get rooms"
	});
	this.$view.removeClass("hidden");
	this.$roomHider.perfectScrollbar('update');
	$(".sliderInput").slider('relayout');
	hostModal.reset();
	callback();
};

RoomBrowser.prototype.openHostModal = function() {
	if(guestRegistrationController.isGuest) {
		displayMessage('Unavailable for Guess Accounts', 'Guest accounts are not able to create multiplayer games');
	} else {
		hostModal.setModeHostGame();
		hostModal.show();
	}
};

RoomBrowser.prototype.host = function () {
	let settings = hostModal.getSettings();
	if (!settings) {
		return;
	}

	let hostListner = new Listener("Host Game", function (response) {
		hostModal.hide();
		lobby.setupLobby(response, false);
		viewChanger.changeView("lobby");
		hostListner.unbindListener();
	}.bind(this));

	hostListner.bindListener();

	let command = hostModal.soloMode ? "host solo room" : "host room";

	socket.sendCommand({
		type: 'roombrowser',
		command: command,
		data: settings
	});
};

RoomBrowser.prototype.appendRoomTile = function (tileHtml) {
	this.$roomContainer.append(tileHtml);
};

RoomBrowser.prototype.removeRoomTile = function (tileId) {
	$("#rbRoom-" + tileId).remove();
	delete this.activeRooms[tileId];
	this.numberOfRooms--;
	this.updateNumberOfRoomsText();
};

RoomBrowser.prototype.updateNumberOfRoomsText = function () {
	this.$totalRoomCount.text(this.numberOfRooms);

	let shownRoomCount = $(".rbRoom:not(.hidden)").length;

	this.$shownRoomCount.text(shownRoomCount);
};

RoomBrowser.prototype.applyTileFilter = function () {
	for (let key in this.activeRooms) {
		if (this.activeRooms.hasOwnProperty(key)) {
			this.applyTileFilterToRoom(this.activeRooms[key]);
		}
	}

};

RoomBrowser.prototype.applyTileFilterToRoom = function (room) {
	if (roomFilter.testRoom(room)) {
		room.setHidden(false);
	} else {
		room.setHidden(true);
	}

	this.updateNumberOfRoomsText();
};

RoomBrowser.prototype.notifyFriendChange = function () {
	for (let key in this.activeRooms) {
		if (this.activeRooms.hasOwnProperty(key)) {
			this.activeRooms[key].updateFriends();
		}
	}
};

RoomBrowser.prototype.fireJoinLobby = function (gameId, password) {
	let joinGameListner = new Listener("Join Game", function (response) {
		if (response.error) {
			displayMessage(response.errorMsg);
		} else {
			this.joinLobby(response, false);
		}
		joinGameListner.unbindListener();
	}.bind(this));

	joinGameListner.bindListener();

	socket.sendCommand({
		type: "roombrowser",
		command: "join game",
		data: {
			gameId: gameId,
			password: password
		}
	});
};

RoomBrowser.prototype.fireSpectateGame = function (gameId, password, gameInvite) {
	let spectateGameListner = new Listener("Spectate Game", function (response) {
		if (response.error) {
			displayMessage(response.errorMsg);
		} else {
			if (response.inLobby) {
				this.joinLobby(response, true);
			} else {
				this.joinGame(response);
			}
		}
		spectateGameListner.unbindListener();
	}.bind(this));

	spectateGameListner.bindListener();

	socket.sendCommand({
		type: "roombrowser",
		command: "spectate game",
		data: {
			gameId: gameId,
			password: password,
			gameInvite: gameInvite
		}
	});
};

RoomBrowser.prototype.joinLobby = function (data, isSpectator) {
	lobby.setupLobby(data, isSpectator);
	data.spectators.forEach((spectator) => {
		gameChat.addSpectator(spectator, data.hostName === spectator.name);
	});
	viewChanger.changeView("lobby");
};

RoomBrowser.prototype.joinGame = function (data) {
	data.spectators.forEach((spectator) => {
		gameChat.addSpectator(spectator, data.hostName === spectator.name);
	});

	data.inQueue.forEach(playerName => {
		gameChat.addPlayerToQueue(playerName);
	});

	if (data.settings.gameMode === 'Battle Royale' && data.quizState.state === quiz.QUIZ_STATES.BATTLE_ROYAL) {
		battleRoyal.setupGame(data.quizState.players, true, data.settings, data.quizState.timeLeft, data.quizState.mapState);
		viewChanger.changeView("battleRoyal");
	} else {
		quiz.setupQuiz(data.quizState.players, true, data.quizState, data.settings, false, data.quizState.groupSlotMap);
		viewChanger.changeView("quiz");
	}
};


var roomBrowser = new RoomBrowser();