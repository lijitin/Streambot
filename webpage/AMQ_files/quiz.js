'use strict';
/*exported quiz*/

class Quiz {
	constructor() {
		this.$view = $("#quizPage");
		this.$inputContainer = $("#qpAnswerInputContainer");
		this.$startReturnToLobbyButton = $("#qpReturnToLobbyButton");

		this.inputFocused = false;
		this.onLastSong = false;
		this.settingUpFirstSong = false;
		this.inQuiz = false;
		this.soloMode = false;
		this._groupSlotMap = {};

		this.infoContainer;
		this.returnVoteController;
		this.videoTimerBar;
		this.answerInput;
		this.skipController;
		this.avatarContainer;
		this.scoreboard;
		this.videoOverlay;

		this.nextSongPlayLength;
		this.autoVoteSkipTimeout;
		this.players;
		this.isSpectator;
		this.skipSettings;

		this.$inputContainer.click(() => {
			if (!this.isSpectator) {
				this.setInputInFocus(true);
			}
		});

		$(window).resize(() => {
			if (this.inQuiz) {
				this.scoreboard.updateLayout();
				this.avatarContainer.updateAvatarLayout();
			}
		});

		this._noSongsListner = new Listener("Quiz no songs", function () {
			gameChat.systemMessage('No songs matches quiz settings, returning to lobby', '');
		});

		this._quizOverListner = new Listener('quiz over', function (roomSettings) {
			lobby.setupLobby(roomSettings, this.isSpectator);
			viewChanger.changeView("lobby", {
				supressServerMsg: true,
				keepChatOpen: true
			});
		}.bind(this));

		this._sendFeedbackListner = new Listener('send feedback', function () {
			this.infoContainer.sendSongFeedback();
		}.bind(this));

		this._playerLeaveListner = new Listener("Player Left", function (change) {
			this.players[change.player.gamePlayerId].avatarDisabled = true;
			this.scoreboard.disableEntry(change.player.gamePlayerId);
			if (Object.keys(this.players).length === 0) {
				//all players left, tell spectators game is closed
				displayMessage("All players have left", "Game room closed.");
				viewChanger.changeView("roomBrowser");
			} else if (change.newHost) {
				this.players[change.player.gamePlayerId].host = false;
				this.promoteHost(change.newHost);
			}
		}.bind(this));

		this._playerRejoiningListener = new Listener("Rejoining Player", function (payload) {
			this.players[payload.gamePlayerId].avatarDisabled = false;
			this.scoreboard.enableEntry(payload.gamePlayerId);
		}.bind(this));

		this._spectatorLeftListener = new Listener("Spectator Left", function (payload) {
			if (payload.newHost) {
				this.promoteHost(payload.newHost);
			}
		}.bind(this));

		this._quizreadyListner = new Listener("quiz ready", function (data) {
			this.infoContainer.setTotalSongCount(data.numberOfSongs);
			this.infoContainer.setCurrentSongCount(0);
			quizVideoController.loadNextVideo();
		}.bind(this));

		this._nextVideoInfoListener = new Listener("quiz next video info", function (data) {
			quizVideoController.nextVideoInfo(data.videoInfo, data.playLength, data.startPont, true, null, data.playbackSpeed);
			this.nextSongPlayLength = data.playLength;
		}.bind(this));

		this._playNextSongListner = new Listener("play next song", function (data) {
			if (!this.settingUpFirstSong) {
				this.infoContainer.sendSongFeedback();
			}
			this.settingUpFirstSong = false;

			this.videoOverlay.hideTextOverlay();
			this.videoOverlay.hideWaitingBuffering();

			this.infoContainer.setCurrentSongCount(data.songNumber);
			this.infoContainer.hideContent();
			this.infoContainer.resetFeedbackSelects();

			this.scoreboard.resetCorrect();

			Object.values(this.players).forEach(quizPlayer => {
				quizPlayer.answer = null;
				quizPlayer.avatarPose = cdnFormater.AVATAR_POSE_IDS.THINKING;
			});

			if (!this.isSpectator) {
				this.answerInput.resetAnswerState();
				this.answerInput.clear();
				this.answerInput.enable();
			}

			if (this.skipSettings.guessing) {
				this.skipController.reset();
				this.skipController.enable();
			} else {
				this.skipController.disable();
			}


			quizVideoController.playNextVideo();

			this.onLastSong = data.onLastSong;

			if (this.onLastSong) {
				this.returnVoteController.toggleVoteButton(false);
			}

			this.videoTimerBar.updateState(data.progressBarState);
			this.videoOverlay.startTimer(data.time);
		}.bind(this));

		this._playerAnswerListner = new Listener("player answers", function (data) {
			data.answers.forEach((answer) => {
				let quizPlayer = this.players[answer.gamePlayerId];
				quizPlayer.answer = answer.answer;
				quizPlayer.unknownAnswerNumber = answer.answerNumber;
			});

			if (!this.isSpectator) {
				this.answerInput.showSubmitedAnswer();
				this.answerInput.resetAnswerState();
			}

			this.videoTimerBar.updateState(data.progressBarState);
		}.bind(this));

		this._resultListner = new Listener("answer results", function (result) {
			quizVideoController.replayVideo();
			this.videoOverlay.hide();

			if (!this.isSpectator) {
				this.skipController.highlight = true;
			}
			if (this.skipSettings.replay) {
				this.skipController.enable();
			}
			if (!this.isSpectator && options.autoVoteSkipReplay) {
				this.skipController.autoVoteSkip(2000);
			}

			this.videoTimerBar.updateState(result.progressBarState);

			result.players.forEach((playerResult) => {
				this.players[playerResult.gamePlayerId].updateAnswerResult(playerResult);
			});
			this.scoreboard.updateStandings(result.players);
			
			let groupUpdateTimeout = QuizAvatarSlot.prototype.GROUP_CHANGE_ANIMATION_LENGTH / 2 * 1000;
			this.avatarContainer.updateGroupSlotWithDelay(result.groupMap, groupUpdateTimeout);
			let oldGroupNumber = this.ownGroupSlot;
			this.groupSlotMap = result.groupMap;
			let newGroupNumber = this.ownGroupSlot;
			setTimeout(() => {
				if (oldGroupNumber === this.avatarContainer.currentGroup && oldGroupNumber !== newGroupNumber) {
					this.selectAvatarGroup(newGroupNumber);
				}
			}, groupUpdateTimeout);
			let songInfo = result.songInfo;
			this.infoContainer.showInfo(songInfo.animeNames, songInfo.songName, songInfo.artist, songInfo.type, songInfo.typeNumber, songInfo.urlMap);

			quizVideoController.loadNextVideo();
		}.bind(this));

		this._endResultListner = new Listener("quiz end result", function (payload) {
			this.skipController.disable();
			this.videoOverlay.hideTextOverlay();

			this.scoreboard.resetCorrect();

			Object.values(this.players).forEach(quizPlayer => {
				quizPlayer.answer = null;
			});

			payload.resultStates.forEach(result => {
				let quizPlayer = this.players[result.gamePlayerId];
				if (quizPlayer) {
					quizPlayer.avatarPose = result.pose;
					if (result.endPosition <= 3) {
						quizPlayer.finalPosition = result.endPosition;
					}
				}
			});

			this.videoTimerBar.updateState(payload.progressBarState);
		}.bind(this));

		this._waitingForBufferingListner = new Listener("quiz waiting buffering", function () {
			if (this.settingUpFirstSong) {
				this.videoOverlay.showWaitingBuffering();
			} else {
				this.videoOverlay.showTextOverlay('Waiting Buffering');
			}
		}.bind(this));

		this._xpCreditGainListner = new Listener("quiz xp credit gain", function (data) {
			this.players[data.gamePlayerId].fireRewardEvent(data.xpInfo, data.level, data.credit, data.tickets);
		}.bind(this));

		this._noPlayersListner = new Listener("quiz no players", function () {
			displayMessage("All players have left", "Game room closed.");
			viewChanger.changeView('roomBrowser', { supressServerMsg: true });
		});

		this._playerAnswerListener = new Listener("player answered", function (payload) {
			this.players[payload.gamePlayerId].avatarPose = cdnFormater.AVATAR_POSE_IDS.WAITING;
		}.bind(this));

		this._skippingVideoListener = new Listener('quiz overlay message', function (message) {
			this.videoOverlay.showTextOverlay(message);
			this.skipController.stateMessage = 'Voted<br/>Skip';
		}.bind(this));

		this._skipMessageListener = new Listener("quiz skip message", function (message) {
			this.skipController.stateMessage = message;
		}.bind(this));

		this._returnVoteStartListner = new Listener("return lobby vote start", function (payload) {
			this.returnVoteController.startVote(payload.invokingHost === selfName, this.isSpectator, payload.voteDuration);
		}.bind(this));

		this._guessPhaseOverListner = new Listener("guess phase over", function () {
			this.answerInput.handleGuessPhaseOver();
			this.videoOverlay.showAnswerText();
			this.videoOverlay.hideTextOverlay();
			this.skipController.disable();
		}.bind(this));

		this._errorListener = new Listener("quiz fatal error", function () {
			displayMessage("Fatal Server Error Doing Quiz", "Returning to lobby");
		});

		this._nameChangeListner = new Listener("player name change", function (payload) {
			this.players[payload.gamePlayerId].name = payload.newName;
		}.bind(this));
	}

