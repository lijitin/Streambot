"use strict";
/*exported socialTab*/
function SocialTab() {
	this._tab = $("#socialTab");
	this._friendEntryTemplate = $("#socialMenuPlayerTemplate").html();
	this._onlineFriendCounter = $("#mmSocialButtonFriendsOnlineCount");

	this.$friendView = $("#friendlist");
	this.$friendsButton = $("#socailTabFriends");

	this.$allUsersView = $("#allUserList");
	this.$allUsersButton = $("#socialTabAll");

	this.$ownProfileButton = $("#socialTabProfile");
	this.ownProfileXOffset = -23; //px

	this._$SOCIAL_TAB_CONTAINER = $("#socialTabContainer");

	this.onlineFriends = [];
	this.offlineFriends = [];
	this.blockedPlayers = [];

	this._$SOCIAL_TAB_CONTAINER.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", () => {
		this.updateScrollbar();
	});

	this.allPlayerList;

	//Setup chatbar
	this.chatBar = undefined;

	//LISTENERS
	this._newFriendListener = new Listener("new friend", function (friend) {
		if (friend.online) {
			this.addToOnlineFriends(friend.name);
			this.buildOnline();
			//Update all add friend icons for the friend
			$('.addFriendIcon-' + friend.name).addClass('disabled');
		} else {
			this.addToOfflineFriends(friend.name);
			this.buildOffline();
		}
		this.updateScrollbar();
	}.bind(this));

	this._friendStateChangeListener = new Listener("friend state change", function (friend) {
		if (friend.online) {
			removeFromArray(this.offlineFriends, friend.name);
			this.addToOnlineFriends(friend.name);
		} else {
			removeFromArray(this.onlineFriends, friend.name);
			this.addToOfflineFriends(friend.name);
		}
		this.buildOnline();
		this.buildOffline();
	}.bind(this));

	this._friendRemoveListener = new Listener("friend removed", (target) => {
		this.removeFriend(target.name);
		this.updateScrollbar();
	});

	this._friendNameChangeListener = new Listener("friend name change", (payload) => {
		let onlineIndex = this.onlineFriends.indexOf(payload.oldName);
		if (onlineIndex !== -1) {
			this.onlineFriends[onlineIndex] = payload.newName;
			this.buildOnline();
		} else {
			let offlineIndex = this.offlineFriends.indexOf(payload.oldName);
			if (offlineIndex !== -1) {
				this.offlineFriends[offlineIndex] = payload.newName;
				this.buildOffline();
			}
		}
	});
}

SocialTab.prototype.setup = function (friends, blockedPlayers) {
	//Load other objects
	this.chatBar = new ChatBar();
	this.allPlayerList = new AllPlayersList();
	//Setup friends
	friends.forEach(function (friend) {
		if (friend.online) {
			this.addToOnlineFriends(friend.name);
		} else {
			this.addToOfflineFriends(friend.name);
		}
	}.bind(this));

	this.blockedPlayers = blockedPlayers;

	this.buildOnline();
	this.buildOffline();

	this._$SOCIAL_TAB_CONTAINER.perfectScrollbar({
		suppressScrollX: true
	});

	//Register listners
	this._newFriendListener.bindListener();
	this._friendStateChangeListener.bindListener();
	this._friendRemoveListener.bindListener();
	this._friendNameChangeListener.bindListener();
};

/*================CONTROLL/VISUEL====================*/
//===ENTRY

SocialTab.prototype.openClose = function () {
	if (this._tab.hasClass("open")) {
		this.allPlayerList.stopTracking();
		this._tab.removeClass("open");
	} else {
		this._handleOpen();
	}
};

SocialTab.prototype.changeToAllUsers = function () {
	if (!this.allPlayerList.ready) {
		//If no users, then do nothing (server haven't responded yet)
		return;
	}
	this.$friendView.addClass("hide");
	this.$allUsersView.removeClass("hide");
	this.$friendsButton.removeClass("selected");
	this.$allUsersButton.addClass("selected");
	this.updateScrollbar();
};

SocialTab.prototype.changeToFriends = function () {
	this.$allUsersView.addClass("hide");
	this.$friendView.removeClass("hide");
	this.$friendsButton.addClass("selected");
	this.$allUsersButton.removeClass("selected");
	this.updateScrollbar();
};

SocialTab.prototype.openOwnProfile = function () {
	playerProfileController.loadProfileIfClosed(selfName, this.$ownProfileButton, { x: this.ownProfileXOffset }, () => {
		this.$ownProfileButton.removeClass('selected ');
	});
	this.$ownProfileButton.addClass('selected ');
};

//===HELPER

SocialTab.prototype.buildOnline = function () {
	this.onlineFriends.sort(sortFriends);
	$("#friendOnlineList").html("");
	this.onlineFriends.forEach(function (friend) {
		let $entry = this.createPlayerEntry(friend, false);
		$("#friendOnlineList").append($entry);
		contextMenueGenerator.generateFriendListContextMenu($entry, '.stPlayerName', friend);
	}.bind(this));
	this._onlineFriendCounter.text(this.onlineFriends.length);
};

