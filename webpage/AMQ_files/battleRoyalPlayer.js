'use strict';
/*exported BattleRoyalePlayer*/

class BattleRoyalePlayer extends GamePlayer {
	constructor(name, level, gamePlayerId, host, avatarInfo) {
		super(name, level, gamePlayerId, host, avatarInfo);
		this.inGame = true;
	}
}