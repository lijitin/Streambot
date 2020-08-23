"use strict";
/*exported QuizScoreboard*/

function QuizScoreboard() {
	this.$container = $('#qpStandingContainer');
	this._$animeCenterContainer = $("#qpAnimeCenterContainer");
	this.$quizScoreboardItemContainer = $("#qpStandingItemContainer");
	this.$quizScoreboardEntryContainer = $("#qpScoreBoardEntryContainer");
	this.$qpStandingCorrectCount = $("#qpStandingCorrectCount");
	this.groups = {};
	this.playerEntries = {};
	this.SCOREBOARD_BOTTOM_MARGIN = 20; //px
	this.SCOREBOARD_TITLE_HEIGHT = 46.4; //px
	this.gameMode = null;

	this.PLAYER_NEEDED_FOR_SHOWING_CORRECT = 9;
	this.showCorrect = false;

	this.$quizScoreboardItemContainer.perfectScrollbar({
		suppressScrollX: true,
		minScrollbarLength: 50
	});
}

QuizScoreboard.prototype.updateLayout = function () {
	let animeCenterContainerHeight = this._$animeCenterContainer.outerHeight(true);
	let topOffset = this.$container.outerHeight(true) - this.$container.outerHeight();
	let scoreboardHeight = animeCenterContainerHeight - topOffset - this.SCOREBOARD_BOTTOM_MARGIN;
	this.$container.css('max-height', scoreboardHeight);
	this.$quizScoreboardItemContainer
		.css('max-height', scoreboardHeight - this.SCOREBOARD_TITLE_HEIGHT)
		.perfectScrollbar('update');
	
	Object.values(this.playerEntries).forEach(entry => {
		entry.updateLayout();
	});
};

QuizScoreboard.prototype.reset = function () {
	Object.values(this.playerEntries).forEach(entry => {
		entry.remove();
	});
	Object.values(this.groups).forEach(entry => {
		entry.remove();
	});
	this.playerEntries = {};
	this.groups = {};
	this.gameMode = null;
	this.$qpStandingCorrectCount.addClass('hide');
};

QuizScoreboard.prototype.setGameMode = function (gameMode) {
	this.gameMode = gameMode;
};

QuizScoreboard.prototype.setupGroups = function (groupMap) {
	if (Object.keys(groupMap).length > 1) {
		Object.keys(groupMap).forEach(groupNumber => {
			let entry = new ScoreBoardGroup(groupNumber);
			this.groups[groupNumber] = entry;
			this.$quizScoreboardItemContainer.append(entry.$group);
		});
	}
};

QuizScoreboard.prototype.updateGroupLayout = function (groupMap) {
	if (Object.keys(groupMap).length > 1) {
		Object.keys(groupMap).forEach(groupNumber => {
			let topOffset = 999999;
			let bottomOffset = 0;
			groupMap[groupNumber].forEach(gamePlayerId => {
				let currentTopOffset = this.playerEntries[gamePlayerId].positionFromTop;
				let currentBottomOffset = currentTopOffset + this.playerEntries[gamePlayerId].height;
				if (currentTopOffset < topOffset) {
					topOffset = currentTopOffset;
				}
				if (currentBottomOffset > bottomOffset) {
					bottomOffset = currentBottomOffset;
				}
			});
			this.groups[groupNumber].updatePosition(topOffset, bottomOffset);
		});
	}
};

QuizScoreboard.prototype.setActiveGroup = function (groupNumber) {
	Object.keys(this.groups).forEach(groupKey => {
		this.groups[groupKey].active = groupKey === groupNumber;
	});
};

QuizScoreboard.prototype.setupPlayers = function (players, lives) {
	let startGuessCount = this.gameMode === 'Quick Draw' || this.gameMode === 'Last Man Standing' || this.gameMode === 'Battle Royale' ? 0 : undefined;
	let startScore = this.gameMode === 'Last Man Standing' || this.gameMode === 'Battle Royale' ? lives : 0;
	this.showCorrect = Object.values(players).length >= this.PLAYER_NEEDED_FOR_SHOWING_CORRECT;
	Object.values(players).sort((a, b) => {
		return a.gamePlayerId - b.gamePlayerId;
	}).forEach((player, index) => {
		let life = player.avatarDisabled ? 0 : startScore;
		let entry = new ScoreBoardEntry(player.name, life, 1, startGuessCount, this.getScoreTitle(), index, player.inGame);
		this.$quizScoreboardEntryContainer.append(entry.$entry);
		this.playerEntries[player.gamePlayerId] = entry;
	});
	this.$quizScoreboardEntryContainer.height(Object.keys(players).length * ScoreBoardEntry.prototype.ENTRY_HEIGHT);
};

QuizScoreboard.prototype.setupPlayersWithScore = function (players) {
	this.showCorrect = players.length >= this.PLAYER_NEEDED_FOR_SHOWING_CORRECT;
	let correctCount = 0;
	let gotCorrect = false;
	players.forEach((player) => {
		let entry = new ScoreBoardEntry(player.name, player.score, player.position, player.correctGuesses, this.getScoreTitle(), player.positionSlot, player.inGame);
		if(this.showCorrect) {
			entry.correct = player.correct;
			gotCorrect = true;
			if(player.correct) {
				correctCount++;
			}
		}
		this.$quizScoreboardEntryContainer.append(entry.$entry);
		this.playerEntries[player.gamePlayerId] = entry;
	});
	this.$quizScoreboardEntryContainer.height(players.length * ScoreBoardEntry.prototype.ENTRY_HEIGHT);
	if(gotCorrect) {
		this.showCorrectCount(correctCount);
	}
};

QuizScoreboard.prototype.updateStandings = function (players) {
	let correctCount = 0;
	players.forEach(player => {
		let entry = this.playerEntries[player.gamePlayerId];
		entry.position = player.position;
		entry.boardPosition = player.positionSlot;
		entry.score = player.score;
		entry.guessCount = player.correctGuesses;
		if(this.showCorrect) {
			entry.correct = player.correct;
			if(player.correct) {
				correctCount++;
			}
		}
	});
	if(this.showCorrect) {
		this.showCorrectCount(correctCount);
	}
};

QuizScoreboard.prototype.scrollToGroup = function(groupNumber) {
	if (Object.keys(this.groups).length > 1) {
		this.$quizScoreboardItemContainer.animate({
			scrollTop: this.groups[groupNumber].topOffset - 3
		}, 1000);
	}
};

QuizScoreboard.prototype.getScoreTitle = function () {
	if (this.gameMode === 'Last Man Standing' || this.gameMode === 'Battle Royale') {
		return 'Lives';
	} else {
		return 'Points';
	}
};

QuizScoreboard.prototype.disableEntry = function(gamePlayerId) {
	this.playerEntries[gamePlayerId].disabled = true;
};

QuizScoreboard.prototype.enableEntry = function(gamePlayerId) {
	this.playerEntries[gamePlayerId].disabled = false;
};

QuizScoreboard.prototype.resetCorrect = function () {
	if(this.showCorrect) {
		Object.values(this.playerEntries).forEach((entry) => {
			entry.correct = false;
		});
		this.$qpStandingCorrectCount.addClass('hide');
	}
};

QuizScoreboard.prototype.showCorrectCount = function(count) {
	this.$qpStandingCorrectCount.text(count);
	this.$qpStandingCorrectCount.removeClass('hide');
};