"use strict";
/*exported StorePreviewTile StoreAvatarTile StoreEmoteTile*/

class StoreTile {
	constructor(
		imgSrc,
		imgSrcset,
		backgroundSrc,
		name,
		tag,
		notePrice,
		realMoneyPrice,
		colorTicketTier,
		avatarTicketTier,
		patreonTierToUnlock,
		defaultImageSize,
		extraClasses = []
	) {
		this.colorTicketTier = colorTicketTier;
		let mainTicketTier, secondTicketTier;
		if (colorTicketTier) {
			mainTicketTier = colorTicketTier;
			if(avatarTicketTier) {
				secondTicketTier = avatarTicketTier;
			}
		} else if (avatarTicketTier) {
			mainTicketTier = avatarTicketTier;
		}
		let priceStringOne, priceStringTwo;
		if (notePrice) {
			priceStringOne = numberWithCommas(notePrice);
			if (realMoneyPrice) {
				if (patreonTierToUnlock) {
					priceStringTwo = "or $ " + realMoneyPrice.toFixed(2);
				} else {
					priceStringTwo = "$ " + realMoneyPrice.toFixed(2);
				}
			} else if (mainTicketTier) {
				priceStringTwo = TICKET_TIER_RHYTHM_PRICES[mainTicketTier];
			}
		} else if (mainTicketTier) {
			priceStringOne = TICKET_TIER_RHYTHM_PRICES[mainTicketTier];
			if (secondTicketTier) {
				priceStringTwo = TICKET_TIER_RHYTHM_PRICES[secondTicketTier];
			}
		} else if (realMoneyPrice) {
			if (patreonTierToUnlock) {
				priceStringOne = "or $ " + realMoneyPrice.toFixed(2);
			} else {
				priceStringOne = "$ " + realMoneyPrice.toFixed(2);
			}
		}
		this.$tile = $(format(this.TILE_TEMPLATE, tag, priceStringOne, priceStringTwo, name));

		if (backgroundSrc) {
			this.$tile.css("background-image", 'url("' + backgroundSrc + '")');
		}
		if (mainTicketTier) {
			let ticketTarget, rhythmTarget;
			if (notePrice) {
				ticketTarget = ".swAvatarTileMainPrice.second";
				rhythmTarget = ".swAvatarTileRhythmIcon.second";
			} else {
				ticketTarget = ".swAvatarTileMainPrice.first";
				rhythmTarget = ".swAvatarTileRhythmIcon.first";
			}
			this.$tile
				.find(ticketTarget)
				.attr("srcset", cdnFormater.newTicketSrcSet(mainTicketTier))
				.attr("src", cdnFormater.newTicketSrc(mainTicketTier))
				.popover({
					content: "Ticket Reward Tier " + mainTicketTier,
					placement: "top",
					trigger: "hover",
					container: "#swContentAvatarContainer",
				});
			this.$tile.find(rhythmTarget).removeClass("hide").popover({
				content: "Rhythm Price",
				placement: "top",
				trigger: "hover",
				container: "#swContentAvatarContainer",
			});
			if (secondTicketTier) {
				this.$tile
					.find(".swAvatarTileMainPrice.second")
					.attr("srcset", cdnFormater.newTicketSrcSet(secondTicketTier))
					.attr("src", cdnFormater.newTicketSrc(secondTicketTier))
					.popover({
						content: "Ticket Reward Tier " + secondTicketTier,
						placement: "top",
						trigger: "hover",
						container: "#swContentAvatarContainer",
					});
				this.$tile.find(".swAvatarTileRhythmIcon.second").removeClass("hide").popover({
					content: "Rhythm Price",
					placement: "top",
					trigger: "hover",
					container: "#swContentAvatarContainer",
				});
			}
		}
		extraClasses.forEach((className) => {
			this.$tile.addClass(className.replace(/ /g, "-"));
		});

		if (!priceStringOne) {
			this.$tile.find(".swAvatarTilePriceContainer.firstRow").addClass("hide");
		} else {
			if (realMoneyPrice) {
				let $container;
				if (priceStringTwo) {
					$container = this.$tile.find(".swAvatarTilePriceContainer.secondRow");
				} else {
					$container = this.$tile.find(".swAvatarTilePriceContainer.firstRow");
				}
				if (patreonTierToUnlock) {
					$container
						.find(".swAvatarTilePriceIcon")
						.attr("src", cdnFormater.newBadgeSrc(cdnFormater.PATREON_PREVIEW_BADGE_FILENAME))
						.popover({
							content: "Free for tier 2+ Patreons",
							delay: 50,
							placement: "top",
							trigger: "hover",
							container: "#swContentAvatarContainer",
						});
				} else {
					$container.addClass("hideIcon");
				}
			}
			if (priceStringTwo) {
				let open = false;
				let $firstRow = this.$tile.find(".swAvatarTilePriceContainer.firstRow");
				$firstRow.on("transitionend", () => {
					let hover = this.$tile.is(":hover");
					if (open && !hover) {
						$firstRow.removeClass("doubleRow");
						open = false;
					} else if (hover) {
						$firstRow.addClass("doubleRow");
						open = true;
					}
				});
			}
		}

		let $img = this.$tile.find(".swAvatarTileImage");
		this.imagePreload = new PreloadImage(
			$img,
			imgSrc,
			imgSrcset,
			false,
			defaultImageSize,
			null,
			null,
			storeWindow.mainContainer.$mainContainer
		);
	}