	setup() {
		this.videoOverlay = new VideoOverlay();
		this.infoContainer = new QuizInfoContainer();
		this.returnVoteController = new ReturnVoteController(this.videoOverlay);
		this.videoTimerBar = new TimerBar($("#qpVideoProgressBar"));
		this.skipController = new QuizSkipController();
		this.avatarContainer = new QuizAvatarContainer();
		this.scoreboard = new QuizScoreboard();
		this.answerInput = new QuizAnswerInput(this.skipController);
		this.answerInput.disable();
	}

	openView(callback) {
		this.$view.removeClass("hidden");
		if (!gameChat.isShown()) {
			gameChat.openView();
		}

		this.answerInput.clear();
		this.inQuiz = true;

		this.scoreboard.updateLayout();
		this.scoreboard.updateGroupLayout(this.groupSlotMap);
		let groupSlot = this.ownGroupSlot;
		if(groupSlot != null) {
			this.scoreboard.scrollToGroup(groupSlot);
		}
		this.avatarContainer.updateAvatarLayout();

		Object.values(this.players).forEach(quizPlayer => {
			quizPlayer.updatePose();
		});

		this._noSongsListner.bindListener();
		this._quizOverListner.bindListener();
		this._playerLeaveListner.bindListener();
		this._playerRejoiningListener.bindListener();
		this._spectatorLeftListener.bindListener();
		this._quizreadyListner.bindListener();
		this._nextVideoInfoListener.bindListener();
		this._playNextSongListner.bindListener();
		this._playerAnswerListner.bindListener();
		this._resultListner.bindListener();
		this._endResultListner.bindListener();
		this._xpCreditGainListner.bindListener();
		this._noPlayersListner.bindListener();
		this._playerAnswerListener.bindListener();
		this._waitingForBufferingListner.bindListener();
		this._skippingVideoListener.bindListener();
		this._skipMessageListener.bindListener();
		this._quizOverListner.bindListener();
		this._sendFeedbackListner.bindListener();
		this._returnVoteStartListner.bindListener();
		this._guessPhaseOverListner.bindListener();
		this._errorListener.bindListener();
		this._nameChangeListner.bindListener();

		callback();
		this.videoOverlay.setFontSize();
		this.infoContainer.fitTextToContainer();
	}

