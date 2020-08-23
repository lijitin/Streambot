'use strict';
/*exported contextMenueGenerator*/
function ContextMenueGenerator() {
	this._itemFields = {
		Chat: (player) => {
			return {
				name: "Chat",
				callback: () => {
					socialTab.startChat(player);
				}
			};
		},
		InviteToGame: (player) => {
			return {
				name: "Invite to Game",
				callback: () => {
					if(guestRegistrationController.isGuest) {
						displayMessage('Unavailable for Guess Accounts', 'Guest accounts are not able to send game invites');
					} else if (!(lobby.inLobby || quiz.inQuiz)) {
						displayMessage("You're not in a game");
					} else if((lobby.inLobby && lobby.soloMode) || (quiz.inQuiz && quiz.soloMode)) {
						displayMessage("Can't Invite Players when Playing Solo");
					} else {
						socket.sendCommand({
							type: "social",
							command: "invite to game",
							data: {
								target: player
							}
						});
					}
				}
			};
		},
		FriendRequest: (player) => {
			return {
				name: "Send Friend Request",
				callback: function () {
					socialTab.sendFriendRequest(player);
				}
			};
		},
		Block: (player) => {
			return {
				name: "Block",
				callback: function () {
					socialTab.blockPlayer(player);
				}
			};
		},
		Report: (player) => {
			return {
				name: "Report",
				callback: function () {
					reportModal.show(player);
				}
			};
		},
		RemoveFriend: (player) => {
			return {
				name: "Remove Friend",
				callback: () => {
					//Send remove friend message to server
					socket.sendCommand({
						type: "social",
						command: "remove friend",
						data: {
							target: player
						}
					});
					//Remove friend local
					socialTab.removeFriend(player);
				}
			};
		}
	};
}

ContextMenueGenerator.prototype.generateStandardContextMenu = function ($entry, selector, player, trigger = "right") {
	$entry.contextMenu({
		selector: selector,
		trigger: trigger,
		build: () => {
			return {
				items: this.generatePlayerItemsObject([
					'Chat',
					'InviteToGame',
					'FriendRequest',
					'Block',
					'Report'
				], player),
				events: {
					show: function (options) {
						if (socialTab.isFriend(player)) {
							options.items.FriendRequest.disabled = true;
						} else if (player === selfName) {
							options.items.FriendRequest.disabled = true;
							options.items.Chat.disabled = true;
							options.items.Block.disabled = true;
							options.items.Report.disabled = true;
							options.items.InviteToGame.disabled = true;
						} else if (socialTab.isBlocked(player)) {
							options.items.Block.disabled = true;
						} else {
							options.items.Block.disabled = false;
						}
					}.bind(this)
				}
			};
		}
	});
};

ContextMenueGenerator.prototype.generateFriendListContextMenu = function ($entry, selector, player, trigger = "right") {
	$entry.contextMenu({
		selector: selector,
		trigger: trigger,
		build: () => {
			return {
				items: this.generatePlayerItemsObject([
					'Chat',
					'InviteToGame',
					'RemoveFriend',
					'Block',
					'Report'
				], player),
				events: {
					show: function (options) {
						if (socialTab.offlineFriends.includes(player)) {
							options.items.Chat.disabled = true;
							options.items.InviteToGame.disabled = true;
						} else {
							options.items.Chat.disabled = false;
							options.items.InviteToGame.disabled = false;
						}
					}.bind(this)
				}
			};
		}
	});
};

ContextMenueGenerator.prototype.generatePlayerItemsObject = function (itemFieldList, player) {
	let items = {};

	itemFieldList.forEach(item => {
		items[item] = this._itemFields[item](player);
	});
	return items;
};

let contextMenueGenerator = new ContextMenueGenerator();