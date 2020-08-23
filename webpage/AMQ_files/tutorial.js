'use strict';
/*exported tutorial */

function Tutorial() {
	this.playerState;

	this.$layer = $("#introductionContainer");

	this.$leftContainer = $("#icLeftContainer");
	this.$rightContainer = $("#icRightContainer");
	this.$centerContainer = $("#icCenterContainer");

	this.$lastTopicText = $("#icContinueContainer > h2");

	this.$lastTopicText.click((event) => {
		this.lastState();
		event.stopPropagation();
	});

	$("#tutorialExitButton").click(event => {
		this.leave();
		event.stopPropagation();
	});

	this.$playButton = $("#mpPlayButton");
	this.$expandButton = $("#mpExpandButton");
	this.$socailButton = $("#mainMenuSocailButton");
	this.$socailTab = $("#socialTab");
	this.$menuBar = $("#footerMenuBar");
	this.$xpNoteContainer = $("#xpOuterContainer");
	this.$rightMenuContainer = $("#rightMenuBarPartContainer");
	this.$avatarDrive = $("#mpAvatarDriveContainer");

	this.state = 0;
}

Tutorial.prototype.setup = function (playerState) {
	this.playerState = playerState;

	if (this.playerState === 1) {
		this.promptTutorial();
	}
};

Tutorial.prototype.promptTutorial = function () {
	displayOption("Welcome to Anime Music Quiz!", "To start off, do you want to take a quick introduction to the game? As part of the introduction you'll be awarded 7.000 Notes!", "Play Introduction", "Skip", () => {
		this.start();
	}, () => {
		displayMessage("Introduction Skipped", "You can always play the introduction at a later time, just select it from the menu");
		socket.sendCommand({
			type: "tutorial",
			command: "tutorial skipped"
		});
	});
};

Tutorial.prototype.start = function () {
	if (viewChanger.getCurrentView() === 'main' && !viewChanger.inWindow) {
		this.$layer.removeClass('hide');
		this.$menuBar.addClass('disableZIndex');
		this.state = 1;
		this.updateState();
	} else {
		displayOption("Return to Main Menu?", "The introduction can only be taken from the main menu. If you return to the main menu you'll stop what ever you're currently doing!", "Return", "Stay", () => {
			viewChanger.changeView('main');
			viewChanger.closeAllWindows();
			this.start();
		});
	}	
};

Tutorial.prototype.leave = function () {
	this.resetLayout();
	this.$menuBar.removeClass('disableZIndex');
	this.$layer.addClass('hide');
};

