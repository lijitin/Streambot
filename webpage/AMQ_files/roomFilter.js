'use strict';
/*exported roomFilter*/

function RoomFilter() {
	//elements
	this._$FILTER_SEARCH_INPUT = $("#rbSearchInput");
	this._$FILTER_BUTTON = $("#rbShowFilters");
	this._$FILTER_CONTAINER = $("#rbSettingFilterContainer");

	//Main Filters
	this._$HIDE_PRIVATE_CHECKBOX = $("#rbfPrivateRoom");
	this._$HIDE_PLAYING_CHECKBOX = $("#rbfPlaying");
	this._$HIDE_FULL_CHECKBOX = $("#rbfFull");

	//Sliders
	this._$ROOM_SIZE_SLIDER = $("#rbfRoomSize");
	this._$SONG_COUNT_SLIDER = $("#rbfSongCount");
	this._$GUESS_TIME_SLIDER = $("#rbfGuessTime");
	this._$DIFFICULTY_SLIDER = $("#rbrDifficulty");

	//Checkboxes
	this._$STANDARD_MODE_CHECKBOX = $("#rbfModeStandard");
	this._$QUICK_DRAW_MODE_CHECKBOX = $("#rbfModeQuickDraw");
	this._$LAST_MAN_MODE_CHECKBOX = $("#rbfModeLastMan");
	this._$BATTLE_ROYAL_MODE_CHECKBOX = $("#rbfModeBR");

	this._$OPENINGS_CHECKBOX = $("#rbfSongTypeOpening");
	this._$ENDINGS_CHECKBOX = $("#rbfSongTypeEnding");
	this._$INSERTS_CHECKBOX = $("#rbfSongTypeInsert");

	this._$WATCHED_CHECKBOX = $("#rbfSongSelectionWatched");
	this._$UNWATCHED_CHECKBOX = $("#rbfSongSelectionUnwatched");
	this._$RANDOM_CHECKBOX = $("#rbfSongSelectionRandom");

	this._$TV_TYPE_CHECKBOX = $("#rbrTvType");
	this._$MOVIE_TYPE_CHECKBOX = $("#rbrMovieType");
	this._$OVA_TYPE_CHECKBOX = $("#rbrOVAType");
	this._$ONA_TYPE_CHECKBOX = $("#rbrONAType");
	this._$SPECIAL_TYPE_CHECKBOX = $("#rbrSpecialType");

	this._$SAMPLE_POINT_CHECKBOX = $("#rbrSamplePoint");
	this._$PLAYBACK_SPEED_CHECKBOX = $("#rbrPlaybackSpeed");
	this._$ANIME_SCORE_CHECKBOX = $("#rbrAnimeScore");
	this._$VINTAGE_CHECKBOX = $("#rbrVintage");
	this._$GENRE_CHECKBOX = $("#rbrGenre");
	this._$TAG_CHECKBOX = $("#rbrTag");
	this._$POPULARITY_CHECKBOX = $("#rbrPopularity");

	this._DEFAULT_VALUES = {
		TRUE_CHECKBOXES: [
			this._$STANDARD_MODE_CHECKBOX,
			this._$QUICK_DRAW_MODE_CHECKBOX,
			this._$LAST_MAN_MODE_CHECKBOX,
			this._$BATTLE_ROYAL_MODE_CHECKBOX,
			this._$OPENINGS_CHECKBOX,
			this._$ENDINGS_CHECKBOX,
			this._$INSERTS_CHECKBOX,
			this._$WATCHED_CHECKBOX,
			this._$UNWATCHED_CHECKBOX,
			this._$RANDOM_CHECKBOX,
			this._$TV_TYPE_CHECKBOX,
			this._$MOVIE_TYPE_CHECKBOX,
			this._$OVA_TYPE_CHECKBOX,
			this._$ONA_TYPE_CHECKBOX,
			this._$SPECIAL_TYPE_CHECKBOX
		],
		FALSE_CHECKBOXES: [
			this._$SAMPLE_POINT_CHECKBOX,
			this._$PLAYBACK_SPEED_CHECKBOX,
			this._$ANIME_SCORE_CHECKBOX,
			this._$VINTAGE_CHECKBOX,
			this._$GENRE_CHECKBOX,
			this._$TAG_CHECKBOX,
			this._$POPULARITY_CHECKBOX
		],
		SLIDERS: [
			{
				SLIDER: this._$ROOM_SIZE_SLIDER,
				VALUE: [2, 40]
			},
			{
				SLIDER: this._$SONG_COUNT_SLIDER,
				VALUE: [5, 100]
			},
			{
				SLIDER: this._$GUESS_TIME_SLIDER,
				VALUE: [5, 60]
			},
			{
				SLIDER: this._$DIFFICULTY_SLIDER,
				VALUE: [0, 100]
			},
		],
		SEARCH: ""
	};
}

