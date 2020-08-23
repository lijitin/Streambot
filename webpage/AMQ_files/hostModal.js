"use strict";
/*exported hostModal*/
function HostModal() {
	this.$view = $("#mhHostModal");
	this.$title = this.$view.find('.modal-title');
	this.$hostButton = $("#mhHostButton");
	this.$changeButton = $("#mhChangeButton");
	this.$JOIN_BUTTON = $("#mhJoinGame");
	this.$SPECTATE_BUTTON = $("#mhSpectateGame");
	this.$PREVIEW_BUTTON_CONTAINER = $("#mhRoomTilePreviewButtons");
	this.$SETTING_CONTAINER = $("#mhHostSettingContainer");
	this.$MODE_CONTAINER = $("#mhHostGameModeContainer");
	this.$MODE_BUTTON = $("#mhHostModeButton");
	this.$RANDOMIZE_BUTTON = $("#mhHostRandomizeButton");

	this.$LIFE_SETTING_CONTAINER = $("#mhLifeContainer");
	this.$GUESS_TIME_SETTING_CONTAINER = $("#mhQuizGuessTimeContainer");
	this.$SONG_SELECTION_OUTER_CONTAINER = $("#mhSongSelectionOuterContainer");
	this.$SHOW_SELECTION_CONTAINER = $("#mhShowSelectionContainer");
	this.$BATTLE_ROYALE_SETTING_ROW = $("#mhQuizBattleRoyaleSettingRow");
	this.$LOOT_DROPPING_CONTAINER = $("#mhLootDroppingContainer");

	this.$ROOM_SIZE_LIMITED_CONTAINER = $("#mhRoomSizeLimitedContainer");
	this.$ROOM_SIZE_UNLIMITED_CONTAINER = $("#mhRoomSizeUnlimitedContainer");

	this.numberOfSongsSliderCombo;
	this.$songPool = $("#mhSongPool");

	this.$privateCheckbox = $("#mhPrivateRoom");
	this.$passwordInput = $("#mhPasswordInput");
	this.$passwordContainer = $("#mhPasswordContainer");


	this.$songTypeInsert = $("#mhSongTypeInsert");
	this.$songTypeEnding = $("#mhSongTypeEnding");
	this.$songTypeOpening = $("#mhSongTypeOpening");

	this.$roomName = $("#mhRoomNameInput");

	this.$roomSize = $("#mhRoomSize");
	this.roomSizeSliderCombo;
	this.roomSizeSwitch;

	this.watchedSliderCombo;
	this.unwatchedSliderCombo;
	this.randomWatchedSliderCombo;
	this.songSelectionAdvancedController;

	this.showWatchedSliderCombo;
	this.showUnwatchedSliderCombo;
	this.showRandomWatchedSliderCombo;

	this.openingsSliderCombo;
	this.endingsSliderCombo;
	this.insertSliderCombo;
	this.randomSliderCombo;
	this.songTypeAdvancedController;

	this.playLengthSliderCombo;
	this.playLengthRangeSliderCombo;
	this.playLengthRandomSwitch;

	this.inventorySizeSliderCombo;
	this.inventorySizeRangeSliderCombo;
	this.inventorySizeRandomSwitch;

	this.lootingTimeSliderCombo;
	this.lootingTimeRangeSliderCombo;
	this.lootingTimeRandomSwitch;

	this.lifeSliderCombo;

	this.$skipGuessing = $("#mhGuessSkipping");
	this.$skipReplay = $("#mhReplaySkipping");
	this.$duplicateShows = $("#mhDuplicateShows");
	this.$lootDropping = $("#mhLootDropping");
	this.$queueing = $("#mhQueueing");

	this.$playbackSpeed = $("#mhPlaybackSpeed");
	this.playbackSpeedRandomSwitch;
	this.playbackSpeedToggleSlider;

	this.$playerScore = $("#mhPlayerScore");
	this.playerScoreAdvancedSwitch;
	this.playerScoreToggleSlider;

	this.$animeScore = $("#mhAnimeScore");
	this.animeScoreAdvancedSwitch;
	this.animeScoreToggleSlider;

	this.vintageRangeSliderCombo;
	this.fromSeasonSelector;
	this.toSeasonSelector;
	this.vintageAdvancedFilter;
	this.$vintageAddToFilterButton = $("#mhAddVintageFilter");

	this.genreFilter;
	this.tagFilter;

	this.$songDiffHard = $("#mhSongDiffHard");
	this.$songDiffMedium = $("#mhSongDiffMedium");
	this.$songDiffEasy = $("#mhSongDiffEasy");
	this.songDiffRangeSliderCombo;
	this.songDiffAdvancedSwitch;

	this.$songPopLiked = $("#mhSongPopLiked");
	this.$songPopMixed = $("#mhSongPopMixed");
	this.$songPopDisliked = $("#mhSongPopDisliked");
	this.songPopRangeSliderCombo;
	this.songPopAdvancedSwitch;

	this.$samplePoint = $("#mhSamplePoint");
	this.samplePointRangeSliderCombo;
	this.samplePointRandomSwitch;

	this.$animeTvCheckbox = $("#mhAnimeTV");
	this.$animeMovieCheckbox = $("#mhAnimeMovie");
	this.$animeOVACheckbox = $("#mhAnimeOVA");
	this.$animeONACheckbox = $("#mhAnimeONA");
	this.$animeSpecialCheckbox = $("#mhAnimeSpecial");

	this.$tabContainer = $("#mhHostSettingContainer > .tabContainer");
	this.$generalView = $("#mhGeneralSettings");
	this.$quizView = $("#mhQuizSettings");
	this.$animeView = $("#mhAnimeSettings");

	this.$generalTab = $("#mhGeneralTab");
	this.$quizTab = $("#mhQuizTab");
	this.$animeTab = $("#mhAnimeTab");

	this.DEFUALT_SETTINGS = {
		roomName: "",
		privateRoom: false,
		password: "",
		roomSize: 8,
		numberOfSongs: 20,
		modifiers: {
			skipGuessing: true,
			skipReplay: true,
			queueing: true,
			duplicates: true,
			lootDropping: true
		},
		songSelection: {
			advancedOn: false,
			standardValue: 2,
			advancedValue: {
				watched: 16,
				unwatched: 4,
				random: 0
			}
		},
		showSelection: {
			watched: 80,
			unwatched: 20,
			random: 0
		},
		songType: {
			advancedOn: false,
			standardValue: {
				openings: true,
				endings: true,
				inserts: false
			},
			advancedValue: {
				openings: 0,
				endings: 0,
				inserts: 0,
				random: 20
			}
		},
		guessTime: {
			randomOn: false,
			standardValue: 20,
			randomValue: [5, 60]
		},
		inventorySize: {
			randomOn: false,
			standardValue: 20,
			randomValue: [1, 99]
		},
		lootingTime: {
			randomOn: false,
			standardValue: 90,
			randomValue: [10, 150]
		},
		lives: 3,
		samplePoint: {
			randomOn: true,
			standardValue: 1,
			randomValue: [0, 100]
		},
		playbackSpeed: {
			randomOn: false,
			standardValue: 1,
			randomValue: [true, true, true, true]
		},
		songDifficulity: {
			advancedOn: false,
			standardValue: {
				easy: true,
				medium: true,
				hard: true
			},
			advancedValue: [0, 100]
		},
		songPopularity: {
			advancedOn: false,
			standardValue: {
				disliked: true,
				mixed: true,
				liked: true
			},
			advancedValue: [0, 100]
		},
		playerScore: {
			advancedOn: false,
			standardValue: [1, 10],
			advancedValue: [true, true, true, true, true, true, true, true, true, true]
		},
		animeScore: {
			advancedOn: false,
			standardValue: [2, 10],
			advancedValue: [true, true, true, true, true, true, true, true, true]
		},
		vintage: {
			standardValue: {
				years: [1944, 2020],
				seasons: [0, 3],
			},
			advancedValueList: []
		},
		type: {
			tv: true,
			movie: true,
			ova: true,
			ona: true,
			special: true
		},
		genre: [],
		tags: []
	};

	this._settingStorage; //Setup in setup

	this.soloMode = false;
	this.gameMode;

	this._currentView = 'general';

	let $passwordContainer = this.$passwordContainer;
	let $passwordInput = this.$passwordInput;
	this.$privateCheckbox.change(function () {
		if (this.checked) {
			$passwordContainer.removeClass("hidden");
		} else {
			$passwordContainer.addClass('hidden');
			$passwordInput.val("");
		}
	});

	this._previewRoomTile;
	this.$JOIN_BUTTON.click(() => {
		this._previewRoomTile.joinGame();
		this.hide();
	});
	this.$SPECTATE_BUTTON.click(() => {
		this._previewRoomTile.spectateGame();
		this.hide();
	});

	this.$view.on('hide.bs.modal', () => {
		if (this._previewRoomTile) {
			this._previewRoomTile.settingPreviewClosed();
			this._previewRoomTile = null;
			this.reset();
		}
		this.hideLoadContainer();
	});

	// Work around for bug releating to SweetAlert2 input fields while modals are open
	$("#mhHostModal").on('shown.bs.modal', function () {
		$(document).off('focusin.modal');
	});
}

