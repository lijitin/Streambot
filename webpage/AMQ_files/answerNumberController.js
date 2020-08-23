'use strict';

function AnswerNumberController($answerContainer) {
	this.$answerContainer = $answerContainer;
	this.$icon = $answerContainer.find('.qpAvatarAnswerNumber');
	this.$knownContainer = this.$icon.find('.knownResult');
	this.$unknownNumber = this.$icon.find('.unknownResult > h2');
	this.$knownNumber = this.$knownContainer.find(' h2');
	this.shown = false;
}

AnswerNumberController.prototype.showResult = function (number, correct) {
	this.$knownNumber.text(number);
	this.show();
	//Use timeout to workaround browser draw update limets
	setTimeout(() => {
		if (correct) {
			this.$knownContainer.addClass('correct');
		} else {
			this.$knownContainer.addClass('wrong');
		}
	}, 10);
};

AnswerNumberController.prototype.showUnknown = function (number) {
	this.$unknownNumber.text(number);
	this.show();
};

AnswerNumberController.prototype.show = function () {
	this.$icon.removeClass('hide');
	this.$answerContainer.addClass('numberShown');
};

AnswerNumberController.prototype.hide = function () {
	this.$icon.addClass('hide');
	this.$answerContainer.removeClass('numberShown');
	this.$knownContainer
		.removeClass('correct')
		.removeClass('wrong');
};