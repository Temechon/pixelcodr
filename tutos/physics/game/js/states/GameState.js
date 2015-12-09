/**
 * The state used for player to select their colors
 * @param game
 * @constructor
 */
var GameState = function(game) {
    State.call(this, game);

    // All gamepad id currently connected
    this.gamepadIds = [];
};


GameState.prototype = Object.create(State.prototype);
GameState.prototype.constructor = GameState;


GameState.prototype = {


    _initScene : function() {

        var scene = new BABYLON.Scene(this.engine);
        scene.enablePhysics();

        // Camera attached to the canvas
        var camera= new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 30, -30), scene);
        camera.setTarget(new BABYLON.Vector3(0,0,0));
        camera.attachControl(this.engine.getRenderingCanvas());

        // Hemispheric light to light the scene
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
        h.groundColor = BABYLON.Color3.FromInts(255,83,13);
        h.intensity = 0.9;

        // Ground creation
        var ground = BABYLON.Mesh.CreateGround("ground", 500, 500, 1, scene);
        ground.receiveShadows = true;
        ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:0, restitution:0.5, friction:0.1});

        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.FromInts(121,189,224);

        var mur = BABYLON.Mesh.CreateBox("box", 1.0, scene);
        mur.scaling = new BABYLON.Vector3(50,10,1);
        mur.position.z = -10;
        mur.material = mat;
        mur.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:0, restitution:0.5, friction:0.1});

        return scene;
    },

    /**
     * Run the current state
     */
    run : function() {

        this.scene = this._initScene();


        // The loader
        var loader =  new BABYLON.AssetsManager(this.scene);

        //    var meshTask = this.loader.addMeshTask("skull task", "", "./assets/", "block02.babylon");
        //    meshTask.onSuccess = this._initMesh;

        var _this = this;
        loader.onFinish = function (tasks) {

            // Init the game
            _this._initGame();

            // The state is ready to be played
            _this.isReady = true;

            _this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };

        loader.load();
    },

    _initGame : function() {
        new Player(this.game, this.scene);
    }
};
