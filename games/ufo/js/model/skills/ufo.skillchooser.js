var UFO = UFO || {};

/**
 * Menu allowing the player to choose a skill
 * @param game
 */
UFO.Skillchooser = function(game) {
	this.game = game;

	// The skills to display
	this.skills = [];

	// The skill factory
	this.skillFactory;

	// The background of the skil chooser
	this.background;

	// The number of skill to select for this skill chooser
	this.numberToSelect = 1;
};

/**
 * Display the skill chooser with 3 skill to display
 */
UFO.Skillchooser.prototype.display = function() {

	// Get 3 random skills with the skill factory
	this.skills.push(new UFO.DeleteRandomLineSkill(this.game));
	this.skills.push(new UFO.DeleteRandomLineSkill(this.game));
	this.skills.push(new UFO.DeleteRandomLineSkill(this.game));

	// Display background
	if (this.background) {
		this.background.reset(0, 0);
	} else {
		this.background = this.game.add.sprite(0, 0, 'sc_back');
	}

	// Display skills
	this.skills[0].pos = new Phaser.Point(200, 200);
	this.skills[1].pos = new Phaser.Point(200, 400);
	this.skills[2].pos = new Phaser.Point(200, 600);

	var that = this;
	this.skills.forEach(function(s) {
		s.setTemporaryAction(that.selectSkill, that);
		s.display();
	})
};

// Remove this skill chooser from the screen
UFO.Skillchooser.prototype.delete = function() {

	this.skills.forEach(function(s) {
		s.dispose();
	});
	this.skills = [];

	this.background.destroy(true);
};

/**
 * The action launched when a skill is selected
 * @param sprite
 */
UFO.Skillchooser.prototype.selectSkill = function(sprite) {

	var s = sprite.skill.clone();

	s.pos = UFO.Skill.SKILL_1;
	this.game.player.addSkill(s);

	this.delete();

	this.game.time.events.add(Phaser.Timer.QUARTER*3, function() {
		this.game.ufostate = UFO.GameStates.ALIEN_TURN;
	}, this);

};


