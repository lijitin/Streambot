'use strict';
/*exported StoreTopBar */

class StoreTopBar {
	constructor($parentWindow, designs, unlockedDesigns, mainContainer, emoteGroups, unlockedEmoteIds) {
		this.$topBarContentContainer = $parentWindow.find('#swTopBarContentContainer');
		this.$topBarContentContainerInner = $parentWindow.find('#swTopBarContentContainerInner');

		this.iconsLoaded = false;
		this.characters = [];

		this.tickets = new StoreTickets(mainContainer);

		this.emotes = new StoreEmoteController(emoteGroups, mainContainer, unlockedEmoteIds);

		this.selectedCategory = null;

		this.$topBarContentContainer.perfectScrollbar({
			suppressScrollY: true,
			useBothWheelAxes: true
		});

		this.$topBarContentContainerInner.append(this.tickets.$topIcon);
		this.loadCharacters(designs, unlockedDesigns, mainContainer);
		this.$topBarContentContainerInner.append(this.emotes.$topIcon);
		this.updateScrollContainerWidth();
	}

	loadCharacters(designs, unlockedDesigns, mainContainer) {
		this.characters = designs.map(design => {
			return new StoreCharacter(design, unlockedDesigns, mainContainer);
		});

		this.characters.forEach(storeCharacter => {
			this.$topBarContentContainerInner.append(storeCharacter.$topIcon);
		});
	}

	updateLayout() {
		this.$topBarContentContainer.perfectScrollbar('update');
		this.updateScrollContainerWidth();
		let $scrollBar = this.$topBarContentContainer.find('.ps__scrollbar-x');
		$scrollBar.width($scrollBar.width() - this.SCROLL_BAR_OFFSET);
		if(!this.iconsLoaded) {
			this.iconsLoaded = true;
			this.characters.forEach(storeCharacter => {
				storeCharacter.loadAvatarTopIcons();
			});
		}
	}

	updateScrollContainerWidth() {
		let width = this.characters.reduce((width, storeCharacter) => {
			return width + storeCharacter.width;
		}, 0);
		width += this.SCROLL_CORRECTION; //Correction to set the width = scrollWidth due to the tilting
		this.$topBarContentContainerInner.width(Math.round(width));
	}

	handleCategorySelected(character, selected) {
		if(this.selectedCategory && this.selectedCategory !== character) {
			this.selectedCategory.open = false;
		}
		if(selected) {
			this.selectedCategory = character;
		} else {
			this.selectedCategory = null;
		}
	}

	clearAvatarSelection() {
		this.characters.forEach(character => {
			character.clearAvatarSelection();
		});
	}

	getCharacter(characterId) {
		return this.characters.find((character => { return character.characterId === characterId;}));
	}

	filterUpdate(newFilter) {
		this.characters.forEach(character => {
			character.filterUpdate(newFilter);
		});
	}

	disable() {
		this.$topBarContentContainer.addClass('disabled');
	}

	enable() {
		this.$topBarContentContainer.removeClass('disabled');
	}

}
StoreTopBar.prototype.SCROLL_CORRECTION = 231.5; //px
StoreTopBar.prototype.SCROLL_BAR_OFFSET = 107; //px