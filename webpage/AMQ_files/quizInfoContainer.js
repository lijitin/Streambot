"use strict";

function QuizInfoContainer() {
	this.$name = $("#qpAnimeName");
	this.$nameContainer = $("#qpAnimeNameContainer");
	this.$nameHider = $("#qpAnimeNameHider");
	this.$currentSongCount = $("#qpCurrentSongCount");
	this.$totalSongCount = $("#qpTotalSongCount");


	this.$songName = $("#qpSongName");
	this.$songArtist = $("#qpSongArtist");
	this.$songType = $("#qpSongType");
	this.$songVideoLink = $("#qpSongVideoLink");
	this.$infoHider = $("#qpInfoHider");

	this.$rateContainers = $(".qpSingleRateContainer");
	this.$upvoteContainer = $("#qpUpvoteContainer");
	this.$downvoteContainer = $("#qpDownvoteContainer");
	this.$reportContainer = $("#qpReportContainer");

	this.$reportFeedbackContainer = $("#qpReportFeedbackContainer");
	this.$reportFeedbackInput = $("#qpFeedbackInput");
	this.$adminReportCheckbox = $("#qpAdminReport");

	this.REPORT_AUTO_REASONS = [
		"Wrong Song",
		"Bad Quality",
		"Background Noise",
		"Broken Video"
	];

	this.reportAwesomeplete = new AmqAwesomeplete(this.$reportFeedbackInput[0], {
		list: this.REPORT_AUTO_REASONS,
		minChars: 0
	});

	this.$reportFeedbackInput.focus(() => {
		if (this.reportAwesomeplete.ul.childNodes.length === 0) {
			this.reportAwesomeplete.minChars = 0;
			this.reportAwesomeplete.evaluate();
		}
		this.reportAwesomeplete.open();
	});

	this.$reportFeedbackInput.keypress((event) => {
		//On Enter
		if (event.which === 13) {
			this.$reportFeedbackInput.addClass('glow');
		} else {
			this.$reportFeedbackInput.removeClass('glow');
		}
	});

	this.$reportFeedbackInput.on('awesomplete-selectcomplete', () => {
		this.$reportFeedbackInput.addClass('glow');
	});

	this.$reportFeedbackInput.blur(() => {
		this.reportAwesomeplete.close();
	});

	this.reportSelected = false;
	this.likeSelected = false;
	this.dislikeSelected = false;

	this.FEEDBACK_TYPE = {
		NONE: 0,
		LIKE: 1,
		DISLIKE: 2,
		REPORT: 3
	};

	if (isGameAdmin) {
		this.$reportFeedbackContainer.addClass('adminEnabled');
	}
}

QuizInfoContainer.prototype.showInfo = function (animeNames, songName, artist, type, typeNumber, urls) {
	let animeName;
	if(options.useRomajiNames){
		animeName = animeNames.romaji;
	} else {
		animeName = animeNames.english;
	}
	this.$name.text(animeName);
	this.fitTextToContainer();
	this.$songName.text(songName);
	this.$songArtist.text(artist);
	this.$songType.text(this.convertTypeToText(type, typeNumber));

	let targetHost = quizVideoController.getCurrentHost();
	let targetResolution = quizVideoController.getCurrentResolution();

	let hostUrls;
	if(urls[targetHost]) {
		hostUrls = urls[targetHost];
	} else {
		console.log('debug: ' + JSON.stringify({
			targetHost,
			urls
		}));
		hostUrls = Object.values(urls)[0];
	}

	let sourceUrl;
	if(hostUrls[targetResolution]) {
		sourceUrl = hostUrls[targetResolution];
	} else {
		console.log('debug: ' + JSON.stringify({
			targetResolution,
			urls
		}));
		sourceUrl = Object.values(hostUrls)[0];
	}

	this.$songVideoLink.attr('href', sourceUrl);

	this.showContent();
};

QuizInfoContainer.prototype.fitTextToContainer = function() {
	fitTextToContainer(this.$name, this.$nameContainer, 25, 11);
};

QuizInfoContainer.prototype.convertTypeToText = function (type, typeNumber) {
	switch (type) {
		case 1: return "Opening " + typeNumber;
		case 2: return "Ending " + typeNumber;
		case 3: return "Insert Song";
	}
};

QuizInfoContainer.prototype.showContent = function () {
	this.$nameHider.addClass('hide');
	this.$infoHider.addClass('hide');
};

QuizInfoContainer.prototype.hideContent = function () {
	this.$nameHider.removeClass('hide');
	this.$infoHider.removeClass('hide');
};

QuizInfoContainer.prototype.setCurrentSongCount = function (count) {
	this.$currentSongCount.text(count);
};

QuizInfoContainer.prototype.setTotalSongCount = function (count) {
	this.$totalSongCount.text(count);
};

QuizInfoContainer.prototype.sendSongFeedback = function () {
	let resolution = quizVideoController.getCurrentResolution();
	let host = quizVideoController.getCurrentHost();
	let songId = quizVideoController.getCurrentSongId();
	let adminReport = this.$adminReportCheckbox.prop('checked');

	if (resolution != undefined && songId != undefined && adminReport != undefined) {
		let feedbackPackage;

		if (this.likeSelected) {
			feedbackPackage = {
				feedbackType: this.FEEDBACK_TYPE.LIKE
			};
		} else if (this.dislikeSelected) {
			feedbackPackage = {
				feedbackType: this.FEEDBACK_TYPE.DISLIKE
			};
		} else if (this.reportSelected) {
			feedbackPackage = {
				feedbackType: this.FEEDBACK_TYPE.REPORT,
				reportComment: this.$reportFeedbackInput.val()
			};
		} else {
			feedbackPackage = {
				feedbackType: this.FEEDBACK_TYPE.NONE
			};
		}

		feedbackPackage.resolution = resolution;
		feedbackPackage.host = host;
		feedbackPackage.songId = songId;
		feedbackPackage.adminReport = adminReport;

		socket.sendCommand({
			type: "quiz",
			command: "song feedback",
			data: feedbackPackage
		});
	}
};

QuizInfoContainer.prototype.resetFeedbackSelects = function () {
	this.$rateContainers.removeClass("selected");
	this.$reportFeedbackContainer.removeClass('open');
	this.$adminReportCheckbox.prop('checked', false);
	this.$reportFeedbackInput.val('');
	this.$reportFeedbackInput.removeClass('glow');
	this.$reportFeedbackInput.blur();

	this.reportSelected = false;
	this.likeSelected = false;
	this.dislikeSelected = false;
};

QuizInfoContainer.prototype.reset = function () {
	this.setTotalSongCount('?');
	this.setCurrentSongCount('?');
	this.hideContent();
	this.resetFeedbackSelects();
};

QuizInfoContainer.prototype.upvoteSong = function () {
	if (!this.likeSelected) {
		this.resetFeedbackSelects();
		this.likeSelected = true;
		this.$upvoteContainer.addClass("selected");
	} else {
		this.resetFeedbackSelects();
	}
};

QuizInfoContainer.prototype.downvoteSong = function () {
	if (!this.dislikeSelected) {
		this.resetFeedbackSelects();
		this.dislikeSelected = true;
		this.$downvoteContainer.addClass("selected");
	} else {
		this.resetFeedbackSelects();
	}

};

QuizInfoContainer.prototype.reportSong = function () {
	if (!this.reportSelected) {
		this.resetFeedbackSelects();
		this.reportSelected = true;
		this.$reportContainer.addClass("selected");
		this.$reportFeedbackContainer.addClass('open');
		this.$reportFeedbackInput.focus();
	} else {
		this.resetFeedbackSelects();
	}
};