HostModal.prototype.show = function() {
	this.$view.modal('show');
};

HostModal.prototype.setup = function (genreInfo, tagInfo, savedSettings) {
	this._settingStorage = new SettingStorage(savedSettings);

	this.numberOfSongsSliderCombo = new SliderTextCombo($("#mhNumberOfSongs"), $("#mhNumberOfSongsText"), {
		min: 5,
		max: 100,
		selection: 'none'
	});

	this.genreFilter = new DropDownSettingFilter($("#mhGenreFilter"), $("#mhGenreInput"), genreInfo);
	this.tagFilter = new DropDownSettingFilter($("#mhTagFilter"), $("#mhTagInput"), tagInfo);

	setOneCheckBoxAlwaysOn([
		this.$animeMovieCheckbox,
		this.$animeONACheckbox,
		this.$animeOVACheckbox,
		this.$animeSpecialCheckbox,
		this.$animeTvCheckbox
	], "One Anime Type Must be Selected");

	this.setupRoomSize();
	this.setupSongSelection();
	this.setupShowSelection();
	this.setupSongTypes();
	this.setupPlayLength();
	this.setupLootingTime();
	this.setupInventorySize();
	this.setupLife();
	this.setupPlaybackSpeed();
	this.setupSamplePoint();
	this.setupPlayerScore();
	this.setupAnimeScore();
	this.setupVintage();
	this.setupSongDifficulty();
	this.setupSongPopularity();

	$("#mhHostModal").on('shown.bs.modal', function () {
		this.relayout();
	}.bind(this));
};

HostModal.prototype.setupRoomSize = function () {
	this.$roomSize.slider({
		ticks: [2, 3, 4, 5, 6, 7, 8],
		ticks_labels: [2, 3, 4, 5, 6, 7, 8],
		ticks_snap_bounds: 1,
		selection: 'none'
	});

	this.roomSizeSliderCombo = new SliderTextCombo($("#mhRoomSizeAdnvaced"), $("#mhRoomSizeAdvancedText"),
		{
			min: 9,
			max: 40,
			value: 24
		});

	this.roomSizeSwitch = new Switch($("#mhRoomSizeSwitch"));
	this.roomSizeSwitch.addContainerToggle($("#mhRoomSizeAdvancedContainer"), $("#mhRoomSizeStandardContiainer"));
};

HostModal.prototype.setupSongSelection = function () {
	this.$songPool
		.slider({
			ticks: [1, 2, 3],
			ticks_labels: ["Random", "Mainly Watched", "Only Watched"],
			ticks_snap_bounds: 1,
			selection: 'none',
			formatter: function (value) {
				switch (value) {
					case 1: return "Random";
					case 2: return "Mainly Watched";
					case 3: return "Only Watched";
					default: return "Unknown";
				}
			}
		})
		.on('change', (event) => {
			let numberOfSongs = this.numberOfSongsSliderCombo.getValue();
			let watched = 0;
			let unwatched = 0;
			let random = 0;
			switch (event.value.newValue) {
				case 1:
					random = numberOfSongs;
					break;
				case 2:
					watched = Math.ceil(numberOfSongs * 0.8);
					unwatched = Math.floor(numberOfSongs * 0.2);
					break;
				case 3:
					watched = numberOfSongs;
					break;
			}
			this.watchedSliderCombo.setValue(watched);
			this.unwatchedSliderCombo.setValue(unwatched);
			this.randomWatchedSliderCombo.setValue(random);
		});

	this.watchedSliderCombo = new SliderTextCombo($("#mhWatched"), $("#mhWatchedText"),
		{
			min: 0,
			max: 20,
			value: this.numberOfSongsSliderCombo.getValue()
		});
	this.unwatchedSliderCombo = new SliderTextCombo($("#mhUnwatched"), $("#mhUnwatchedText"),
		{
			min: 0,
			max: 20,
			value: 0
		});
	this.randomWatchedSliderCombo = new SliderTextCombo($("#mhRandomWatched"), $("#mhRandomWatchedText"),
		{
			min: 0,
			max: 20,
			value: 0
		});
	let songSelectionSliderGroup = [
		this.watchedSliderCombo,
		this.unwatchedSliderCombo,
		this.randomWatchedSliderCombo
	];
	songSelectionSliderGroup.forEach(slider => {
		slider.addValueGroup(songSelectionSliderGroup);
	});

	this.songSelectionAdvancedController = new AdvancedSettingController($("#mhSongSelectionSwitch"), $("#mhSongSelectionStandardContainer"), $("#mhSongSelectionAdvancedContainer"));

	this.songSelectionAdvancedController.addListener((on) => {
		if (!on) {
			let currentValue = this.$songPool.slider('getValue');

			// Change from and back to value to trigger change event on slider
			this.$songPool.slider('setValue', currentValue % 3 + 1);
			this.$songPool.slider('setValue', currentValue, false, true);
		}
	});

	this.numberOfSongsSliderCombo.addListener(createAdvancedDistributionSongListener(songSelectionSliderGroup));
};