	closeView(args) {
		if (!args.supressServerMsg) {
			this.infoContainer.sendSongFeedback();

			socket.sendCommand({
				type: "lobby",
				command: "leave game"
			});
		}

		this._noSongsListner.unbindListener();
		this._quizOverListner.unbindListener();
		this._playerLeaveListner.unbindListener();
		this._playerRejoiningListener.unbindListener();
		this._spectatorLeftListener.unbindListener();
		this._quizreadyListner.unbindListener();
		this._quizreadyListner.unbindListener();
		this._nextVideoInfoListener.unbindListener();
		this._playNextSongListner.unbindListener();
		this._playerAnswerListner.unbindListener();
		this._resultListner.unbindListener();
		this._endResultListner.unbindListener();
		this._xpCreditGainListner.unbindListener();
		this._noPlayersListner.unbindListener();
		this._playerAnswerListener.unbindListener();
		this._waitingForBufferingListner.unbindListener();
		this._skippingVideoListener.unbindListener();
		this._skipMessageListener.unbindListener();
		this._quizOverListner.unbindListener();
		this._sendFeedbackListner.unbindListener();
		this._returnVoteStartListner.unbindListener();
		this._guessPhaseOverListner.unbindListener();
		this._errorListener.unbindListener();
		this._nameChangeListner.unbindListener();

		this.answerInput.active = false;
		this.answerInput.resetAnswerState();
		quizVideoController.reset();
		this.videoOverlay.reset();
		this.videoTimerBar.reset();
		this.returnVoteController.reset();
		this.avatarContainer.reset();
		this.players = null;

		this.inQuiz = false;

		this.$view.addClass("hidden");
		if (!args.keepChatOpen) {
			gameChat.closeView();
		}
	}

