"use strict";
/*exported StoreTicketStoreController*/

class StoreTicketStoreController {
	constructor() {
		this.$mainContainer = $("#swTicketStoreMainContainer");
		this.$contentContainer = this.$mainContainer.find("#swTicketStoreContentContainer");

		this.entries = [];
		this.ENTRY_VALUES.forEach((entry) => {
			let storeEntry = new StoreTicketStoreEntry(entry.amount, entry.price);
			this.entries.push(storeEntry);
			this.$contentContainer.append(storeEntry.$entry);
		});
	}

	hide() {
		this.$mainContainer.addClass("hide");
	}

	show() {
		this.$mainContainer.removeClass("hide");
		this.resize();
	}

	resize() {
		this.entries.forEach((entry) => entry.resize());
	}
}
StoreTicketStoreController.prototype.ENTRY_VALUES = [
	{
		price: 1,
		amount: 1,
	},
	{
		price: 9.99,
		amount: 12,
	},
	{
		price: 19.99,
		amount: 26,
	},
	{
		price: 49.99,
		amount: 70,
	},
	{
		price: 99.99,
		amount: 150,
	},
];

class StoreTicketStoreEntry {
	constructor(amount, price) {
		let description = `${amount} ${amount === 1 ? "Ticket" : "Tickets Pack"}`;
		this.$entry = $(format(this.TEMPLATE, amount, price, description));
		this.$buyContainer = this.$entry.find(".swAvatarTileFooterContent");
		this.$buyText = this.$entry.find(".swAvatarSkinName");

		this.$entry.click(() => {
			let taxPrice = price - price / (taxRate / 100 + 1);
			let unitPrice = price - taxPrice;

			let priceItems = [];

			priceItems.push(
				{
					name: "Tickets",
					hidePrice: true,
					bold: true,
				},
				{
					name: description,
					realMoneyPrice: unitPrice
				}
			);

			storePriceModal.showTicket(priceItems, amount, price, taxPrice);
		});
	}

	resize() {
		fitTextToContainer(this.$buyText, this.$buyContainer, 40, 12);
	}
}
StoreTicketStoreEntry.prototype.TEMPLATE = $("#swTicketStoreEntryTemplate").html();
