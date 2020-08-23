"use strict";
/*exported LobbyAvatarSlot*/

class LobbyAvatarSlot {
	constructor(avatarInfo, playerName, playerLevel, isReady, isHost, isSelf) {
		this.$LOBBY_SLOT = $(this.SLOT_TEMPLATE);
		this.$NAME_OUTER_CONTAINER = this.$LOBBY_SLOT.find(".lobbyAvatarNameContainerInner");
		this.$NAME_CONTAINER = this.$LOBBY_SLOT.find(".lobbyAvatarNameContainerInner > h2");
		this.$LEVEL_CONTAINER = this.$LOBBY_SLOT.find(
			".lobbyAvatarLevelContainer > .lobbyAvatarSubTextContainer > h3"
		);
		this.$IS_HOST_CONTAINER = this.$LOBBY_SLOT.find(
			".lobbyAvatarHostContainer > .lobbyAvatarSubTextContainer"
		);
		this.$HOST_OPTIONS = this.$LOBBY_SLOT.find(".lobbyAvatarHostOptions");
		this.$AVATAR_IMAGE = this.$LOBBY_SLOT.find(".lobbyAvatarImg");

		this._name;
		this.isSelf = isSelf;

		this.avatar = avatarInfo;
		this.name = playerName;
		this.level = playerLevel;
		this.ready = isReady;
		this.isHost = isHost;
		if (isSelf) {
			this.$LOBBY_SLOT.addClass("isSelf");
		}
	}

	set name(newName) {
		this._name = newName;
		this.$NAME_CONTAINER.text(newName);
		if (!this.isSelf) {
			setTimeout(() => {
				this.setupAvatarOptions();
			}, 1);
		}
	}
	get name() {
		return this._name;
	}
	set level(newLevel) {
		this.$LEVEL_CONTAINER.text(newLevel);
	}
	set ready(isReady) {
		if (isReady) {
			this.$LOBBY_SLOT.addClass("lbReady");
		} else {
			this.$LOBBY_SLOT.removeClass("lbReady");
		}
	}
	set isHost(isHost) {
		if (isHost) {
			this.$IS_HOST_CONTAINER.removeClass("hide");
		} else {
			this.$IS_HOST_CONTAINER.addClass("hide");
		}
	}
	set avatar(avatarInfo) {
		if (avatarInfo) {
			let avatar = avatarInfo.avatar;
			this.$AVATAR_IMAGE
				.attr(
					"srcset",
					cdnFormater.newAvatarHeadSrcSet(
						avatar.avatarName,
						avatar.outfitName,
						avatar.optionName,
						avatar.optionActive,
						avatar.colorName
					)
				)
				.attr(
					"src",
					cdnFormater.newAvatarHeadSrc(
						avatar.avatarName,
						avatar.outfitName,
						avatar.optionName,
						avatar.optionActive,
						avatar.colorName
					)
				);
		} else {
			this.$AVATAR_IMAGE.attr("srcset", "").attr("src", "");
		}
	}
	set hostOptionsActive(active) {
		if (active) {
			this.$HOST_OPTIONS.removeClass("hide");
		} else {
			this.$HOST_OPTIONS.addClass("hide");
		}
	}

	setupAvatarOptions() {
		let $profileIcon = this.$LOBBY_SLOT.find(".playerCommandProfileIcon");
		$profileIcon
			.click(() => {
				playerProfileController.loadProfileIfClosed(
					this.name,
					$profileIcon,
					{ x: 7 },
					() => {},
					false,
					true
				);
			})
			.tooltip({
				placement: "top",
				title: "Profile",
				container: "#lobbyPage",
			});
		this.$LOBBY_SLOT
			.find(".playerCommandIconPromote")
			.click(() => {
				lobby.promoteHost(this.name);
			})
			.tooltip({
				placement: "top",
				title: "Promote Host",
				container: "#lobbyPage",
			});
		this.$LOBBY_SLOT
			.find(".playerCommandIconChangeSpec")
			.click(() => {
				lobby.changeToSpectator(this.name);
			})
			.tooltip({
				placement: "top",
				title: "Change to Spectator",
				container: "#lobbyPage",
			});
		this.$LOBBY_SLOT
			.find(".playerCommandIconKick")
			.click(() => {
				lobby.kickPlayer(this.name);
			})
			.tooltip({
				placement: "top",
				title: "Kick",
				container: "#lobbyPage",
			});
	}

	remove() {
		this.$LOBBY_SLOT.remove();
	}

	updateLayout() {
		setTimeout(() => {
			fitTextToContainer(this.$NAME_CONTAINER, this.$NAME_OUTER_CONTAINER, 30, 12);
		}, 1);
	}
}
LobbyAvatarSlot.prototype.SLOT_TEMPLATE = $("#lobbyAvatarTemplate").html();