HostModal.prototype.setupShowSelection = function () {

	this.showWatchedSliderCombo = new SliderTextCombo($("#mhShowWatched"), $("#mhShowWatchedText"),
		{
			min: 0,
			max: 100,
			value: 100,
			formatter: function (value) {
				return value + '%';
			}
		});
	this.showUnwatchedSliderCombo = new SliderTextCombo($("#mhShowUnwatched"), $("#mhShowUnwatchedText"),
		{
			min: 0,
			max: 100,
			value: 0,
			formatter: function (value) {
				return value + '%';
			}
		});
	this.showRandomWatchedSliderCombo = new SliderTextCombo($("#mhShowRandomWatched"), $("#mhShowRandomWatchedText"),
		{
			min: 0,
			max: 100,
			value: 0,
			formatter: function (value) {
				return value + '%';
			}
		});
	let songSelectionSliderGroup = [
		this.showWatchedSliderCombo,
		this.showUnwatchedSliderCombo,
		this.showRandomWatchedSliderCombo
	];
	songSelectionSliderGroup.forEach(slider => {
		slider.addValueGroup(songSelectionSliderGroup);
	});

	this.songSelectionAdvancedController = new AdvancedSettingController($("#mhSongSelectionSwitch"), $("#mhSongSelectionStandardContainer"), $("#mhSongSelectionAdvancedContainer"));

	this.songSelectionAdvancedController.addListener((on) => {
		if (!on) {
			let currentValue = this.$songPool.slider('getValue');

			// Change from and back to value to trigger change event on slider
			this.$songPool.slider('setValue', currentValue % 3 + 1);
			this.$songPool.slider('setValue', currentValue, false, true);
		}
	});
};

HostModal.prototype.setupSongTypes = function () {
	this.openingsSliderCombo = new SliderTextCombo($("#mhOpenings"), $("#mhOpeningsText"),
		{
			min: 0,
			max: 20,
			value: 0
		});
	this.endingsSliderCombo = new SliderTextCombo($("#mhEndings"), $("#mhEndingsText"),
		{
			min: 0,
			max: 20,
			value: 0
		});
	this.insertSliderCombo = new SliderTextCombo($("#mhInserts"), $("#mhInsertsText"),
		{
			min: 0,
			max: 20,
			value: 0,
			enabled: false
		});
	this.randomSliderCombo = new SliderTextCombo($("#mhRandomType"), $("#mhRandomTypeText"),
		{
			min: 0,
			max: 20,
			value: this.numberOfSongsSliderCombo.getValue(),
		});

	let songTypeInputPairs = [
		{
			$checkbox: this.$songTypeOpening,
			sliderCombo: this.openingsSliderCombo
		},
		{
			$checkbox: this.$songTypeEnding,
			sliderCombo: this.endingsSliderCombo
		},
		{
			$checkbox: this.$songTypeInsert,
			sliderCombo: this.insertSliderCombo
		}
	];

	let songTypeSliderGroup = [
		this.openingsSliderCombo,
		this.endingsSliderCombo,
		this.insertSliderCombo,
		this.randomSliderCombo
	];

	songTypeInputPairs.forEach(pair => {
		pair.$checkbox.click(() => {
			let on = pair.$checkbox.is(':checked');
			if (on) {
				pair.sliderCombo.setDisabled(false);
			} else {
				let otherOn = songTypeInputPairs.some(otherPair => {
					if (pair === otherPair) {
						return false;
					}
					return otherPair.$checkbox.is(':checked');
				});
				if (!otherOn) {
					pair.$checkbox.prop('checked', true);
					displayMessage("One Song Type Must be Selected");
				} else {
					pair.sliderCombo.setDisabled(true);
				}
			}
		});
	});

	songTypeSliderGroup.forEach(slider => {
		slider.addValueGroup(songTypeSliderGroup);
	});

	this.songTypeAdvancedController = new AdvancedSettingController($("#mhSongTypeSwitch"), $("#mnSongTypeStandardContainer"), $("#mhSongTypeAdvancedContainer"), true);

	this.songTypeAdvancedController.addListener((on) => {
		if (!on) {
			this.openingsSliderCombo.setValue(0);
			this.endingsSliderCombo.setValue(0);
			this.insertSliderCombo.setValue(0);
			this.randomSliderCombo.setValue(this.numberOfSongsSliderCombo.getValue());
		}
	});

	this.numberOfSongsSliderCombo.addListener(createAdvancedDistributionSongListener(songTypeSliderGroup));
};

HostModal.prototype.setupPlayLength = function () {
	this.playLengthSliderCombo = new SliderTextCombo($("#mhPlayLength"), $("#mhPlayLengthText"),
		{
			min: 5,
			max: 60,
			value: 20,
			selection: 'none',
			formatter: function (value) {
				return value + " seconds";
			}
		});

	this.playLengthRangeSliderCombo = new SliderTextCombo($("#mhPlayLengthRange"), [$("#mhPlayLengthMin"), $("#mhPlayLengthMax")],
		{
			min: 5,
			max: 60,
			value: [5, 60],
			range: true,
			formatter: function (value) {
				return value[0] + '-' + value[1] + " seconds";
			}
		});

	this.playLengthRandomSwitch = new Switch($("#mhPlayLengthRandomSwitch"));
	this.playLengthRandomSwitch.addContainerToggle($("#mhPlayLengthRangeContainer"), $("#mhPlayLengthSpecificContainer"));
};

HostModal.prototype.setupInventorySize = function () {
	this.inventorySizeSliderCombo = new SliderTextCombo($("#mhInventorySize"), $("#mhInventorySizeText"),
		{
			min: 1,
			max: 99,
			value: 20,
			selection: 'none'
		});

	this.inventorySizeRangeSliderCombo = new SliderTextCombo($("#mhInventorySizeRange"), [$("#mhInventorySizeMin"), $("#mhInventorySizeMax")],
		{
			min: 1,
			max: 99,
			value: [1, 99],
			range: true
		});

	this.inventorySizeRandomSwitch = new Switch($("#mhInventorySizeRandomSwitch"));
	this.inventorySizeRandomSwitch.addContainerToggle($("#mhInventorySizeRangeContainer"), $("#mhInventorySizeSpecificContainer"));
};