RoomFilter.prototype.setup = function () {
	if (Cookies.get('hide_full') == 'true') {
		this._$HIDE_FULL_CHECKBOX.attr('checked', true);
	}
	if (Cookies.get('hide_playing') == 'true') {
		this._$HIDE_PLAYING_CHECKBOX.attr('checked', true);
	}
	if (Cookies.get('hide_private') == 'true') {
		this._$HIDE_PRIVATE_CHECKBOX.attr('checked', true);
	}

	this._$HIDE_FULL_CHECKBOX.on('click', () => {
		Cookies.set("hide_full", $("#rbfFull:checked").length === 1, { expires: 365 });
		roomBrowser.applyTileFilter();
	});
	this._$HIDE_PLAYING_CHECKBOX.on('click', () => {
		Cookies.set("hide_playing", $("#rbfPlaying:checked").length === 1, { expires: 365 });
		roomBrowser.applyTileFilter();
	});
	this._$HIDE_PRIVATE_CHECKBOX.on('click', () => {
		Cookies.set("hide_private", $("#rbfPrivateRoom:checked").length === 1, { expires: 365 });
		roomBrowser.applyTileFilter();
	});

	this._$FILTER_BUTTON.hover(function () {
		this._$FILTER_CONTAINER.addClass("open");
	}.bind(this));

	var leaveTimeout;
	let leaveFunction = function () {
		if (leaveTimeout) {
			clearTimeout(leaveTimeout);
		}
		leaveTimeout = setTimeout(() => {
			if ($("#rbSettingFilterContainer:hover").length === 0 && $("#rbShowFilters:hover").length === 0) {
				this._$FILTER_CONTAINER.removeClass('open');
				leaveTimeout = null;
			}
		}, 500);
	}.bind(this);

	this._$FILTER_BUTTON.mouseleave(leaveFunction);
	this._$FILTER_CONTAINER.mouseleave(leaveFunction);


	this.setupFilterOptions();
};

RoomFilter.prototype.setupFilterOptions = function () {
	this._$ROOM_SIZE_SLIDER.slider({
		value: [2,40],
		min: 2,
		max: 40,
	});
	this._$ROOM_SIZE_SLIDER.on('change', () => {roomBrowser.applyTileFilter();});

	this._$SONG_COUNT_SLIDER.slider({
		value: [5, 100],
		ticks: [5, 100],
		ticks_labels: [5, 100],
		ticks_snap_bounds: 1
	});
	this._$SONG_COUNT_SLIDER.on('change', () => {roomBrowser.applyTileFilter();});

	this._$GUESS_TIME_SLIDER.slider({
		value: [5, 60],
		ticks: [5, 60],
		ticks_labels: [5, 60],
		ticks_snap_bounds: 1
	});
	this._$GUESS_TIME_SLIDER.on('change', () => {roomBrowser.applyTileFilter();});

	this._$DIFFICULTY_SLIDER.slider({
		value: [0, 100],
		ticks: [0, 100],
		ticks_labels: [0, 100],
		ticks_snap_bounds: 1
	});
	this._$DIFFICULTY_SLIDER.on('change', () => {roomBrowser.applyTileFilter();});

	this._$FILTER_CONTAINER.find("input[type='checkbox']").click(() => {roomBrowser.applyTileFilter();});
};