	set storeFade(on) {
		if (on) {
			this.$tile.addClass("storeFade");
		} else {
			this.$tile.removeClass("storeFade");
		}
	}

	updateTextSize() {
		fitTextToContainer(
			this.$tile.find(".swAvatarSkinName"),
			this.$tile.find(".swAvatarTileFooterContent"),
			this.TARGET_FONT_SIZE,
			this.MIN_FONT_SIZE
		);
	}

	updateFirstRowString(newPriceString) {
		this.$tile.find(".swAvatarTilePriceContainer.firstRow > .swAvatarTilePrice").text(newPriceString);
	}

	addUnlockedClass() {
		this.$tile.addClass("unlocked");
		this.$tile.find(".swAvatarTilePriceContainer").addClass("hide");

		if (this.colorTicketTier) {
			this.$tile
				.find(".swAvatarTileRarityColor")
				.addClass("tier" + this.colorTicketTier)
				.removeClass("hide");
		}
	}

	removeUnlockedClass() {
		this.$tile.removeClass("unlocked");
		this.$tile.find(".swAvatarTilePriceContainer").removeClass("hide");

		if (this.colorTicketTier) {
			this.$tile
				.find(".swAvatarTileRarityColor")
				.removeClass("tier" + this.colorTicketTier)
				.addClass("hide");
		}
	}

	turnOffSecondRow() {
		this.$tile.find(".swAvatarTilePriceContainer.firstRow").off("transitionend");
	}
}

StoreTile.prototype.TILE_TEMPLATE = $("#swAvatarTileTemplate").html();
StoreTile.prototype.TARGET_FONT_SIZE = 40;
StoreTile.prototype.MIN_FONT_SIZE = 10;

class StorePreviewTile extends StoreTile {
	constructor(storeAvatar) {
		let extraClasses = [storeAvatar.avatarName, storeAvatar.outfitName, "previewTile"];

		super(
			storeAvatar.src,
			storeAvatar.srcSet,
			storeAvatar.backgroundSrc,
			capitalizeMajorWords(storeAvatar.outfitName),
			storeAvatar.typeName,
			0,
			0,
			null,
			null,
			null,
			null,
			extraClasses
		);

		if (storeAvatar.gotSkins) {
			this.addUnlockedClass();
		}

		this.$tile.click(() => {
			storeAvatar.displayColors();
		});
	}
}

class StoreAvatarTile extends StoreTile {
	constructor(storeColor) {
		let extraClasses = [
			storeColor.avatar.avatarName,
			storeColor.avatar.outfitName,
			storeColor.name,
			"avatarTile",
		];
		let avatarTicketTier = storeColor.avatar.unlocked ? null : storeColor.avatar.ticketTier;
		super(
			storeColor.src,
			storeColor.srcSet,
			storeColor.backgroundSrc,
			capitalizeMajorWords(storeColor.name),
			storeColor.typeName,
			storeColor.notePrice,
			storeColor.realMoneyPrice,
			storeColor.ticketTier,
			avatarTicketTier,
			storeColor.patreonTierToUnlock,
			null,
			extraClasses
		);

		if (storeColor.unlocked) {
			this.addUnlockedClass();
		}

		this.$tile.click(() => {
			if (storeWindow.inBackgroundMode) {
				storeWindow.avatarColumn.displayBackground(storeColor.backgroundDescription);
			} else {
				storeWindow.avatarColumn.displayAvatar(storeColor.fullDescription);
				storeWindow.avatarColumn.displayBackground(storeColor.backgroundDescription);
			}
		});
	}
}

class StoreEmoteTile extends StoreTile {
	constructor(storeEmote) {
		super(
			storeEmote.src,
			storeEmote.srcSet,
			null,
			storeEmote.name,
			"Exclusive",
			0,
			0,
			storeEmote.tier,
			null,
			null,
			"150px"
		);

		if (storeEmote.unlocked) {
			this.addUnlockedClass();
		} else {
			this.$tile.click(() => {
				let priceItems = [];

				priceItems.push(
					{
						name: "Emote",
						hidePrice: true,
						bold: true,
					},
					{
						name: storeEmote.name,
						rhythmPrice: TICKET_TIER_RHYTHM_PRICES[storeEmote.tier],
					}
				);

				storePriceModal.showEmote(priceItems, storeEmote.id);
			});
		}
	}
}
StoreEmoteTile.prototype.TILE_TEMPLATE = $("#swEmoteTileTemplate").html();
StoreEmoteTile.prototype.TARGET_FONT_SIZE = 25;