HostModal.prototype.setupLootingTime = function () {
	this.lootingTimeSliderCombo = new SliderTextCombo($("#mhLootingTime"), $("#mhLootingTimeText"),
		{
			min: 10,
			max: 150,
			value: 90,
			selection: 'none',
			formatter: function (value) {
				return value + " seconds";
			}
		});

	this.lootingTimeRangeSliderCombo = new SliderTextCombo($("#mhLootingTimeRange"), [$("#mhLootingTimeMin"), $("#mhLootingTimeMax")],
		{
			min: 10,
			max: 150,
			value: [10, 150],
			range: true,
			formatter: function (value) {
				return value[0] + '-' + value[1] + " seconds";
			}
		});

	this.lootingTimeRandomSwitch = new Switch($("#mhLootingTimeRandomSwitch"));
	this.lootingTimeRandomSwitch.addContainerToggle($("#mhLootingTimeRangeContainer"), $("#mhLootingTimeSpecificContainer"));
};

HostModal.prototype.setupLife = function () {
	this.lifeSliderCombo = new SliderTextCombo($("#mhLife"), $("#mhLifeText"),
		{
			min: 1,
			max: 5,
			value: 3,
			selection: 'none'
		});
};

HostModal.prototype.setupPlaybackSpeed = function () {
	this.$playbackSpeed.slider({
		ticks: [1, 1.5, 2, 4],
		ticks_labels: [1, 1.5, 2, 4],
		ticks_positions: [0, 33, 66, 100],
		ticks_snap_bounds: 3,
		selection: 'none',
		step: 0.5,
		max: 4,
		min: 1,
		value: 1
	});

	this.playbackSpeedToggleSlider = new ToggleSlider($("#mhPlaybackSpeedRandomSlider"), [1, 1.5, 2, 4]);

	this.playbackSpeedRandomSwitch = new Switch($("#mhPlaybackSpeedRandomSwitch"));
	this.playbackSpeedRandomSwitch.addContainerToggle($("#mhPlaybackSpeedRandomContainer"), $("#mhPlaybackSpeedSpecificContainer"));
};

HostModal.prototype.setupSamplePoint = function () {
	this.$samplePoint.slider({
		ticks: [1, 2, 3],
		ticks_labels: ["Start", "Middle", "End"],
		ticks_snap_bounds: 1,
		selection: 'none',
		min: 1,
		max: 3,
		value: 1,
		formatter: function (value) {
			switch (value) {
				case 1: return "Start";
				case 2: return "Middle";
				case 3: return "End";
				default: return "Unknown";
			}
		}
	});

	this.samplePointRangeSliderCombo = new SliderTextCombo($("#mhSamplePointRange"), [$("#mhSamplePointMin"), $("#mhSamplePointMax")],
		{
			min: 0,
			max: 100,
			value: [0, 100],
			range: true,
			formatter: function (value) {
				return value[0] + '-' + value[1] + "% into the song";
			}
		});

	this.samplePointRandomSwitch = new Switch($("#mhSamplePointRandomSwitch"));
	this.samplePointRandomSwitch.addContainerToggle($("#mhSamplePointRangeContainer"), $("#mhSamplePointSpecificContainer"));
	this.samplePointRandomSwitch.setOn(true);
	this.samplePointRandomSwitch.addListener((on) => {
		if (!on) {
			this.$samplePoint.slider('relayout');
		}
	});
};

