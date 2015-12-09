Boot = function (game) { };

Boot.prototype = {
    preload: function () {
	    this.game.stage.backgroundColor = "#FFF";
	    this.game.load.image('loading', 'assets/loading.png');
        this.game.load.image('loading2', 'assets/loading2.png');
    },

    create: function() {

	    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.scale.minWidth = 1024/2;
	    this.scale.minHeight = 768/2;
	    this.scale.maxWidth = 1024;
	    this.scale.maxHeight = 768;
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
	    this.scale.setScreenSize(true);

	    // force landscape, force portrait
	    this.scale.forceOrientation(true, false);

        this.game.state.start('preloader');
    }
};