	setupQuiz(players, isSpectator, quizState, settings, isHost, groupSlotMap, soloMode) {
		this.gameMode = settings.gameMode;
		this.soloMode = soloMode;
		let lifeCountGameMode = this.gameMode === 'Last Man Standing' || this.gameMode === 'Battle Royale';
		this.players = {};
		this.ownGamePlayerId = null;
		players.forEach(player => {
			this.players[player.gamePlayerId] = new QuizPlayer(player.name, player.level, player.gamePlayerId, player.host, player.avatarInfo, player.points, player.pose, player.inGame === false, lifeCountGameMode, settings.lives);
			if(player.name === selfName) {
				this.ownGamePlayerId = player.gamePlayerId;
			}
		});
		this.isSpectator = isSpectator;
		this.settingUpFirstSong = true;
		this.onLastSong = false;
		this.groupSlotMap = groupSlotMap;
		this.skipSettings = {
			guessing: settings.modifiers.skipGuessing,
			replay: settings.modifiers.skipReplay
		};

		this.answerInput.inFocus = false;
		this.answerInput.active = !this.isSpectator;
		this.skipController.disable(true);
		this.skipController.votePreviewMode = isSpectator;
		
		this.scoreboard.reset();
		this.scoreboard.setGameMode(this.gameMode);
		this.scoreboard.setupGroups(groupSlotMap);

		this.avatarContainer.setupAvatars(Object.values(this.players), groupSlotMap);
		if (!this.isSpectator) {
			this.answerInput.updateAutocomplete();
			this.scoreboard.setActiveGroup(this.ownGroupSlot);
		} else {
			this.scoreboard.setActiveGroup("1");
		}
		
		this.answerInput.disable();

		quizVideoController.hideAll();

		gameChat.toggleQueueTab(settings.modifiers.queueing);
		gameChat.setQueueButtonState(isSpectator);
		gameChat.slowModeActive = this.gameMode === 'Ranked';
		gameChat.displayJoinLeaveMessages = this.gameMode !== 'Ranked';

		if (isHost) {
			this.$startReturnToLobbyButton.removeClass('hide');
		} else {
			this.$startReturnToLobbyButton.addClass('hide');
		}

		this.videoOverlay.hideWaitingBuffering();

		this.infoContainer.reset();

		if (!quizState || Quiz.prototype.QUIZ_STATES.LOADING === quizState.state) {
			//Set up basic players, if not setting up an exsisting state
			this.scoreboard.setupPlayers(this.players, settings.lives);
			this.videoOverlay.showLoadingText();
		} else {
			this.scoreboard.setupPlayersWithScore(quizState.players);

			hostModal.changeSettings(settings);

			quizState.players.forEach(playerState => {
				let quizPlayer = this.players[playerState.gamePlayerId];
				quizPlayer.state = playerState;

				if (quizState.state === this.QUIZ_STATES.END_PHASE && playerState.pos <= 3) {
					//TODO make sure end result is shown when players start spectating
					quizPlayer.finalPosition = playerState.pos;
				}
			});

			this.infoContainer.setTotalSongCount(quizState.totalSongNumbers);
			this.infoContainer.setCurrentSongCount(quizState.songNumber);

			this.settingUpFirstSong = quizState.songNumber === 0;

			this.videoTimerBar.updateState(quizState.progressBarState);

			if (quizState.returnVoteState) {
				this.returnVoteController.updateState(quizState.returnVoteState, this.isSpectator);
			}

			if (quizState.lastSkipMessage) {
				this.skipController.stateMessage = quizState.lastSkipMessage;
			}
			if (this.SKIP_PHASES.includes(quizState.state)) {
				this.skipController.enable();
			}
			
			if (!this.isSpectator && Quiz.prototype.QUIZ_STATES.GUESS_PHASE === quizState.state) {
				this.answerInput.resetAnswerState();
				this.answerInput.clear();
				this.answerInput.enable();
			}

			if (quizState.songInfo && quizState.songInfo.videoInfo) {
				quizVideoController.nextVideoInfo(quizState.songInfo.videoInfo, quizState.songInfo.playLength, quizState.songInfo.startPoint, true, quizState.songTimer, quizState.songInfo.playbackSpeed);
				quizVideoController.loadNextVideo();
			}

			if (this.SHOW_TIMER_PHASES.includes(quizState.state)) {
				this.videoOverlay.startTimer(quizState.guessTime - quizState.songTimer);
			} else if (quizState.state === this.QUIZ_STATES.ANSWER_PHASE) {
				this.videoOverlay.showAnswerText();
				this.videoOverlay.hideTextOverlay();
			} else if (quizState.state === this.QUIZ_STATES.LOADING) {
				this.videoOverlay.showLoadingText();
			} else if (quizState.state === this.QUIZ_STATES.WAITING_BUFFERING) {
				if (this.settingUpFirstSong) {
					this.videoOverlay.showWaitingBuffering();
				} else {
					this.videoOverlay.showTextOverlay('Waiting Buffering');
				}
			} else {
				this.videoOverlay.hide();
			}

			if (quizState.nextVideoInfo && quizState.nextVideoInfo.videoInfo) {
				quizVideoController.nextVideoInfo(quizState.nextVideoInfo.videoInfo, quizState.nextVideoInfo.playLength, quizState.nextVideoInfo.startPoint, true, null, quizState.nextVideoInfo.playbackSpeed);
				this.nextSongPlayLength = quizState.nextVideoInfo.playLength;
				if (!this.CURRENT_BUFFER_FOCUS_PHASES.includes(quizState.state)) {
					quizVideoController.loadNextVideo();
				}
			}

			if (quizState.songInfo && quizState.songInfo.animeNames) {
				let songInfo = quizState.songInfo;
				this.infoContainer.showInfo(songInfo.animeNames, songInfo.songName, songInfo.artist, songInfo.type, songInfo.typeNumber, songInfo.urlMap);
			}
		}
	}