SocialTab.prototype.buildOffline = function () {
	this.offlineFriends.sort(sortFriends);
	$("#friendOfflineList").html("");
	this.offlineFriends.forEach(function (friend) {
		let $entry = this.createPlayerEntry(friend, true);
		$("#friendOfflineList").append($entry);
		contextMenueGenerator.generateFriendListContextMenu($entry, '.stPlayerName', friend);
	}.bind(this));
};

SocialTab.prototype.createPlayerEntry = function (friendName, offline) {
	let $entry = $(format(this._friendEntryTemplate, friendName));
	let $profileButton = $entry.find('.stPlayerProfileButton');
	$profileButton.click(() => {
		playerProfileController.loadProfileIfClosed(friendName, $profileButton, { x: 7 }, () => {
			$entry.removeClass('profileOpen');
		}, offline);
		$entry.addClass('profileOpen');
	});
	return $entry;
};


SocialTab.prototype._handleOpen = function () {
	//Reset layout
	this.allPlayerList.hide();
	this.$friendView.removeClass("hide");
	this.$friendsButton.addClass("selected");
	this.$allUsersButton.removeClass("selected");

	this.allPlayerList.startTracking();

	//Open tab
	this._tab.addClass("open");
};

/*=============MANAGE==================*/

function sortFriends(friendA, friendB) {
	return friendA.toLowerCase().localeCompare(friendB.toLowerCase());
}

SocialTab.prototype.updateScrollbar = function () {
	this._$SOCIAL_TAB_CONTAINER.perfectScrollbar('update');
};

SocialTab.prototype.addToOnlineFriends = function (name) {
	if ($.inArray(name, this.onlineFriends) === -1) {
		this.onlineFriends.push(name);
	}
	roomBrowser.notifyFriendChange();
};

SocialTab.prototype.addToOfflineFriends = function (name) {
	if ($.inArray(name, this.offlineFriends) === -1) {
		this.offlineFriends.push(name);
	}
	roomBrowser.notifyFriendChange();
};

SocialTab.prototype.removeFriend = function (name) {
	var index = this.onlineFriends.indexOf(name);
	if (index >= 0) {
		this.onlineFriends.splice(index, 1);
		this.buildOnline();
		//Update all add friend icons for the friend
		$('.addFriendIcon-' + name).removeClass('disabled');
	} else {
		index = this.offlineFriends.indexOf(name);
		this.offlineFriends.splice(index, 1);
		this.buildOffline();
	}
	roomBrowser.notifyFriendChange();
};

SocialTab.prototype.sendFriendRequest = function (playerName) {
	if (this.isFriend(playerName)) {
		displayMessage("Already in friendlist");
		return;
	}

	if(guestRegistrationController.isGuest) {
		displayMessage('Unavailable for Guess Accounts', 'The friend system is unavailable for guest accounts');
		return;
	}

	var responseHandler = new Listener("friend request", function (payload) {
		if (payload.result === "error") {
			displayMessage("Error sending friend request", payload.reason);
		} else {
			this.chatBar.handleAlert(payload.name, "Friend request send");
			this.chatBar.startChat(payload.name);
		}
		responseHandler.unbindListener();
	}.bind(this));

	responseHandler.bindListener();
	socket.sendCommand({
		type: "social",
		command: "friend request",
		data: {
			target: playerName
		}
	});
};

SocialTab.prototype.blockPlayer = function (playerName) {
	socket.sendCommand({
		type: "social",
		command: "block player",
		data: {
			target: playerName
		}
	});

	if (socialTab.isFriend(playerName)) {
		socialTab.removeFriend(playerName);
	}
	socialTab.addBlockedPlayer(playerName);

	//Disable possible command buttons
	$(".blockCommandIcon-" + playerName).addClass('disabled');
};

SocialTab.prototype.addBlockedPlayer = function (playerName) {
	if (this.blockedPlayers.indexOf(playerName) === -1) {
		this.blockedPlayers.push(playerName);
	}
};

SocialTab.prototype.removeBlockedPlayer = function (playerName) {
	let playerIndex = this.blockedPlayers.indexOf(playerName);
	if (playerIndex > -1) {
		this.blockedPlayers.splice(playerIndex, 1);
	}
};

SocialTab.prototype.unblockPlayer = function (playerName) {
	socket.sendCommand({
		type: "social",
		command: "unblock player",
		data: {
			target: playerName
		}
	});
	this.removeBlockedPlayer(playerName);

	$("#blockedPlayerEntry-" + playerName).remove();

	$(".blockCommandIcon-" + playerName).removeClass('disabled');
};

SocialTab.prototype.startChat = function (playerName) {
	this.chatBar.startChat(playerName);
};


/*==============GET/SET===================*/

SocialTab.prototype.getAllFriends = function () {
	return this.onlineFriends.concat(this.offlineFriends);
};

SocialTab.prototype.isFriend = function (name) {
	return $.inArray(name, this.onlineFriends) !== -1 || $.inArray(name, this.offlineFriends) !== -1;
};

SocialTab.prototype.isBlocked = function (name) {
	return this.blockedPlayers.indexOf(name) !== -1;
};


var socialTab = new SocialTab();