HostModal.prototype.setupPlayerScore = function () {
	this.$playerScore.slider({
		ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		ticks_labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		ticks_snap_bounds: 1,
		value: [1, 10],
		step: 1,
		min: 1,
		max: 10,

	});

	this.playerScoreToggleSlider = new ToggleSlider($("#mhPlayerScoreAdvancedSelector"), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

	this.playerScoreAdvancedSwitch = new Switch($("#mhPlayerScoreSwitch"));
	this.playerScoreAdvancedSwitch.addContainerToggle($("#mhPlayerScoreAdvancedContainer"), $("#mhPlayerScoreStandardContainer"));
	this.playerScoreAdvancedSwitch.addListener(on => {
		if (!on) {
			this.$playerScore.slider('relayout');
		}
	});
};

HostModal.prototype.setupAnimeScore = function () {
	this.$animeScore.slider({
		ticks: [2, 3, 4, 5, 6, 7, 8, 9, 10],
		ticks_labels: [2, 3, 4, 5, 6, 7, 8, 9, 10],
		ticks_snap_bounds: 1,
		value: [2, 10],
		step: 1,
		min: 2,
		max: 10,

	});

	this.animeScoreToggleSlider = new ToggleSlider($("#mhAnimeScoreAdvancedSelector"), [2, 3, 4, 5, 6, 7, 8, 9, 10]);

	this.animeScoreAdvancedSwitch = new Switch($("#mhAnimeScoreSwitch"));
	this.animeScoreAdvancedSwitch.addContainerToggle($("#mhAnimeScoreAdvancedContainer"), $("#mhAnimeScoreStandardContainer"));
	this.animeScoreAdvancedSwitch.addListener(on => {
		if (!on) {
			this.$animeScore.slider('relayout');
		}
	});
};

HostModal.prototype.setupVintage = function () {
	this.vintageRangeSliderCombo = new SliderTextCombo($("#mhVintage"), [$("#mhVintageMin"), $("#mhVintageMax")],
		{
			min: 1944,
			max: 2020,
			value: [1944, 2020],
			range: true,
			formatter: function (value) {
				return value[0] + '-' + value[1];
			}
		});

	this.fromSeasonSelector = new SeasonSelector($("#mhFromSeasonSelectors"));
	this.fromSeasonSelector.setValue(0);
	this.toSeasonSelector = new SeasonSelector($("#mhToSeasonSelectors"));
	this.toSeasonSelector.setValue(3);

	this.fromSeasonSelector.addListener((fromValue) => {
		let sliderValue = this.vintageRangeSliderCombo.getValue();
		let toValue = this.toSeasonSelector.getValue();
		if (sliderValue[0] === sliderValue[1] && fromValue > toValue) {
			this.toSeasonSelector.setValue(fromValue);
			this.fromSeasonSelector.setValue(toValue);
		}
	});

	this.toSeasonSelector.addListener((toValue) => {
		let sliderValue = this.vintageRangeSliderCombo.getValue();
		let fromValue = this.fromSeasonSelector.getValue();
		if (sliderValue[0] === sliderValue[1] && toValue < fromValue) {
			this.fromSeasonSelector.setValue(toValue);
			this.toSeasonSelector.setValue(fromValue);
		}
	});

	this.vintageRangeSliderCombo.addListener((newValues) => {
		if (newValues[0] === newValues[1]) {
			let toValue = this.toSeasonSelector.getValue();
			let fromValue = this.fromSeasonSelector.getValue();
			if (toValue < fromValue) {
				this.toSeasonSelector.setValue(fromValue);
				this.fromSeasonSelector.setValue(toValue);
			}
		}
	});

	this.vintageAdvancedFilter = new SettingFilter($("#mhVintageFilter"), (value) => {
		let fromYear = value.years[0];
		let toYear = value.years[1];

		let fromSeasonIndex = value.seasons[0];
		let toSeasonIndex = value.seasons[1];

		let $entry = $(format(SETTING_FILTER_ENTRY_TEMPLATES.VINTAGE, fromYear + '-' + toYear));
		$entry.find('.fromSeasons > .mhSeasonSelector').eq(fromSeasonIndex).addClass('selected');
		$entry.find('.toSeasons > .mhSeasonSelector').eq(toSeasonIndex).addClass('selected');

		return $entry;
	}, (valueA, valueB) => {
		return valueA.years[0] === valueB.years[0] &&
			valueA.years[1] === valueB.years[1] &&
			valueA.seasons[0] === valueB.seasons[0] &&
			valueA.seasons[1] === valueB.seasons[1];
	});

	this.$vintageAddToFilterButton.click(() => {
		this.vintageAdvancedFilter.addValue({
			years: this.vintageRangeSliderCombo.getValue(),
			seasons: [this.fromSeasonSelector.getValue(), this.toSeasonSelector.getValue()]
		});
	});
};

HostModal.prototype.setupSongDifficulty = function () {
	this.songDiffRangeSliderCombo = new SliderTextCombo($("#mhSongDiffRange"), [$("#mhSongDiffMin"), $("#mhSongDiffMax")],
		{
			min: 0,
			max: 100,
			value: [0, 100],
			range: true,
			formatter: function (value) {
				return value[0] + '-' + value[1] + "% Correct Guesses";
			}
		});

	this.songDiffAdvancedSwitch = new Switch($("#mhSongDiffAdvancedSwitch"));
	this.songDiffAdvancedSwitch.addContainerToggle($("#mhSongDiffAdvancedContainer"), $("#mhSongDiffStandcardContainer"));

	setOneCheckBoxAlwaysOn([
		this.$songDiffEasy,
		this.$songDiffMedium,
		this.$songDiffHard
	], "One Song Difficulty Must be Selected");
};

HostModal.prototype.setupSongPopularity = function () {
	this.songPopRangeSliderCombo = new SliderTextCombo($("#mhSongPopRange"), [$("#mhSongPopMin"), $("#mhSongPopMax")],
		{
			min: 0,
			max: 100,
			value: [0, 100],
			range: true,
			formatter: function (value) {
				return value[0] + '-' + value[1] + "% Liked";
			}
		});

	this.songPopAdvancedSwitch = new Switch($("#mhSongPopAdvancedSwitch"));
	this.songPopAdvancedSwitch.addContainerToggle($("#mhSongPopAdvancedContainer"), $("#mhSongPopStandcardContainer"));

	setOneCheckBoxAlwaysOn([
		this.$songPopDisliked,
		this.$songPopLiked,
		this.$songPopMixed
	], "One Song Popularity Must be Selected");
};

HostModal.prototype.showMode = function () {
	this.$SETTING_CONTAINER.addClass('hide');
	this.$MODE_CONTAINER.removeClass('hide');
	this.$title.text("Setup Game");
};

HostModal.prototype.showSettings = function () {
	if (this.gameMode === 'Last Man Standing' || this.gameMode === 'Battle Royale') {
		this.$LIFE_SETTING_CONTAINER.removeClass('hidden');
		this.$GUESS_TIME_SETTING_CONTAINER.removeClass('col-xs-offset-3');
	} else {
		this.$LIFE_SETTING_CONTAINER.addClass('hidden');
		this.$GUESS_TIME_SETTING_CONTAINER.addClass('col-xs-offset-3');
	}
	if (this.gameMode === 'Battle Royale') {
		this.$SONG_SELECTION_OUTER_CONTAINER.addClass('hidden');
		this.$SHOW_SELECTION_CONTAINER.removeClass('hidden');
		this.$BATTLE_ROYALE_SETTING_ROW.removeClass('hidden');
		this.$LOOT_DROPPING_CONTAINER.removeClass('hidden');
	} else {
		this.$SHOW_SELECTION_CONTAINER.addClass('hidden');
		this.$BATTLE_ROYALE_SETTING_ROW.addClass('hidden');
		this.$LOOT_DROPPING_CONTAINER.addClass('hidden');
		this.$SONG_SELECTION_OUTER_CONTAINER.removeClass('hidden');
	}
	if(this.gameMode === 'Ranked') {
		this.$ROOM_SIZE_LIMITED_CONTAINER.addClass('hide');
		this.$ROOM_SIZE_UNLIMITED_CONTAINER.removeClass('hide');
	} else {
		this.$ROOM_SIZE_LIMITED_CONTAINER.removeClass('hide');
		this.$ROOM_SIZE_UNLIMITED_CONTAINER.addClass('hide');
	}
	this.$SETTING_CONTAINER.removeClass('hide');
	this.$MODE_CONTAINER.addClass('hide');
	this.$title.text("Setup " + this.gameMode + " Game");
	this.relayout();
};

HostModal.prototype.relayout = function () {
	this.$view.addClass("relayouting");
	this.$view.removeClass("relayouting");
	this.relayoutGeneralTab();
	this.relayoutQuizTab();
	this.relayoutAnimeTab();
};

HostModal.prototype.relayoutGeneralTab = function () {
	this.numberOfSongsSliderCombo.relayout();
	this.roomSizeSliderCombo.relayout();
	this.$roomSize.slider('relayout');
	this.$songPool.slider('relayout');
};

HostModal.prototype.relayoutQuizTab = function () {
	this.playLengthSliderCombo.relayout();
	this.inventorySizeSliderCombo.relayout();
	this.lootingTimeSliderCombo.relayout();
	this.lifeSliderCombo.relayout();
	this.$samplePoint.slider('relayout');
	this.$playbackSpeed.slider('relayout');
};

HostModal.prototype.relayoutAnimeTab = function () {
	this.$playerScore.slider('relayout');
	this.$animeScore.slider('relayout');
	this.vintageRangeSliderCombo.relayout();
	this.vintageAdvancedFilter.relayout();
};

HostModal.prototype.selectStandard = function () {
	this.gameMode = 'Standard';
	this.showSettings();
};

HostModal.prototype.selectQD = function () {
	this.gameMode = 'Quick Draw';
	this.showSettings();
};

HostModal.prototype.selectLastMan = function () {
	this.gameMode = 'Last Man Standing';
	this.showSettings();
};

HostModal.prototype.selectBattleRoyal = function () {
	this.gameMode = 'Battle Royale';
	this.showSettings();
};


HostModal.prototype.getSettings = function (onlyValidateStaticSettings) {
	//Clear possible old alerts
	$("#mhHostModal .alert-danger").removeClass('alert-danger');

	let roomName = this.$roomName.val();
	let privateRoom = this.$privateCheckbox.is(":checked") && !this.soloMode;
	let password = this.$passwordInput.val();
	if (!onlyValidateStaticSettings) {
		if (!roomName) {
			displayMessage("A room name must be provided");
			this.$roomName.addClass("alert-danger");
			return false;
		}
		if (roomName.length > 20) {
			displayMessage("Room name too long", "Please keep it under 20 symbols");
			this.$roomName.addClass("alert-danger");
			return false;
		}
		if (privateRoom && !password.length) {
			displayMessage("A password must be provided");
			this.$passwordInput.addClass("alert-danger");
			return false;
		}
	}

	let advancedPlayerScore = this.playerScoreAdvancedSwitch.getOn();
	if (advancedPlayerScore) {
		let oneOn = this.playerScoreToggleSlider.getValues().some((on) => {
			return on;
		});
		if (!oneOn) {
			displayMessage("At least one player score must be toggled on");
			return false;
		}
	}

	let advancedAnimeScore = this.animeScoreAdvancedSwitch.getOn();
	if (advancedAnimeScore) {
		let oneOn = this.animeScoreToggleSlider.getValues().some((on) => {
			return on;
		});
		if (!oneOn) {
			displayMessage("At least one anime score must be toggled on");
			return false;
		}
	}

	let advancedPlaybackSpeed = this.playbackSpeedRandomSwitch.getOn();
	if (advancedPlaybackSpeed) {
		let oneOn = this.playbackSpeedToggleSlider.getValues().some((on) => {
			return on;
		});
		if (!oneOn) {
			displayMessage("At least one playback speed must be toggled on");
			return false;
		}
	}

	return {
		roomName: roomName,
		privateRoom: privateRoom,
		password: password,
		roomSize: this.roomSizeSwitch.getOn() ? this.roomSizeSliderCombo.getValue() : this.$roomSize.slider('getValue'),
		numberOfSongs: this.numberOfSongsSliderCombo.getValue(),
		modifiers: {
			skipGuessing: this.$skipGuessing.is(":checked"),
			skipReplay: this.$skipReplay.is(":checked"),
			duplicates: this.$duplicateShows.is(":checked"),
			queueing: this.$queueing.is(':checked'),
			lootDropping: this.$lootDropping.is(':checked')
		},
		songSelection: {
			advancedOn: this.songSelectionAdvancedController.getOn(),
			standardValue: this.$songPool.slider('getValue'),
			advancedValue: {
				watched: this.watchedSliderCombo.getValue(),
				unwatched: this.unwatchedSliderCombo.getValue(),
				random: this.randomWatchedSliderCombo.getValue()
			}
		},
		showSelection: {
			watched: this.showWatchedSliderCombo.getValue(),
			unwatched: this.showUnwatchedSliderCombo.getValue(),
			random: this.showRandomWatchedSliderCombo.getValue()
		},
		songType: {
			advancedOn: this.songTypeAdvancedController.getOn(),
			standardValue: {
				openings: this.$songTypeOpening.is(":checked"),
				endings: this.$songTypeEnding.is(":checked"),
				inserts: this.$songTypeInsert.is(":checked")
			},
			advancedValue: {
				openings: this.openingsSliderCombo.getValue(),
				endings: this.endingsSliderCombo.getValue(),
				inserts: this.insertSliderCombo.getValue(),
				random: this.randomSliderCombo.getValue()
			}
		},
		guessTime: {
			randomOn: this.playLengthRandomSwitch.getOn(),
			standardValue: this.playLengthSliderCombo.getValue(),
			randomValue: this.playLengthRangeSliderCombo.getValue()
		},
		inventorySize: {
			randomOn: this.inventorySizeRandomSwitch.getOn(),
			standardValue: this.inventorySizeSliderCombo.getValue(),
			randomValue: this.inventorySizeRangeSliderCombo.getValue()
		},
		lootingTime: {
			randomOn: this.lootingTimeRandomSwitch.getOn(),
			standardValue: this.lootingTimeSliderCombo.getValue(),
			randomValue: this.lootingTimeRangeSliderCombo.getValue()
		},
		lives: this.lifeSliderCombo.getValue(),
		samplePoint: {
			randomOn: this.samplePointRandomSwitch.getOn(),
			standardValue: this.$samplePoint.slider('getValue'),
			randomValue: this.samplePointRangeSliderCombo.getValue()
		},
		playbackSpeed: {
			randomOn: advancedPlaybackSpeed,
			standardValue: this.$playbackSpeed.slider('getValue'),
			randomValue: this.playbackSpeedToggleSlider.getValues()
		},
		songDifficulity: {
			advancedOn: this.songDiffAdvancedSwitch.getOn(),
			standardValue: {
				easy: this.$songDiffEasy.is(":checked"),
				medium: this.$songDiffMedium.is(":checked"),
				hard: this.$songDiffHard.is(":checked")
			},
			advancedValue: this.songDiffRangeSliderCombo.getValue()
		},
		songPopularity: {
			advancedOn: this.songPopAdvancedSwitch.getOn(),
			standardValue: {
				disliked: this.$songPopDisliked.is(":checked"),
				mixed: this.$songPopMixed.is(":checked"),
				liked: this.$songPopLiked.is(":checked")
			},
			advancedValue: this.songPopRangeSliderCombo.getValue()
		},
		playerScore: {
			advancedOn: advancedPlayerScore,
			standardValue: this.$playerScore.slider('getValue'),
			advancedValue: this.playerScoreToggleSlider.getValues()
		},
		animeScore: {
			advancedOn: advancedAnimeScore,
			standardValue: this.$animeScore.slider('getValue'),
			advancedValue: this.animeScoreToggleSlider.getValues()
		},
		vintage: {
			standardValue: {
				years: this.vintageRangeSliderCombo.getValue(),
				seasons: [this.fromSeasonSelector.getValue(), this.toSeasonSelector.getValue()],
			},
			advancedValueList: this.vintageAdvancedFilter.getValues()
		},
		type: {
			tv: this.$animeTvCheckbox.is(":checked"),
			movie: this.$animeMovieCheckbox.is(":checked"),
			ova: this.$animeOVACheckbox.is(":checked"),
			ona: this.$animeONACheckbox.is(":checked"),
			special: this.$animeSpecialCheckbox.is(":checked")
		},
		genre: this.genreFilter.getValues(),
		tags: this.tagFilter.getValues(),
		gameMode: this.gameMode
	};
};

HostModal.prototype.hide = function () {
	$("#mhHostModal").modal('hide');
};

HostModal.prototype.displayHostSolo = function() {
	this.setModeHostGame(true);
	hostModal.show();
};

HostModal.prototype.reset = function () {
	$("#mhHostModal .alert-danger").removeClass('alert-danger');

	this.changeSettings(this.DEFUALT_SETTINGS);
	this.changeView('general');
};

HostModal.prototype.setModeHostGame = function (soloMode) {
	this.$view.find(".modal-body").removeClass("disabled");
	this.resetMode();
	this.$MODE_BUTTON.removeClass('hidden');
	this.$RANDOMIZE_BUTTON.removeClass('hidden');
	this.$title.text("Setup Game");
	this.$hostButton.removeClass("hidden");
	this.$view.find(".mhSettingContainer").removeClass("disabled");
	if(soloMode) {
		this.soloMode = true;
		this.$view.addClass('soloMode');
		this.$roomName.val('Solo');
	} else {
		this.soloMode = false;
	}
	this._settingStorage.setLoadingEnabled(true);
	this.showMode();
};

HostModal.prototype.setModeGameSettings = function (host, soloMode) {
	this.$title.text(this.gameMode + " Game Settings");
	this.resetMode();
	if (host) {
		this.$view.find(".mhSettingContainer").removeClass("disabled");
		this.$changeButton.removeClass("hidden");
		this.$RANDOMIZE_BUTTON.removeClass('hidden');
		this.$MODE_BUTTON
			.text("Game Mode")
			.removeClass('hidden');
		this._settingStorage.setLoadingEnabled(true);
	} else {
		this.$view.find(".mhSettingContainer").addClass("disabled");
		this._settingStorage.setLoadingEnabled(false);
	}
	if(soloMode) {
		this.soloMode = true;
		this.$view.addClass('soloMode');
	}
};

HostModal.prototype.setModePreviewGame = function (tile) {
	this.resetMode();
	this._previewRoomTile = tile;
	this.$title.text(this.gameMode + " Game Settings");
	this.$view.find(".mhSettingContainer").addClass("disabled");
	this.$PREVIEW_BUTTON_CONTAINER.removeClass('hidden');
	this._settingStorage.setLoadingEnabled(false);
};

HostModal.prototype.resetMode = function () {
	this.$PREVIEW_BUTTON_CONTAINER.addClass('hidden');
	this.$hostButton.addClass("hidden");
	this.$changeButton.addClass("hidden");
	this.$changeButton.addClass("hidden");
	this.$MODE_BUTTON.addClass('hidden');
	this.$RANDOMIZE_BUTTON.addClass('hidden');
	this.$view.removeClass('soloMode');
	this.soloMode = false;
};

HostModal.prototype.changeSettings = function (changes) {
	Object.keys(changes).forEach(key => {
		setTimeout(() => {
			this.updateSetting(key, changes[key]);
		}, 1);
	});
};

HostModal.prototype.updateSetting = function (setting, change) {
	if (typeof change === 'object') {
		change = JSON.parse(JSON.stringify(change));
	}
	switch (setting) {
		case 'roomName': this.$roomName.val(change); break;
		case 'privateRoom':
			this.setCheckBox(this.$privateCheckbox, change);
			if (change) {
				this.$passwordContainer.removeClass('hidden');
			} else {
				this.$passwordContainer.addClass('hidden');
			}
			break;
		case 'password': this.$passwordInput.val(change); break;
		case 'roomSize': {
			let advancedOn = change > 8;
			this.roomSizeSwitch.setOn(advancedOn);
			if (advancedOn) {
				this.roomSizeSliderCombo.setValue(change);
				this.$roomSize.slider('setValue', 8, false, true);
			} else {
				this.roomSizeSliderCombo.setValue(24);
				this.$roomSize.slider('setValue', change, false, true);
			}
			break;
		}
		case 'numberOfSongs': this.numberOfSongsSliderCombo.setValue(change); break;
		case 'modifiers':
			this.setCheckBox(this.$skipGuessing, change.skipGuessing);
			this.setCheckBox(this.$skipReplay, change.skipReplay);
			this.setCheckBox(this.$duplicateShows, change.duplicates);
			this.setCheckBox(this.$lootDropping, change.lootDropping);
			this.setCheckBox(this.$queueing, change.queueing);
			break;
		case 'songSelection':
			this.$songPool.slider('setValue', change.standardValue);
			this.watchedSliderCombo.setValue(change.advancedValue.watched);
			this.unwatchedSliderCombo.setValue(change.advancedValue.unwatched);
			this.randomWatchedSliderCombo.setValue(change.advancedValue.random);
			this.songSelectionAdvancedController.setOn(change.advancedOn);
			break;
		case 'showSelection':
			this.showWatchedSliderCombo.setValue(change.watched);
			this.showUnwatchedSliderCombo.setValue(change.unwatched);
			this.showRandomWatchedSliderCombo.setValue(change.random);
			break;
		case 'songType':
			this.setCheckBox(this.$songTypeOpening, change.standardValue.openings);
			this.setCheckBox(this.$songTypeEnding, change.standardValue.endings);
			this.setCheckBox(this.$songTypeInsert, change.standardValue.inserts);
			this.openingsSliderCombo.setDisabled(!change.standardValue.openings);
			this.endingsSliderCombo.setDisabled(!change.standardValue.endings);
			this.insertSliderCombo.setDisabled(!change.standardValue.inserts);
			this.openingsSliderCombo.setValue(change.advancedValue.openings);
			this.endingsSliderCombo.setValue(change.advancedValue.endings);
			this.insertSliderCombo.setValue(change.advancedValue.inserts);
			this.randomSliderCombo.setValue(change.advancedValue.random);
			this.songTypeAdvancedController.setOn(change.advancedOn);
			break;
		case 'guessTime':
			this.playLengthSliderCombo.setValue(change.standardValue);
			this.playLengthRangeSliderCombo.setValue(change.randomValue);
			this.playLengthRandomSwitch.setOn(change.randomOn);
			break;
		case 'inventorySize':
			this.inventorySizeSliderCombo.setValue(change.standardValue);
			this.inventorySizeRangeSliderCombo.setValue(change.randomValue);
			this.inventorySizeRandomSwitch.setOn(change.randomOn);
			break;
		case 'lootingTime':
			this.lootingTimeSliderCombo.setValue(change.standardValue);
			this.lootingTimeRangeSliderCombo.setValue(change.randomValue);
			this.lootingTimeRandomSwitch.setOn(change.randomOn);
			break;
		case 'lives':
			this.lifeSliderCombo.setValue(change);
			break;
		case 'samplePoint':
			this.samplePointRangeSliderCombo.setValue(change.randomValue);
			this.$samplePoint.slider('setValue', change.standardValue);
			this.samplePointRandomSwitch.setOn(change.randomOn);
			break;
		case 'playbackSpeed':
			this.playbackSpeedToggleSlider.setValue(change.randomValue);
			this.$playbackSpeed.slider('setValue', change.standardValue);
			this.playbackSpeedRandomSwitch.setOn(change.randomOn);
			break;
		case 'songDifficulity':
			this.songDiffRangeSliderCombo.setValue(change.advancedValue);
			this.setCheckBox(this.$songDiffEasy, change.standardValue.easy);
			this.setCheckBox(this.$songDiffMedium, change.standardValue.medium);
			this.setCheckBox(this.$songDiffHard, change.standardValue.hard);
			this.songDiffAdvancedSwitch.setOn(change.advancedOn);
			break;
		case 'songPopularity':
			this.songPopRangeSliderCombo.setValue(change.advancedValue);
			this.setCheckBox(this.$songPopDisliked, change.standardValue.disliked);
			this.setCheckBox(this.$songPopMixed, change.standardValue.mixed);
			this.setCheckBox(this.$songPopLiked, change.standardValue.liked);
			this.songPopAdvancedSwitch.setOn(change.advancedOn);
			break;
		case 'playerScore':
			this.playerScoreToggleSlider.setValue(change.advancedValue);
			this.$playerScore.slider('setValue', change.standardValue);
			this.playerScoreAdvancedSwitch.setOn(change.advancedOn);
			break;
		case 'animeScore':
			this.animeScoreToggleSlider.setValue(change.advancedValue);
			this.$animeScore.slider('setValue', change.standardValue);
			this.animeScoreAdvancedSwitch.setOn(change.advancedOn);
			break;
		case 'vintage':
			this.vintageRangeSliderCombo.setValue(change.standardValue.years, true);
			this.fromSeasonSelector.setValue(change.standardValue.seasons[0]);
			this.toSeasonSelector.setValue(change.standardValue.seasons[1]);
			this.vintageAdvancedFilter.clear();
			change.advancedValueList.forEach(value => {
				this.vintageAdvancedFilter.addValue(value);
			});
			break;
		case 'type':
			this.setCheckBox(this.$animeTvCheckbox, change.tv);
			this.setCheckBox(this.$animeMovieCheckbox, change.movie);
			this.setCheckBox(this.$animeOVACheckbox, change.ova);
			this.setCheckBox(this.$animeONACheckbox, change.ona);
			this.setCheckBox(this.$animeSpecialCheckbox, change.special);
			break;
		case 'genre':
			this.genreFilter.clear();
			change.forEach(value => {
				this.genreFilter.addValue(value);
			});
			break;
		case 'tags':
			this.tagFilter.clear();
			change.forEach(value => {
				this.tagFilter.addValue(value);
			});
			break;
		case 'gameMode': this.gameMode = change;
	}
};

HostModal.prototype.setCheckBox = function (checkBoxElement, checked) {
	checkBoxElement.prop("checked", checked);
};

HostModal.prototype.changeView = function (viewName) {
	this.$generalView.addClass("hidden");
	this.$quizView.addClass("hidden");
	this.$animeView.addClass("hidden");

	this.$tabContainer.find('.tab').removeClass('selected');

	switch (viewName) {
		case 'general':
			this.$generalView.removeClass('hidden');
			this.$generalTab.addClass('selected');
			this.relayoutGeneralTab();
			break;
		case 'quiz':
			this.$quizView.removeClass('hidden');
			this.$quizTab.addClass('selected');
			this.relayoutQuizTab();
			break;
		case 'anime':
			this.$animeView.removeClass('hidden');
			this.$animeTab.addClass('selected');
			this.relayoutAnimeTab();
			break;
	}
	this._currentView = viewName;
};

HostModal.prototype.showLoadContainer = function () {
	this._settingStorage.setLoadContainerHidden(false);
};

HostModal.prototype.hideLoadContainer = function () {
	this._settingStorage.setLoadContainerHidden(true);
};

HostModal.prototype.toggleLoadContainer = function () {
	if (this._settingStorage.loadContainerShown()) {
		this.showLoadContainer();
	} else {
		this.hideLoadContainer();
	}
};

HostModal.prototype.show = function () {
	this.$view.modal('show');
};

HostModal.prototype.toggleJoinButton = function (on) {
	if (on) {
		this.$JOIN_BUTTON.removeClass("disabled");
	} else {
		this.$JOIN_BUTTON.addClass("disabled");
	}
};

HostModal.prototype.randomize = function () {
	switch (this._currentView) {
		case 'general':
			this.changeSettings(settingRandomizer.getRandomGeneralSettings());
			break;
		case 'quiz':
			this.changeSettings(settingRandomizer.getRandomQuizSettings());
			break;
		case 'anime':
			this.changeSettings(settingRandomizer.getRandomAnimeSettings());
			break;
	}
};

HostModal.prototype.saveSettings = function () {
	this._settingStorage.saveSettings(this.getSettings(true));
};

function createAdvancedDistributionSongListener(sliderComboList) {
	return (newValue, oldValue) => {
		let sliderComboes = sliderComboList;

		let valueChange = newValue - oldValue;

		let sumChange = 0;
		let entries = [];
		sliderComboes.forEach(sliderCombo => {
			let currentValue = sliderCombo.getValue();
			let sharePercent = currentValue / oldValue;
			let change = Math.floor(valueChange * sharePercent);
			sumChange += change;
			entries.push({
				percent: sharePercent,
				currentValue: currentValue,
				change: change,
				sliderCombo: sliderCombo
			});
		});

		//Sort decending 
		entries.sort((a, b) => {
			return Math.abs(b.sharePercent) - Math.abs(a.sharePercent);
		});

		let index = 0;
		while (sumChange < valueChange) {
			if (index > entries.length) {
				index = 0;
			}
			entries[index].change++;
			sumChange++;
			index++;
		}

		entries.forEach((entry) => {
			entry.sliderCombo.setMax(newValue);
			entry.sliderCombo.setValue(entry.currentValue + entry.change);
		});
	};
}

var hostModal = new HostModal();