	setInputInFocus(inFocus) {
		this.answerInput.inFocus = inFocus;
	}

	skipClicked() {
		this.skipController.toggle();
	}

	promoteHost(newHostName) {
		Object.values(this.players).some(gamePlayer => {
			if (gamePlayer.name === newHostName) {
				gamePlayer.host = true;
				if (newHostName === selfName) {
					this.$startReturnToLobbyButton.removeClass('hide');
				}
				return true;
			}
		});
	}

	leave() {
		let targetPage = this.gameMode === 'Ranked' || this.soloMode ? 'main' : 'roomBrowser';
		if (this.isSpectator) {
			viewChanger.changeView(targetPage);
		} else {
			displayOption("Leave Quiz?", null, "Leave", "Stay", () => {
				viewChanger.changeView(targetPage);
			}, () => { });
		}
	}

	viewSettings() {
		hostModal.setModeGameSettings(false, this.soloMode);
		hostModal.showSettings();
		$("#mhHostModal").modal('show');
	}

	videoReady(songId) {
		if (!this.isSpectator && this.inQuiz) {
			socket.sendCommand({
				type: "quiz",
				command: "video ready",
				data: {
					songId: songId
				}
			});
		}
	}

	startReturnLobbyVote() {
		socket.sendCommand({
			type: 'quiz',
			command: 'start return lobby vote'
		});
	}

	selectAvatarGroup(number) {
		this.avatarContainer.currentGroup = number;
		this.scoreboard.setActiveGroup(number);
		this.scoreboard.scrollToGroup(number);
	}

	get ownGroupSlot() {
		if(this.ownGamePlayerId != null) {
			return Object.keys(this.groupSlotMap).find((groupNumber) => {return this.groupSlotMap[groupNumber].includes(this.ownGamePlayerId);});
		}
	}

	get groupSlotMap() {
		return this._groupSlotMap;
	}

	set groupSlotMap(newMap) {
		Object.keys(newMap).forEach(groupNumber => {
			newMap[groupNumber].forEach(gamePlayerId => {
				this.players[gamePlayerId].groupNumber = groupNumber;
			});
		});
		this._groupSlotMap = newMap;
	}
}

Quiz.prototype.QUIZ_STATES = {
	PRESETUP: 0,
	LOADING: 1,
	WAITING_FOR_READY: 2,
	GUESS_PHASE: 3,
	ANSWER_PHASE: 4,
	SHOW_ANSWER_PHASE: 5,
	END_PHASE: 6,
	WAITING_BUFFERING: 7,
	WAITING_ANSWERS_PHASE: 8,
	BATTLE_ROYAL: 9
};
Quiz.prototype.SKIP_PHASES = [
	Quiz.prototype.QUIZ_STATES.GUESS_PHASE,
	Quiz.prototype.QUIZ_STATES.WAIT_SHOW_ANSWER_PHASE,
	Quiz.prototype.QUIZ_STATES.SHOW_ANSWER_PHASE
];
Quiz.prototype.SHOW_TIMER_PHASES = [
	Quiz.prototype.QUIZ_STATES.GUESS_PHASE,
	Quiz.prototype.QUIZ_STATES.WAIT_SHOW_ANSWER_PHASE
];
Quiz.prototype.CURRENT_BUFFER_FOCUS_PHASES = [
	Quiz.prototype.QUIZ_STATES.GUESS_PHASE,
	Quiz.prototype.QUIZ_STATES.WAIT_SHOW_ANSWER_PHASE,
	Quiz.prototype.QUIZ_STATES.ANSWER_PHASE
];

var quiz = new Quiz();