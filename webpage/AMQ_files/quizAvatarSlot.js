"use strict";
/*exported QuizAvatarSlot*/

class QuizAvatarSlot {
	constructor(name, level, points, avatarInfo, isHost, pose, avatarDisabled, lifeCountEnabled, maxLives) {
		this.$body = $(this.AVATAR_TEMPALTE);
		this.$nameContainer = this.$body.find(".qpAvatarNameContainer > span");
		this.$nameContainerOuter = this.$body.find(".qpAvatarNameContainer");
		this.$levelContainer = this.$body.find(".qpAvatarLevelText");
		this.$pointContainer = this.$body.find(".qpAvatarPointText");
		this.$avatarImage = this.$body.find(".qpAvatarImg");
		this.$imageContainer = this.$body.find(".qpAvatarImgContainer");
		this.$answerContainerText = this.$body.find(".qpAvatarAnswerText");
		this.$answerContainer = this.$body.find(".qpAvatarAnswerContainer");
		this.$hostIconContainer = this.$body.find(".avatarIsHostContainer");
		this.$infoContainer = this.$body.find(".qpAvatarInfoContainer");
		this.$numberContainer = this.$body.find(".qpAvatarNumberContainer");
		this.$centerContainer = this.$body.find(".qpAvatarCenterContainer");

		this._disabled = false;
		this.displayed = false;
		this.currentMaxWidth;
		this.currentMaxHeight;
		this._pose = pose ? pose : cdnFormater.AVATAR_POSE_IDS.BASE;

		let imageVh;
		let avatar = avatarInfo.avatar;
		if (
			this.WIDE_AVATARS.includes(avatar.avatarName) ||
			(avatar.avatarName === "Komugi" && avatar.outfitName === "Tribal Sorcerer") ||
			(avatar.avatarName === "Kyouko" && avatar.outfitName === "Standard" && (avatar.colorName === 'angel' || avatar.colorName === 'demon'))
		) {
			imageVh = 20 + "vh";
		} else {
			imageVh = 15 + "vh";
		}
		this.poseImages = {};
		Object.keys(cdnFormater.AVATAR_POSE_IDS).forEach((pose) => {
			this.poseImages[pose] = new QuizAvatarPoseImage(avatar, pose, imageVh);
		});
		this.$avatarImage
			.attr("sizes", imageVh)
			.addClass(avatar.avatarName)
			.addClass(avatar.outfitName.replace(/ /g, "-"))
			.addClass(avatar.colorName.replace(/ /g, "-"));

		let background = avatarInfo.background;
		let avatarBackgroundSrc = cdnFormater.newAvatarBackgroundSrc(
			background.backgroundVert,
			cdnFormater.BACKGROUND_GAME_SIZE
		);
		this.$imageContainer
			.css("background-image", 'url("' + avatarBackgroundSrc + '")')
			.addClass(background.avatarName)
			.addClass(background.outfitName.replace(/ /g, "-"));

		this.answerNumberController = new AnswerNumberController(this.$answerContainer);
		this.answerStatus = new QuizAvatarAnswerStatus(this.$body);

		if (lifeCountEnabled) {
			this.lifeCounterController = new LifeCounterController(
				this.$body,
				maxLives,
				avatarDisabled ? 0 : maxLives
			);
		} else {
			this.lifeCounterController = null;
		}
		this._name;
		this.name = name;
		this.level = level;
		this.points = points;
		this.host = isHost;
		this.disabled = avatarDisabled;

		// this.$body
		// 	.addClass(avatarInfo.avatar)
		// 	.addClass(avatarInfo.outfit.replace(/ /g, '_'));

		this.$answerContainerText.popover({
			trigger: "hover",
			placement: "top",
			content: "...",
			container: "#quizPage",
		});

		if (selfName !== name) {
			this.$nameContainerOuter.addClass("clickAble").click(() => {
				playerProfileController.loadProfileIfClosed(
					name,
					this.$nameContainerOuter,
					{},
					() => {},
					false,
					this.disabled
				);
			});
		}
	}

	set name(newValue) {
		this._name = newValue;
		this.$nameContainer.text(newValue);
	}

	get name() {
		return this._name;
	}

	set level(newVaule) {
		this.$levelContainer.text(newVaule);
	}

	set points(newValue) {
		this.$pointContainer.text(newValue);
	}

	set host(newValue) {
		if (newValue) {
			this.$hostIconContainer.removeClass("hide");
		} else {
			this.$hostIconContainer.addClass("hide");
		}
	}

	set zIndex(newValue) {
		this.$body.css("z-index", newValue);
	}

	set disabled(newValue) {
		this._disabled = newValue;
		if (newValue) {
			this.$body.addClass("disabled");
			this.updatePose();
		} else {
			this.$body.removeClass("disabled");
			this.updatePose();
		}
	}

