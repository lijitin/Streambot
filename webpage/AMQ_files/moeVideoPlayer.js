'use strict';
/*exported MoeVideoPlayer */
function MoeVideoPlayer(id) {
	let playerId = "#" + id;
	this.player = videojs(playerId, {
		controls: false,
		autoplay: false,
		preload: 'metadata',
		inactivityTimeout: 0
	});
	this.$player = $(playerId);

	this.firstVideo = false;
	this.songId;
	this.startPercent;
	this.startPoint;
	this.bufferLength;
	this.startTime;
	this.playOnReady;
	this.volume;
	this.playbackRate;
	this.videoMap;
	this.resolutionOrder;
	this.hostOrder;
	this.resolution;
	this.host;
	// this.loadTimeout = 7 * 1000;

	this.readyReported = false;
	this.bufferMonitorInterval;
	this._TIME_TO_BUFFER_BEFORE_READY = 10; //sec
	this._SUPPORTED_RESOLUTIONS = [720, 480, 0];

	this.player.ready(() => {
		this.player.volume(this.volume);
	});

	this.player.on('canplay', () => {
		if (this.playOnReady) {
			this.player.muted(false);
			this.player.play();
		} else {
			this.player.muted(true);
		}
		this.player.playbackRate(this.playbackRate);
	});

	this.player.on('loadedmetadata', () => {
		// clearTimeout(this.loadTimeoutId);
		let startFromDuration = this.player.duration() - this.bufferLength;
		startFromDuration = startFromDuration < 0 ? 0 : startFromDuration;
		let startPoint = startFromDuration * this.startPercent;
		this.startPoint = Math.floor(startPoint);

		if (this.startTime) {
			startPoint += this.startTime;
		}

		this.player.currentTime(Math.floor(startPoint));
		this.startBufferMonitor();
		this.readyReported = false;
		this.player.play();
	});

	this.player.on('error', () => {
		socket.sendCommand({
			type: 'quiz',
			command: 'video error',
			data: {
				songId: this.songId,
				host: this.host,
				resolution: this.resolution
			}
		});
		this.tryNextVideo();
	});
}

MoeVideoPlayer.prototype.BUFFER_MONITOR_TICK_RATE = 333; //ms
MoeVideoPlayer.prototype.startBufferMonitor = function () {
	this.stopBufferMonitor();
	this.bufferMonitorInterval = setInterval(() => {
		if (this.player.bufferedEnd() > this.startPoint + this._TIME_TO_BUFFER_BEFORE_READY) {
			if (!this.readyReported) {
				quiz.videoReady(this.songId);
				this.readyReported = true;
			}
			if (this.player.bufferedEnd() >= this.startPoint + this.bufferLength) {
				quizVideoController.currentVideoDoneBuffering();
				this.stopBufferMonitor();
				if (!this.playOnReady) {
					this.pauseVideo();
				}
			}
		}
	}, this.BUFFER_MONITOR_TICK_RATE);
};
MoeVideoPlayer.prototype.stopBufferMonitor = function () {
	clearInterval(this.bufferMonitorInterval);
};

MoeVideoPlayer.prototype.loadVideo = function (id, playLength, startPoint, firstVideo, videoMap, playOnReady, startTime, playbackRate) {
	this.stopBufferMonitor();
	this.videoMap = videoMap;

	this.playbackRate = playbackRate;
	this.firstVideo = firstVideo;
	this.startPercent = startPoint / 100;
	this.bufferLength = (playLength + 13) * this.playbackRate; //Factor in 5 secound show answer phase, 5 secoudns of buffer space and 3 secounds to avoid hitting end of video
	this.startTime = startTime * this.playbackRate;
	this.playOnReady = playOnReady;

	this.resolution; //Set when url selected
	this.host; //Set when url selected
	this.hostOrder = options.getHostPriorityList();

	let targetResolution = qualityController.targetResolution;
	this.resolutionOrder = [targetResolution];
	let largerResolutions = [];
	this._SUPPORTED_RESOLUTIONS.forEach(resolution => {
		if (resolution < targetResolution) {
			this.resolutionOrder.push(resolution);
		} else if (resolution > targetResolution) {
			largerResolutions.unshift(resolution);
		}
	});
	this.resolutionOrder = this.resolutionOrder.concat(largerResolutions);

	this.songId = id;

	this.startLoading();
};

MoeVideoPlayer.prototype.loadAndPlayVideo = function (id, playLength, startPoint, firstVideo, startTime, videoMap, playbackRate) {
	this.loadVideo(id, playLength, startPoint, firstVideo, videoMap, true, startTime, playbackRate);
};

MoeVideoPlayer.prototype.playVideo = function () {
	this.playOnReady = true;
	this.player.muted(false);
	this.replayVideo();
};

MoeVideoPlayer.prototype.pauseVideo = function () {
	this.player.pause();
};

MoeVideoPlayer.prototype.stopVideo = function () {
	this.playOnReady = false;
	this.pauseVideo();
};

MoeVideoPlayer.prototype.hide = function () {
	this.player.hide();
};

MoeVideoPlayer.prototype.show = function () {
	this.player.show();
};

MoeVideoPlayer.prototype.replayVideo = function () {
	this.pauseVideo();
	this.player.currentTime(this.startPoint);
	this.player.play();
};

MoeVideoPlayer.prototype.setVolume = function (newVolume) {
	this.player.volume(newVolume);
	this.volume = newVolume;
};

MoeVideoPlayer.prototype.getVideoUrl = function () {
	return "/moeVideo.webm?id=" + this.getNextVideoId();
};

//Obscured function, checks if video is displayed
MoeVideoPlayer.prototype.isPlaying = function() {
	return this.$player.css('display') === 'none';
};

MoeVideoPlayer.prototype.getNextVideoId = function () {
	let id;
	if (options.getHostResPrio() === options.HOST_PRIO.RESOLUTION) {
		let resolutionIndex;
		this.resolutionOrder.some((resolution, index) => {
			this.hostOrder.some(host => {
				if (this.videoMap[host]) {
					id = this.videoMap[host][resolution];
				}
				if (id !== undefined) {
					this.resolution = resolution;
					this.host = host;
					return true;
				}
			});
			if (id !== undefined) {
				resolutionIndex = index;
				return true;
			}
		});
		if (resolutionIndex) {
			this.resolutionOrder.splice(0, resolutionIndex);
		}
	} else {
		let hostIndex;
		this.hostOrder.some((host, index) => {
			this.resolutionOrder.some(resolution => {
				if (this.videoMap[host]) {
					id = this.videoMap[host][resolution];
				}
				if (id !== undefined) {
					this.resolution = resolution;
					this.host = host;
					return true;
				}
			});
			if (id !== undefined) {
				hostIndex = index;
				return true;
			}
		});
		if (hostIndex) {
			this.hostOrder.splice(0, hostIndex);
		}
	}
	return id;
};

MoeVideoPlayer.prototype.startLoading = function () {
	// clearTimeout(this.loadTimeoutId);
	this.player.src(this.getVideoUrl());
	// this.loadTimeoutId = setTimeout(() => {
	// 	this.tryNextVideo();
	// }, this.loadTimeout);
};

MoeVideoPlayer.prototype.tryNextVideo = function () {
	delete this.videoMap[this.host][this.resolution];
	if (Object.keys(this.videoMap[this.host]).length === 0) {
		delete this.videoMap[this.host];
	}
	if (Object.keys(this.videoMap).length === 0) {
		// All versions tried
		return;
	}
	this.startLoading();
};