Tutorial.prototype.updateState = function () {
	this.resetLayout();
	switch (this.state) {
		case 1:
			this.$centerContainer.removeClass('hide');
			this.$centerContainer.find("h1").text("Welcome!");
			this.$centerContainer.find("p").html(`
				Anime Music Quiz, is the game that takes anime quizzes to the next level!<br/>
				In this introduction, we’ll go over the basics of the game.
			`);
			break;
		case 2:
			this.$leftContainer.removeClass('hide');
			this.$leftContainer.find("h1").text("Get Playing");
			this.$leftContainer.find("p").html(`
				First off the most important part, playing! Clicking the play button will take you to the room selection page, where you can join quiz rooms or host your own. Quiz rooms support 2-8 players, spectators, integrated chat and have a ton of different settings to shape the quiz.
			`);
			this.$playButton.addClass("icShowElement");
			break;
		case 3:
			this.$leftContainer.removeClass('hide');
			this.$leftContainer.find("h1").text("How to Play");
			this.$leftContainer.find("p").html(`
				So what happens in a quiz room you may ask? Quizzes of course! Once all players are ready, the host of a room can start a quiz round. A quiz round consists of a set number of openings, endings and insert songs being played. You then have to compete against the other players in guessing the name of the anime it’s from. But here’s the catch, you must do it based on the song alone, no peeking at the video! At the end of each round, the player with the most correct answers win. 
			`);
			this.$playButton.addClass("icShowElement");
			break;
		case 4:
			this.$centerContainer.removeClass('hide');
			this.$centerContainer.find("h1").text("Friend List");
			this.$centerContainer.find("p").html(`
				While quizzing, you might meet some awesome people, or you have some friends you want to stay in touch with ingame. You can do this easily by using the friend list located at the bottom left of the screen (try clicking it). You can keep track of when they are online, invite them to quiz rooms or start a private chat with them, just right click their name in the friend list. <br/>
				You can send friend requests from game rooms or from the online player list accessible by clicking the “A” in the friend list.
			`);
			this.$socailButton.addClass("icShowElement");
			this.$socailTab.addClass("icShowElement");
			break;
		case 5:
			this.$leftContainer.removeClass('hide');
			this.$leftContainer.find("h1").text("Expand Library");
			this.$leftContainer.find("p").html(`
				Ones you hit level 5, you can help expand the song library by using the Expand Library function. Here you will be asked for video links to songs from the anime you've watched, with each new entry being added to the game. This way you can help keep the song library up to date, while getting your own favorite songs into the game! For each song you add you will also receive a good sum of Notes as thanks for the help. But what are these levels and Notes? We’ll have a look at that next!
			`);
			this.$expandButton.addClass("icShowElement");
			break;
		case 6:
			this.$centerContainer.removeClass('hide');
			this.$centerContainer.find("h1").text("Levels and Notes");
			this.$centerContainer.find("p").html(`
				Anime Music Quiz uses the currency Notes, with you can gain by playing or helping expand the library. Notes are used to unlock new avatars and skins, allowing you to change the look of the avatar representing you when playing. Together with Notes you also receive xp when doing the aforementioned actions, when enough xp have been acquired, you’ll gain a level! Levels is your way to show your skills, or at least your experience, to other players, as xp and Note gain is based on how well you do. 
			`);
			this.$xpNoteContainer.addClass("icShowElement");
			break;
		case 7:
			this.$rightContainer.removeClass('hide');
			this.$rightContainer.find("h1").text("Avatars");
			this.$rightContainer.find("p").html(`
				Once you have gained some Notes, you can use them to unlock new avatars and skins from the avatar window. The window can be accessed with the button on the bottom right. You can change avatars, skins and unlock new ones at any time, except while playing a quiz round. 
			`);
			this.$rightMenuContainer.addClass("icShowElement");
			break;
		case 8:
			this.$centerContainer.removeClass('hide');
			this.$centerContainer.find("h1").text("Avatar Drive");
			this.$centerContainer.find("p").html(`
				Finally we have the Avatar Drive, your way to support the game. In the Avatar Drive players can donate toward what the next avatar design should be. Once enough money have been raised to add the next avatar to the game, the design leading the Avatar Drive is chosen for the new avatar! 
			`);
			this.$avatarDrive.addClass("icShowElement");
			break;
		case 9:
			this.$centerContainer.removeClass('hide');
			this.$centerContainer.find("h1").text("Time to get Playing");
			this.$centerContainer.find("p").html(`
				That’s it for the introduction, if you want to replay the introduction at any point, you can do so from the menu tab beside the avatar button.<br/>
				We hope you enjoy your time playing Anime Music Quiz!
			`);
			break;
		case 10:
			this.leave();	
			if (this.playerState !== 0) {
				this.playerState = 0;
				let tutorialRewardListner = new Listener("completed tutorial", function (payload) {
					displayMessage("Thanks for Completing the Introduction", "As promised, you have been awarded 7.000 Notes!", () => {
						xpBar.setCredits(payload.credits);
					});
					tutorialRewardListner.unbindListener();
				}.bind(this));

				tutorialRewardListner.bindListener();

				socket.sendCommand({
					type: "tutorial",
					command: "completed tutorial"
				});
			}
			break;
	}

};

Tutorial.prototype.nextState = function () {
	this.state++;
	this.updateState();
};

Tutorial.prototype.lastState = function () {
	this.state--;
	this.updateState();
};


Tutorial.prototype.resetLayout = function () {
	this.$leftContainer.addClass('hide');
	this.$rightContainer.addClass('hide');
	this.$centerContainer.addClass('hide');
	$(".icShowElement").removeClass("icShowElement");

	if(this.state > 1) {
		this.$lastTopicText.removeClass("hide");
	}else{
		this.$lastTopicText.addClass("hide");
	}
};


var tutorial = new Tutorial();