	set answer(newAnswer) {
		if (newAnswer == null) {
			this.$answerContainer
				.popover("hide")
				.addClass("hide")
				.removeClass("rightAnswer")
				.removeClass("wrongAnswer");
			this.answerStatus.hide();
			this.answerNumberController.hide();
		} else {
			if (newAnswer === "") {
				newAnswer = "...";
			}
			this.$answerContainerText.text(newAnswer).data("bs.popover").options.content = newAnswer;
			this.$answerContainer.removeClass("hide");
			this.updateAnswerFontSize();
		}
	}

	set answerCorrect(correct) {
		if (correct) {
			this.$answerContainer.addClass("rightAnswer");
		} else {
			this.$answerContainer.addClass("wrongAnswer");
		}
	}

	set finalResult(finalPosition) {
		let colorClass;
		switch (finalPosition) {
			case 1:
				colorClass = "goldGlow";
				break;
			case 2:
				colorClass = "silverGlow";
				break;
			case 3:
				colorClass = "bronzeGlow";
				break;
		}
		this.$answerContainer.addClass("qpResult").addClass(colorClass);
		this.answer = finalPosition;
	}

	set unknownAnswerNumber(number) {
		if (number != undefined) {
			this.answerNumberController.showUnknown(number);
		} else {
			this.answerNumberController.hide();
		}
	}

	set resultAnswerNumber(number) {
		if (number != undefined) {
			this.answerNumberController.showResult(number);
		} else {
			this.answerNumberController.hide();
		}
	}

	set listStatus(status) {
		this.answerStatus.status = status;
	}

	set listScore(score) {
		this.answerStatus.score = score;
	}

	set pose(poseId) {
		this._pose = poseId;
		this.updatePose();
	}

	loadPoses() {
		Object.values(this.poseImages).forEach((poseImage) => {
			poseImage.load(
				function () {
					this.updatePose();
				}.bind(this)
			);
		});
	}

	updatePose() {
		if (!this.displayed) {
			return;
		}
		let img;
		if (this._disabled) {
			img = this.poseImages.BASE.image;
		} else {
			Object.keys(this.poseImages).some((pose) => {
				if (cdnFormater.AVATAR_POSE_IDS[pose] === this._pose) {
					let poseImage = this.poseImages[pose];
					if (poseImage.loaded) {
						img = poseImage.image;
					}
					return true;
				}
			});
		}
		if (!img) {
			img = this.poseImages.BASE.image;
		}

		this.$avatarImage.attr("srcset", img.srcset).attr("src", img.src);
	}

	updateLifeCounter(lifeCount, revivePoints) {
		if (this.lifeCounterController) {
			this.lifeCounterController.updateState(lifeCount, revivePoints);
		}
	}

	setupLifeCounterState(lives, revivePoints) {
		this.lifeCounterController.setupLives(lives, revivePoints);
	}

	updateSize(maxWidth, maxHeight) {
		this.currentMaxWidth = maxWidth;
		this.currentMaxHeight = maxHeight;
		this.$body.css("max-height", maxHeight).css("max-width", maxWidth);
		//Linear function, with 20px size at 1980 screen and 13px at ipad - TODO Fit dynamicly when
		let fontSize = 0.11475409836066 * this.$body.width() + -0.081967213114754;
		this.$infoContainer.css("font-size", fontSize);
		setTimeout(() => {
			fitTextToContainer(this.$nameContainer, this.$nameContainerOuter, 20, 12);
		}, 1);
		//Set avatar number container height and width
		let infoContainerHeight = this.$infoContainer.height();
		let heightCSS = "calc(" + Math.ceil(infoContainerHeight + 6.5) + "px + 2em)";
		this.$numberContainer.css("height", heightCSS);
		let infoContainerHalfCirleHeight = (this.$numberContainer.height() - infoContainerHeight) / 2;
		this.$numberContainer.css("width", infoContainerHalfCirleHeight * 2);
		//Set image max height
		//Calculate the height of the half circle under the info container and add it's height to the info containers height
		let actualInfoHeight = infoContainerHalfCirleHeight + infoContainerHeight;
		let imageMaxHeight = maxHeight - actualInfoHeight;
		let imageMaxWidth = maxWidth * 0.8;

		let imageRatio = 1.3768115942;

		let imageWidth;
		let imageHeight;

		if (imageMaxHeight > imageMaxWidth * imageRatio) {
			imageWidth = imageMaxWidth;
			imageHeight = imageMaxWidth * imageRatio;
		} else {
			imageHeight = imageMaxHeight;
			imageWidth = imageMaxHeight / imageRatio;
		}

		this.$imageContainer.css("height", imageHeight).css("width", imageWidth);
		//Set center containers height
		this.$centerContainer.css("height", imageHeight + actualInfoHeight);

		this.updateAnswerFontSize();
		if (this.lifeCounterController) {
			this.lifeCounterController.resize();
		}
	}

	updateAnswerFontSize() {
		this.$answerContainerText.css("height", "initial");
		fitTextToContainer(this.$answerContainerText, this.$answerContainer, 23, 9);
		this.$answerContainerText.css("height", "");
	}

