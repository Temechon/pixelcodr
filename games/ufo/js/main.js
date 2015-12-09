
var w = 768;
var h = 1024;

window.onload = function () {

    var game = new Phaser.Game(w, h, Phaser.AUTO, '');

    game.state.add('boot', Boot);
    game.state.add('preloader', Preloader);
    game.state.add('game', Game);
    game.state.add('mainmenu', MainMenu);

    game.state.start('boot');
};