RoomFilter.prototype.testRoom = function (room) {
	let searchRegex = new RegExp(escapeRegExp(this._$FILTER_SEARCH_INPUT.val()), 'i');
	let roomSizeFilter = this._$ROOM_SIZE_SLIDER.slider('getValue');
	let songCountFilter = this._$SONG_COUNT_SLIDER.slider('getValue');
	let guessTimeFilter = this._$GUESS_TIME_SLIDER.slider('getValue');
	let difficultyFilter = this._$DIFFICULTY_SLIDER.slider('getValue');


	if (!searchRegex.test(room.settings.roomName) && !searchRegex.test(room.host) && !searchRegex.test(room.id) && !room.getFriendsInGame().some(name => {return searchRegex.test(name);})) {
		return false;
	}
	if (this._$HIDE_PRIVATE_CHECKBOX.prop('checked') && room.isPrivate()) {
		return false;
	}
	if (this._$HIDE_PLAYING_CHECKBOX.prop('checked') && !room.isInLobby()) {
		return false;
	}
	if (this._$HIDE_FULL_CHECKBOX.prop('checked') && room.isFull()) {
		return false;
	}
	if (roomSizeFilter[0] > room.settings.roomSize || roomSizeFilter[1] < room.settings.roomSize) {
		return false;
	}
	if (songCountFilter[0] > room.settings.numberOfSongs || songCountFilter[1] < room.settings.numberOfSongs) {
		return false;
	}

	let guessTimeSetting = room.settings.guessTime;
	if (guessTimeSetting.randomOn && (guessTimeFilter[0] > guessTimeSetting.randomValue[0] || guessTimeFilter[1] < guessTimeSetting.randomValue[1])) {
		return false;
	} else if (!guessTimeSetting.randomOn && (guessTimeFilter[0] > guessTimeSetting.standardValue || guessTimeFilter[1] < guessTimeSetting.standardValue)) {
		return false;
	}

	let difficultySetting = room.settings.songDifficulity;
	if (difficultySetting.advancedOn && (difficultyFilter[0] > difficultySetting.advancedValue[0] || difficultyFilter[1] < difficultySetting.advancedValue[1])) {
		return false;
	} else if (!difficultySetting.advancedOn) {
		let maxDiff, minDiff;
		if (difficultySetting.standardValue.hard) {
			maxDiff = 20;
			minDiff = 0;
		}
		if (difficultySetting.standardValue.medium) {
			minDiff = minDiff !== undefined ? minDiff : 20;
			maxDiff = 60;
		}
		if (difficultySetting.standardValue.easy) {
			minDiff = minDiff !== undefined ? minDiff : 60;
			maxDiff = 100;
		}

		if (difficultyFilter[0] > minDiff || difficultyFilter[1] < maxDiff) {
			return false;
		}
	}

	if (!this._$STANDARD_MODE_CHECKBOX.prop('checked') && room.settings.gameMode === 'Standard') {
		return false;
	}
	if (!this._$QUICK_DRAW_MODE_CHECKBOX.prop('checked') && room.settings.gameMode === 'Quick Draw') {
		return false;
	}
	if (!this._$LAST_MAN_MODE_CHECKBOX.prop('checked') && room.settings.gameMode === 'Last Man Standing') {
		return false;
	}
	if (!this._$BATTLE_ROYAL_MODE_CHECKBOX.prop('checked') && room.settings.gameMode === 'Battle Royale') {
		return false;
	}

	let songTypeSettings = room.settings.songType;
	let songTypeInclusion;
	if (songTypeSettings.advancedOn && songTypeSettings.advancedValue.random === 0) {
		songTypeInclusion = {
			openings: songTypeSettings.advancedValue.openings > 0,
			endings: songTypeSettings.advancedValue.endings > 0,
			inserts: songTypeSettings.advancedValue.inserts > 0
		};
	} else {
		songTypeInclusion = songTypeSettings.standardValue;
	}

	if (!this._$OPENINGS_CHECKBOX.prop('checked') && songTypeInclusion.openings) {
		return false;
	}
	if (!this._$ENDINGS_CHECKBOX.prop('checked') && songTypeInclusion.endings) {
		return false;
	}
	if (!this._$INSERTS_CHECKBOX.prop('checked') && songTypeInclusion.inserts) {
		return false;
	}

	let songSelectionSettings = room.settings.songSelection;
	if (!this._$WATCHED_CHECKBOX.prop('checked') && songSelectionSettings.advancedValue.watched > 0) {
		return false;
	}
	if (!this._$UNWATCHED_CHECKBOX.prop('checked') && songSelectionSettings.advancedValue.unwatched > 0) {
		return false;
	}
	if (!this._$RANDOM_CHECKBOX.prop('checked') && songSelectionSettings.advancedValue.random > 0) {
		return false;
	}

	let animeTypeSetting = room.settings.type;
	if (!this._$TV_TYPE_CHECKBOX.prop('checked') && animeTypeSetting.tv) {
		return false;
	}
	if (!this._$MOVIE_TYPE_CHECKBOX.prop('checked') && animeTypeSetting.movie) {
		return false;
	}
	if (!this._$OVA_TYPE_CHECKBOX.prop('checked') && animeTypeSetting.ova) {
		return false;
	}
	if (!this._$ONA_TYPE_CHECKBOX.prop('checked') && animeTypeSetting.ona) {
		return false;
	}
	if (!this._$SPECIAL_TYPE_CHECKBOX.prop('checked') && animeTypeSetting.special) {
		return false;
	}

	if(this._$SAMPLE_POINT_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.samplePoint, hostModal.DEFUALT_SETTINGS.samplePoint)) {
		return false;
	}
	if(this._$PLAYBACK_SPEED_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.playbackSpeed, hostModal.DEFUALT_SETTINGS.playbackSpeed)) {
		return false;
	}
	if(this._$ANIME_SCORE_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.animeScore, hostModal.DEFUALT_SETTINGS.animeScore)) {
		return false;
	}
	if(this._$VINTAGE_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.vintage, hostModal.DEFUALT_SETTINGS.vintage)) {
		return false;
	}
	if(this._$GENRE_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.genre, hostModal.DEFUALT_SETTINGS.genre)) {
		return false;
	}
	if(this._$TAG_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.tags, hostModal.DEFUALT_SETTINGS.tags)) {
		return false;
	}
	if(this._$POPULARITY_CHECKBOX.prop('checked') && !this.compareSettings(room.settings.songPopularity, hostModal.DEFUALT_SETTINGS.songPopularity)) {
		return false;
	}

	return true;
};

