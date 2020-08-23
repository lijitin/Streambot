"use strict";
var setupDocumentDone = false;
$(document).ready(function () {
	setupDocumentDone = true;
	clientSetup();
});

window.addEventListener("keydown", function (e) {
	if (e.keyCode === 221 && e.ctrlKey && e.shiftKey) {
		e.preventDefault();
	}
});

function clientSetup() {
	if (setupDocumentDone) {
		//Add listner for setup to complete
		var setupCallback = new Listener("login complete", function (payload) {
			selfName = payload.self;
			isGameAdmin = payload.gameAdmin;
			taxRate = payload.saleTax;

			socialTab.setup(payload.friends, payload.blockedPlayers);
			options.setup(
				payload.malName,
				payload.malLastUpdate,
				payload.settings,
				payload.aniList,
				payload.aniListLastUpdate,
				payload.kitsu,
				payload.kitsuLastUpdate,
				payload.useRomajiNames,
				payload.serverStatuses,
				payload.videoHostNames
			);
			viewChanger.setup();
			hostModal.setup(payload.genreInfo, payload.tagInfo, payload.savedQuizSettings);
			roomBrowser.setup();
			gameChat.setup();
			quizVideoController.setup();
			quiz.setup();
			reportModal.setup();
			volumeController.setup(); //Dependent on quizVideoController, call only after it have been setup
			avatarDrive.setup(
				payload.top5AvatarNominatios,
				payload.top5AllTime,
				payload.top5Montly,
				payload.top5Weekly,
				payload.recentDonations,
				payload.driveTotal,
				payload.freeDonation
			);
			newsManager.setup();
			avatarDriveModal.setup(payload.backerLevel, payload.freeDonation);
			tutorial.setup(payload.tutorial);
			afkKicker.setup();
			qualityController.setup();
			settingRandomizer.setup(payload.genreInfo, payload.tagInfo);
			roomFilter.setup();
			idTranslator.setup(payload.genreInfo, payload.tagInfo);
			expandLibrary.setup(payload.expandCount);
			battleRoyal.setup();
			promoCarousel.setup();
			ranked.setup(payload.rankedState, payload.rankedSerie);
			leaderboardModule.setup(payload.rankedLeaderboards, payload.rankedChampions);
			storeWindow.setup(
				payload.defaultAvatars,
				payload.unlockedDesigns,
				payload.avatar,
				payload.characterUnlockCount,
				payload.avatarUnlockCount,
				payload.emoteGroups,
				payload.rhythm,
				payload.unlockedEmoteIds
			);
			patreon.setup(
				payload.patreonId,
				payload.backerLevel,
				payload.badgeLevel,
				payload.customEmojis,
				payload.patreonBadgeInfo,
				payload.patreonDesynced
			);
			emojiSelector.setup();
			guestRegistrationController.setup(payload.guestAccount);

			hostModal.reset();

			if (payload.restartState) {
				popoutMessages.displayRestartMessage(payload.restartState.msg, payload.restartState.time);
			}

			//Load bootstrap elements
			$('[data-toggle="popover"]').popover();

			$('[data-toggle="tooltip"]').tooltip();

			//Set event to update scrollbar layout when window size changes
			$(window).resize(function () {
				$(".ps").perfectScrollbar("update");
			});

			// Prevent the backspace key from navigating back.
			$(document)
				.unbind("keydown")
				.bind("keydown", function (event) {
					if (event.keyCode === 8) {
						var doPrevent = true;
						var types = [
							"text",
							"password",
							"file",
							"search",
							"email",
							"number",
							"date",
							"color",
							"datetime",
							"datetime-local",
							"month",
							"range",
							"search",
							"tel",
							"time",
							"url",
							"week",
						];
						var d = $(event.srcElement || event.target);
						var disabled = d.prop("readonly") || d.prop("disabled");
						if (!disabled) {
							if (d[0].isContentEditable) {
								doPrevent = false;
							} else if (d.is("input")) {
								var type = d.attr("type");
								if (type) {
									type = type.toLowerCase();
								}
								if (types.indexOf(type) > -1) {
									doPrevent = false;
								}
							} else if (d.is("textarea")) {
								doPrevent = false;
							}
						}
						if (doPrevent) {
							event.preventDefault();
							return false;
						}
					}
				});
			let disabledKeycodes = [9, 33, 34]; //Tab, Page up, page Down. May brake layout in Chrome.
			let disableTabExemptIds = ["grUsername", "grPassword", "grPasswordRepeat", "grEmail"];
			$("#gameContainer").bind("keydown", (event) => {
				if (
					disabledKeycodes.includes(event.keyCode) &&
					(event.keyCode !== 9 || !disableTabExemptIds.includes(event.target.id))
				) {
					event.preventDefault();
				}
			});

			new Listener("force logoff", (data) => {
				displayMessage(
					"Kicked by Server",
					data.reason,
					() => {
						window.location = "/";
					},
					false,
					true
				);
			}).bindListener();

			new Listener("alert", (data) => {
				displayMessage(data.title, data.message, null, data.easyClose);
			}).bindListener();

			new Listener("unknown error", () => {
				displayOption(
					"Unknown Error",
					"An unknown error happened. Restarting the game is recommended, continuing the current session may result in more errors.",
					"Restart",
					"Continue Session",
					() => {
						window.location = "/";
					}
				);
			}).bindListener();

			viewChanger.hideLoadingScreen();
			xpBar.setup(payload.xpInfo, payload.level, payload.credits, payload.tickets); //Do last, to let animation run

			setupCallback.unbindListener();
		});

		setupCallback.bindListener();

		socket.setup(); //Call after all setup listners have been added
	}
}
