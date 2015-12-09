Preloader = function (game) {
};

Preloader.prototype = {

    preload: function () {

        var label2 = this.game.add.text(Math.floor(w/2)+0.5, Math.floor(h/2)-15+0.5, 'Loading...', { font: '30px Arial', fill: '#000' });
        label2.anchor.setTo(0.5, 0.5);

	    var preloading2 = this.game.add.sprite(w/2, h/2+15, 'loading2');
	    preloading2.x -= preloading2.width/2;

	    var preloading = this.game.add.sprite(w/2, h/2+19, 'loading');
	    preloading.x -= preloading.width/2;
	    this.game.load.setPreloadSprite(preloading);

        // HERE LOAD AL GAME ASSETS
	    this.game.load.image('kzark', 'assets/kzark.png');
	    this.game.load.image('alien_attack', 'assets/kzark2.png');
	    this.game.load.image('crystal', 'assets/crystal.png');
        this.game.load.image('laser', 'assets/laser.png');
        this.game.load.image('shield', 'assets/shield.png');
        this.game.load.image('potion', 'assets/potion.png');

        this.game.load.image('cross', 'assets/cross.png');
        this.game.load.image('linkv', 'assets/link_v.png');
        this.game.load.image('linkh', 'assets/link_h.png');
        this.game.load.image('linkol', 'assets/link_ol.png');
        this.game.load.image('linkor', 'assets/link_or.png');

		// particules
	    this.game.load.image('explosion', 'assets/particules/explosion.png');
	    this.game.load.image('laser_explosion', 'assets/particules/laser.png');
	    this.game.load.image('shield_explosion', 'assets/particules/shield.png');
	    this.game.load.image('crystal_explosion', 'assets/particules/crystal.png');
	    this.game.load.image('alien_explosion', 'assets/particules/alien.png');

	    // menu
        this.game.load.image('lifebar_max', 'assets/menu/lifebar_max.png');
        this.game.load.image('lifebar', 'assets/menu/lifebar.png');
        this.game.load.image('header', 'assets/menu/header.png');
        this.game.load.image('footer', 'assets/menu/footer.png');
        // xp and gem bars
        this.game.load.image('gem_max', 'assets/menu/gem_max.png');
        this.game.load.image('gem', 'assets/menu/gem.png');
        this.game.load.image('xp_max', 'assets/menu/xp_max.png');
        this.game.load.image('xp', 'assets/menu/xp.png');
        // bitmap font
	    this.game.load.bitmapFont('boombox', 'assets/font/boombox.png', 'assets/font/boombox.fnt');
	    this.game.load.bitmapFont('boombox_stroke', 'assets/font/boombox_stroke.png', 'assets/font/boombox_stroke.fnt');
        // attack & defense
        this.game.load.image('attack', 'assets/menu/attack.png');
        this.game.load.image('defense', 'assets/menu/defense.png');
        // items
        this.game.load.image('item1', 'assets/menu/item1.png');
        this.game.load.image('item2', 'assets/menu/item2.png');
        // skills
        this.game.load.image('skill1', 'assets/menu/skills/skill1.png');
	    this.game.load.image('skill2', 'assets/menu/skills/skill2.png');
	    this.game.load.image('delete_random_line', 'assets/menu/skills/delete_random_line.png');
	    this.game.load.image('sc_back', 'assets/menu/skillchooser/back.png');


    },

    create: function () {
        this.game.state.start('mainmenu');
    }

}
