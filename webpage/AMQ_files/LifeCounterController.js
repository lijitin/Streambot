'use strict';

function LifeCounterController($avatar, maxLives, currentLives) {
	this.$container = $avatar.find('.qpLiftContainer');
	this.maxLives = maxLives;
	this.currentLives = currentLives;

	this.lifeMap = {
		1: this.$container.find('.qpLife-1'),
		2: this.$container.find('.qpLife-2'),
		3: this.$container.find('.qpLife-3'),
		4: this.$container.find('.qpLife-4'),
		5: this.$container.find('.qpLife-5')
	};

	Object.keys(this.lifeMap).forEach(lifeNumber => {
		if (lifeNumber > maxLives) {
			this.lifeMap[lifeNumber].addClass('hidden');
		}
	});

	for (let i = 1; i <= currentLives; i++) {
		this.activateLife(i);
	}

	this.$container.removeClass('hidden');
}

LifeCounterController.prototype.setupLives = function (currentLives, revivePoints) {
	this.currentLives = currentLives;
	for (let i = 1; i <= this.maxLives; i++) {
		if (i <= currentLives) {
			this.activateLife(i);
		} else {
			this.killLife(i);
		}
	}
	for (let i = 1; i <= revivePoints; i++) {
		this.activateCharge(i);
	}
};

LifeCounterController.prototype.updateState = function (newLifeCount, newReviveScore) {
	if (newLifeCount < this.currentLives) {
		for (let i = this.currentLives; i > newLifeCount; i--) {
			this.killLife(i);
		}
		if (newLifeCount === 0) {
			this.showReviveTarget();
		}
	} else if (newLifeCount > this.currentLives) {
		this.runReviewAnimation();
	} else if (newReviveScore > 0) {
		this.activateCharge(newReviveScore);
	} else if (newLifeCount === 0) {
		this.killChage(1);
		this.killChage(2);
	}
	this.currentLives = newLifeCount;
};

LifeCounterController.prototype.activateLife = function (number) {
	this.lifeMap[number].addClass('active');
};

LifeCounterController.prototype.killLife = function (number) {
	this.lifeMap[number].removeClass('active');
};

LifeCounterController.prototype.activateCharge = function (number) {
	this.lifeMap[number].addClass('charge');
};

LifeCounterController.prototype.killChage = function (number) {
	this.lifeMap[number].removeClass('charge');
};

LifeCounterController.prototype.showReviveTarget = function () {
	for (let i = 1; i <= 3; i++) {
		this.lifeMap[i].removeClass('hidden');
	}
	this.lifeMap[3].addClass('target');
};

LifeCounterController.prototype.runReviewAnimation = function () {
	this.lifeMap[3]
		.addClass('active');
	setTimeout(() => {
		this.lifeMap[2]
			.removeClass('charge')
			.addClass('active');
		setTimeout(() => {
			this.lifeMap[3]
				.removeClass('active')
				.removeClass('target');
			setTimeout(() => {
				this.lifeMap[1]
					.removeClass('charge')
					.addClass('active');
				setTimeout(() => {
					this.lifeMap[2]
						.removeClass('active');
					setTimeout(() => {
						for (let i = 3; i > this.maxLives; i--) {
							this.lifeMap[i].addClass('hidden');
						}
					}, 100);
				}, 150);
			}, 150);
		}, 150);
	}, 1000);
};

LifeCounterController.prototype.resize = function () {
	let lifeHeight = this.lifeMap[1].height();
	let containerHeight = this.$container.height();
	let margin = (containerHeight - lifeHeight * 5) / 4;

	Object.values(this.lifeMap).forEach(($life) => {
		$life
			.width(lifeHeight)
			.css('margin-bottom', margin + 'px');
	});
};