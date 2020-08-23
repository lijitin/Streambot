"use strict";
/*exported emojiSelector*/

class EmojiSelector {
	constructor() {
		this.$container = $("#gcEmojiPickerContainer");
		this.$button = $("#gcEmojiPickerButton");

		this.isOpen = false;
		this.entries = [];

		this.$button.click(() => {
			if (this.isOpen) {
				this.close();
			} else {
				this.open();
			}
		});

		$("body").click(() => {
			if (this.isOpen) {
				this.close();
			}
		});

		$(".gcInputContainer").click((event) => {
			if (this.isOpen) {
				event.stopPropagation();
			}
		});

		this.$container.perfectScrollbar({
			suppressScrollX: true,
			minScrollbarLength: 50
		});
	}

	setup() {
		this.buildEntries();
	}

	buildEntries() {
		this.entries = [];
		this.$container.find('.amqEmoji').remove();
		let patreonEmojis = patreon.getCustomEmojis();
		let emotes = storeWindow.getAllEmotes();

		patreonEmojis.filter(emoji => emoji.active).forEach(emojiInfo => {
			this.insertEmoji(emojiInfo);
		});
		emotes.filter(emote => emote.unlocked).forEach(emoteInfo => {
			this.insertEmote(emoteInfo);
		});
		patreonEmojis.filter(emoji => !emoji.active).forEach(emojiInfo => {
			this.insertEmoji(emojiInfo);
		});
		emotes.filter(emote => !emote.unlocked).forEach(emoteInfo => {
			this.insertEmote(emoteInfo);
		});
	}

	insertEmote(emoteInfo) {
		let emoteEntry = new EmojiSelectorEntry(
			emoteInfo.name,
			emoteInfo.src,
			emoteInfo.srcSet,
			!emoteInfo.unlocked,
			this.$container
		);
		this.entries.push(emoteEntry);
		this.$container.append(emoteEntry.$entry);
	}

	insertEmoji(emojiInfo) {
		let emoteEntry = new EmojiSelectorEntry(
			emojiInfo.name,
			getCustomEmojiPath(emojiInfo.id),
			null,
			!emojiInfo.active,
			this.$container
		);
		this.entries.push(emoteEntry);
		this.$container.append(emoteEntry.$entry);
	}

	open() {
		this.isOpen = true;
		this.$container.removeClass("hide");

		this.entries.forEach(entry => entry.preLoadImage.lazyLoadEvent());
		this.$container.perfectScrollbar('update');
	}
	
	close() {
		this.isOpen = false;
		this.$container.addClass("hide");
	}
}

class EmojiSelectorEntry {
	constructor(name, src, srcSet, locked, $container) {
		this.name = name;

		this.$entry = $(format(this.TEMPLATE, "", this.name));
		if(locked) {
			this.$entry.addClass('locked');
		} else {
			this.$entry.click(() => {
				gameChat.insertEmoji(this.name);
			});
		}
		this.preLoadImage = new PreloadImage(
			this.$entry,
			src,
			srcSet,
			false,
			null,
			null,
			null,
			$container,
			true
		);
	}
}
EmojiSelectorEntry.prototype.TEMPLATE = $("#emojiTemplate").html();

var emojiSelector = new EmojiSelector();
