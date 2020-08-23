'use strict';

class StoreTopIcon {
	constructor(src, srcSet, callback) {
		this.$topIcon;
		this.$iconImage;
		this.$childContainer;
		this.$childInnerContainer;
		this.iconOptions;

		this.childCount = 0;

		this.closed = true;
		this.active = false;
		this._open = false;
		this._selected = false;

		this.buildTopIconDomObject(src, srcSet);

		this.$childContainer.on('transitionend', (event) => {
			if ($(event.target).is(this.$childContainer)) {
				if (!this.open) {
					this.closed = true;
				}
				storeWindow.topBar.updateLayout();
			}
		});

		this.$iconImage.click(() => {
			if (this.active || !this.open) {
				this.open = !this.open;
				if (this.open) {
					storeWindow.topBar.updateLayout(this); //update layout strait away to make room for the skin container	
				}
			} else {
				this.selected = true;
			}

			callback(this.selected);
			storeWindow.topBar.handleCategorySelected(this, this.selected);
		});
	}

	get childContainerWidth() {
		return this.childCount * this.CHILD_WIDTH;
	}

	get width() {
		if (this.closed) {
			return this.ICON_WIDTH;
		} else {
			return this.ICON_WIDTH + this.childContainerWidth;
		}
	}

	get selected() {
		return this._selected;
	}

	set selected(newValue) {
		this._selected = newValue;
		this.active = newValue;
		if (newValue) {
			this.$iconImage.addClass('selected');
		} else {
			this.$iconImage.removeClass('selected');
		}
	}


	get open() {
		return this._open;
	}

	set open(newValue) {
		this._open = newValue;
		if(newValue) {
			this.$topIcon.addClass('active');
			this.$childContainer.width(this.childContainerWidth);
			this.closed = false;
			this.selected = true;
		} else {
			this.$topIcon.removeClass('active');
			this.$childContainer.width(0);
			this.selected = false;
			if (this.childContainerWidth === 0) {
				this.closed = true;
			}
		}
	}

	set inFilter(newValue) {
		if(newValue) {
			this.$iconImage.removeClass('storeFade');
		} else {
			this.$iconImage.addClass('storeFade');
		}
	}

	buildTopIconDomObject(src, srcSet) {
		this.$topIcon = $(format(this.ICON_TEMPLATE, src, srcSet));
		this.$childContainer = this.$topIcon.find('.swTopBarAvatarSkinContainer');
		this.$iconImage = this.$topIcon.find('.swTopBarAvatarImageContainer');
		this.$childInnerContainer = this.$topIcon.find('.swTopBarAvatarSkinContainerInner');

		this.$childContainer.width(0);
	}

	appendChildren(childList) {
		childList.forEach($child => {
			this.$childInnerContainer.append($child);
		});
		this.childCount = childList.length;
	}
}

StoreTopIcon.prototype.ICON_TEMPLATE = $("#swTopBarCharacterTemplate").html();
StoreTopIcon.prototype.CHILD_WIDTH = 72; //px;
StoreTopIcon.prototype.ICON_WIDTH = 78.5; //px;