RoomFilter.prototype.compareSettings = function(settingA, settingB) {
	if(settingA.randomOn !== undefined) {
		if(settingA.randomOn !== settingB.randomOn) {
			return false;
		}
		if(settingA.randomOn) {
			return JSON.stringify(settingA.randomValue) === JSON.stringify(settingB.randomValue);
		} else {
			return JSON.stringify(settingA.standardValue) === JSON.stringify(settingB.standardValue);
		}
	} else if(settingA.advancedOn !== undefined) {
		if(settingA.advancedOn !== settingB.advancedOn) {
			return false;
		}
		if(settingA.advancedOn) {
			return JSON.stringify(settingA.advancedValue) === JSON.stringify(settingB.advancedValue);
		} else {
			return JSON.stringify(settingA.standardValue) === JSON.stringify(settingB.standardValue);
		}
	} else {
		return JSON.stringify(settingA) === JSON.stringify(settingB);
	}
};

RoomFilter.prototype.reset = function () {
	this._DEFAULT_VALUES.FALSE_CHECKBOXES.forEach(($checkbox) => {
		$checkbox.prop('checked', false);
	});
	this._DEFAULT_VALUES.TRUE_CHECKBOXES.forEach(($checkbox) => {
		$checkbox.prop('checked', true);
	});
	this._DEFAULT_VALUES.SLIDERS.forEach(entry => {
		entry.SLIDER.slider('setValue', entry.VALUE);
	});
	this._$FILTER_SEARCH_INPUT.val(this._DEFAULT_VALUES.SEARCH);
};

var roomFilter = new RoomFilter();