var UFO = UFO ||{};

// The game states
UFO.GameStates = {

	PLAYER_TURN : 0,

	PENDING : 1,

	ALIEN_TURN : 2

};

Game = function (game) {

};

Game.prototype = {

    preload: function () {

    },

    create: function () {

	    this.game.board = new UFO.Gameboard(this.game);

        // Creates the menu
        this.game.add.sprite(4,6, 'header');
        this.game.add.sprite(4,837, 'footer');

        // Creates the board game
        this.items = this.game.board.create();

        this.game.player = new UFO.Player(this.game);

        // Player UI : life bar, xp bar, gem, and stats (attack defense
        this.game.player.createUi();

	    // The player can play
	    this.game.ufostate = UFO.GameStates.PLAYER_TURN;

	    /*this.game.board.deactivateAction = true;
	    var sc = new UFO.Skillchooser(this.game);
	    sc.display();*/
    },

    update : function() {
	    // If the player leaves the board
        if (!this.game.input.activePointer.withinGame) {
            this.game.board.onItemReleased(null, null);
        }


        // Is the player dead ?
        if (this.game.player.isDead()){
	        // GAME OVEEEERR
	        this.game.state.start('mainmenu');
        }


	    // If the game is waiting a player choice
		else if (this.game.ufostate == UFO.GameStates.PENDING) {
			// Nothing to do, just wait for the end of the choice
		}

		// Can the player play ?
		else if (this.game.ufostate == UFO.GameStates.PLAYER_TURN){
			// The player must selected X items on the game board
		}

		// Can aliens play ?
		else if (this.game.ufostate == UFO.GameStates.ALIEN_TURN){

			// is xp full ?
			if (this.game.player.canBuySkills()) {
				this.game.ufostate = UFO.GameStates.PENDING;
				// display skill chooser
				// The skill chooser will reset the game state
				var sc = new UFO.Skillchooser(this.game);
				sc.display();
			}
			// is gold full ?
			/*else if (this.game.player.canBuyItems()) {
			 this.game.ufostate = UFO.GameStates.PENDING;
			 // display item chooser
			 // The item chooser will reset the game state
			 }*/

			else {
				this.game.ufostate = UFO.GameStates.PENDING;
				// Time to attack ! At the end of the alien turn, the game state will be set to player turn
				this.game.board.alienTurn();
			}
		}

    }
};