	remove() {
		this.$body.remove();
	}

	hide() {
		this.$body.addClass("hide");
		this.displayed = false;
	}

	show() {
		this.$body.removeClass("hide");
		this.displayed = true;
		this.loadPoses();
		this.updatePose();
		this.updateSize(this.currentMaxWidth, this.currentMaxHeight);
	}

	runGroupUpAnimation() {
		this.$imageContainer.addClass("blue");
		setTimeout(() => {
			this.$imageContainer.removeClass("blue");
		}, this.GROUP_CHANGE_ANIMATION_LENGTH * 1000);
	}

	runGroupDownAnimation() {
		this.$imageContainer.addClass("red");
		setTimeout(() => {
			this.$imageContainer.removeClass("red");
		}, this.GROUP_CHANGE_ANIMATION_LENGTH * 1000);
	}
}
QuizAvatarSlot.prototype.AVATAR_TEMPALTE = $("#quizAvatarTemplate").html();
QuizAvatarSlot.prototype._COMMAND_TEMPLATE = $("#chatPlayerCommandsTemplate").html();
QuizAvatarSlot.prototype.WIDE_AVATARS = ["Miyu", "Kuriko"];
QuizAvatarSlot.prototype.GROUP_CHANGE_ANIMATION_LENGTH = 4; //sec

class QuizAvatarAnswerStatus {
	constructor($avatarBody) {
		this.$statusContainer = $avatarBody.find(".qpAvatarStatus");
		this.$listBar = this.$statusContainer.find(".qpAvatarListBar");
		this.$statusText = this.$statusContainer.find(".qpAvatarListStatus");
		this.$scoreText = this.$statusContainer.find(".qpAvatarShowScore");
	}

	set status(newStatus) {
		this.$statusText.text(this.convertStatusToLetter(newStatus));

		this.$listBar
			.removeClass("watching")
			.removeClass("completed")
			.removeClass("hold")
			.removeClass("dropped")
			.removeClass("planning")
			.removeClass("looted")
			.addClass(this.convertStatusToClass(newStatus));

		this.show();
	}

	set score(newScore) {
		if (newScore) {
			this.$scoreText.text(newScore);
			this.$statusContainer.addClass("showScore");
		} else {
			this.$statusContainer.removeClass("showScore");
		}
	}

	hide() {
		this.$statusContainer.addClass("hide");
	}

	show() {
		this.$statusContainer.removeClass("hide");
	}

	convertStatusToLetter(status) {
		switch (status) {
			case this.LIST_STATUS.WATCHING:
				return "W";
			case this.LIST_STATUS.COMPLETED:
				return "C";
			case this.LIST_STATUS.ON_HOLD:
				return "H";
			case this.LIST_STATUS.DROPPED:
				return "D";
			case this.LIST_STATUS.PLANNING:
				return "P";
			case this.LIST_STATUS.LOOTED:
				return "L";
			default:
				return "";
		}
	}

	convertStatusToClass(status) {
		switch (status) {
			case this.LIST_STATUS.WATCHING:
				return "watching";
			case this.LIST_STATUS.COMPLETED:
				return "completed";
			case this.LIST_STATUS.ON_HOLD:
				return "hold";
			case this.LIST_STATUS.DROPPED:
				return "dropped";
			case this.LIST_STATUS.PLANNING:
				return "planning";
			case this.LIST_STATUS.LOOTED:
				return "looted";
			default:
				return "";
		}
	}
}

QuizAvatarAnswerStatus.prototype.LIST_STATUS = {
	WATCHING: 1,
	COMPLETED: 2,
	ON_HOLD: 3,
	DROPPED: 4,
	PLANNING: 5,
	LOOTED: 6,
};

class QuizAvatarPoseImage {
	constructor(avatarInfo, pose, imageVh) {
		this.avatarInfo = avatarInfo;
		this.pose = pose;
		this.imageVh = imageVh;
		this.loaded = false;
		this.image;
	}

	load(callback) {
		if (!this.loaded && !this.image) {
			this.image = new Image();
			this.image.onload = function () {
				this.loaded = true;
				callback(this.pose);
			}.bind(this);

			this.image.sizes = this.imageVh;
			this.image.srcset = cdnFormater.newAvatarSrcSet(
				this.avatarInfo.avatarName,
				this.avatarInfo.outfitName,
				this.avatarInfo.optionName,
				this.avatarInfo.optionActive,
				this.avatarInfo.colorName,
				cdnFormater.AVATAR_POSE_IDS[this.pose]
			);
			this.image.src = cdnFormater.newAvatarSrc(
				this.avatarInfo.avatarName,
				this.avatarInfo.outfitName,
				this.avatarInfo.optionName,
				this.avatarInfo.optionActive,
				this.avatarInfo.colorName,
				cdnFormater.AVATAR_POSE_IDS[this.pose]
			);
		}
	}
}
