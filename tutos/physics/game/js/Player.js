var Player = function(game, scene, gamepad) {

    this.game = game;
    this.scene = scene;
    this.gamepad = gamepad;

    /* MESH */
    this.box = BABYLON.Mesh.CreateBox("player", 5, this.scene);
    this.box.position.y = 2;
    this.body = this.box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:1, friction:0.001, restitution:1.5});
    var matos = new BABYLON.StandardMaterial("matos", this.scene);
    matos.diffuseColor = BABYLON.Color3.Green();
    this.box.material = matos;

    // Movement directions : top, bot, left, right
    this.mvtDirection = [0,0,0,0];

    // The player speed
    this.speed = 0.5;

    /* GAMEPAD*/
    var _this = this;
    this.scene.registerBeforeRender(function() {
        _this.update();
    });

    /* KEYBOARD */
    window.addEventListener("keyup", function(evt) {
        _this.handleKeyUp(evt.keyCode);
    });

    window.addEventListener("keydown", function(evt) {
        _this.handleKeyDown(evt.keyCode);
    });
};

Player.DIRECTIONS = {
    ZQSD : {
        TOP     : 90,
        BOT     : 83,
        LEFT    : 81,
        RIGHT   : 68
    },
    QWSD : {
        TOP     : 87,
        BOT     : 83,
        LEFT    : 65,
        RIGHT   : 68
    }
};

Player.ACTIONS = {
    FIRE : {
        TOP     : 38,
        BOT     : 40,
        LEFT    : 37,
        RIGHT   : 39
    }
};

Player.prototype = {

    update : function() {
        this.move();
    },

    /**
     * Store the player direction.
     * Two directions are available : the movement direction
     * and the firing direction.
     * @private
     */
    _chooseDirection : function(direction, value) {
        this.mvtDirection[direction] = value;
    },

    move : function() {

        var s = 5;

        if (this.mvtDirection[0] != 0) {
            this.box.applyImpulse(new BABYLON.Vector3(0,0,s), this.box.position);
        }
        if (this.mvtDirection[1] != 0) {
            this.box.applyImpulse(new BABYLON.Vector3(0,0,-s), this.box.position);
        }
        if (this.mvtDirection[2] != 0) {
            this.box.applyImpulse(new BABYLON.Vector3(-s,0,0), this.box.position);
        }
        if (this.mvtDirection[3] != 0) {
            this.box.applyImpulse(new BABYLON.Vector3(s,0,0), this.box.position);
        }
        this.body.body.linearVelocity.scaleEqual(0.92);
        this.body.body.angularVelocity.scaleEqual(0);
    },

    handleKeyDown : function(keycode) {
        switch (keycode) {
            case Player.DIRECTIONS.ZQSD.TOP :
            case Player.DIRECTIONS.QWSD.TOP :
                this._chooseDirection(0, 1);
                break;
            case Player.DIRECTIONS.ZQSD.BOT :
            case Player.DIRECTIONS.QWSD.BOT :
                this._chooseDirection(1, 1);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT :
                this._chooseDirection(2, 1);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT :
                this._chooseDirection(3, 1);
                break;
        }
    },

    handleKeyUp : function(keycode) {

        switch (keycode) {
            case Player.DIRECTIONS.ZQSD.TOP :
            case Player.DIRECTIONS.QWSD.TOP :
                this._chooseDirection(0,0);
                break;
            case Player.DIRECTIONS.ZQSD.BOT :
            case Player.DIRECTIONS.QWSD.BOT :
                this._chooseDirection(1, 0);
                break;
            case Player.DIRECTIONS.ZQSD.LEFT:
            case Player.DIRECTIONS.QWSD.LEFT :
                this._chooseDirection(2, 0);
                break;
            case Player.DIRECTIONS.ZQSD.RIGHT:
            case Player.DIRECTIONS.QWSD.RIGHT :
                this._chooseDirection(3, 0);
                break;
        }
    },

    destroy : function() {
        this.box.dispose();
    }
};