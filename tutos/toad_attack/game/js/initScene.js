// Namespace declaration
var TOAD_ATTACK = {};

// Contains all enemies visible on screen
TOAD_ATTACK.ENEMIES = [];

// Toads names
TOAD_ATTACK.TOADS = ["red_toad","red_toad","red_toad"];

// Toads prefabs storing list
TOAD_ATTACK.TOADS_MODELS = [];

// Endings storing list
TOAD_ATTACK.ENDINGS = [];

// Ending width
TOAD_ATTACK.ENDING_WIDTH = 3;

// Score
TOAD_ATTACK.SCORE = 0;

// Number of toads
TOAD_ATTACK.TOTAL_NUMBER = 0;

/**
 * Load the scene when the canvas is fully loaded
 */
document.addEventListener("DOMContentLoaded", function () {
	if (BABYLON.Engine.isSupported()) {
        onload();
	}
}, false);


//Initialize the Babylon engine, TOAD_ATTACK.scene, camera and light.
var initScene = function () {
    // ENGINE CREATION

    // Get canvas
    TOAD_ATTACK.canvas = document.getElementById("renderCanvas");

    // Create babylon engine
    TOAD_ATTACK.engine = new BABYLON.Engine(TOAD_ATTACK.canvas, true);

    // Create scene
    TOAD_ATTACK.scene = new BABYLON.Scene(TOAD_ATTACK.engine);
    TOAD_ATTACK.scene.clearColor = new BABYLON.Color3(0.9,0.9,0.9);

    // Create camera
    TOAD_ATTACK.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), TOAD_ATTACK.scene);
    TOAD_ATTACK.camera.maxZ = 1200;
    TOAD_ATTACK.camera.setTarget(new BABYLON.Vector3(0,0,10));

    // Create light
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), TOAD_ATTACK.scene);

    // DEBUG ONLY //
    TOAD_ATTACK.camera.attachControl(TOAD_ATTACK.canvas);
    //axis(TOAD_ATTACK.scene, 1.0);
    // END DEBUG //

	var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, TOAD_ATTACK.scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", TOAD_ATTACK.scene);
	skyboxMaterial.backFaceCulling = false;
	skybox.material = skyboxMaterial;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/cubemap/cubemap", TOAD_ATTACK.scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
};


var onload = function () {

    initScene();

    /// 2/// 2
    initGame();
// -------------------------


    TOAD_ATTACK.engine.runRenderLoop(function () {
        TOAD_ATTACK.scene.render();
        /// 4
        TOAD_ATTACK.ENEMIES.forEach(function (note) {
        if (note.pressed) {
            note.position.y += 0.5;
        } else {
            note.position.z -= 0.5;
        }

// Remove old notes
        cleanEnemies();
    });
    });

// -------------------------


};

/// 3//Initialize the game  : lanes, camera position
var initGame = function() {
    // Number of lanes
    var LANE_NUMBER = 3;
    // Space between lanes
    var LANE_INTERVAL = 5;
    var LANES_POSITIONS = [];

    var NOTE_START_POSITION_Z = 100;

	var ground = new BABYLON.StandardMaterial("ground", TOAD_ATTACK.scene);
	var texture = new BABYLON.Texture("assets/ground.jpg", TOAD_ATTACK.scene);
	texture.uScale = 40;
	texture.vScale = 2;
	ground.diffuseTexture =texture;

    // Function to create lanes
    var createLane = function (id, position) {
        var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, TOAD_ATTACK.scene);
        lane.scaling.y = 0.1;
        lane.scaling.x = 3;
        lane.scaling.z = 800;
        lane.position.x = position;
        lane.position.z = lane.scaling.z/2-200;
	    lane.material = ground;
    };

    // Create the ending box
    var mat = new BABYLON.StandardMaterial("endingMat", TOAD_ATTACK.scene);
    mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);

    var createEnding = function (id, position) {
        var ending = BABYLON.Mesh.CreateGround(id, TOAD_ATTACK.ENDING_WIDTH, 4, 1, TOAD_ATTACK.scene);
        ending.position.x = position;
        ending.position.y = 0.1;
        ending.position.z = 1;
        var mat = new BABYLON.StandardMaterial("endingMat", TOAD_ATTACK.scene);
        mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
        ending.material = mat;
        return ending;
    };

    var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER/2);
    for (var i = 0; i<LANE_NUMBER; i++){
        LANES_POSITIONS[i] = currentLanePosition;
        createLane(i, currentLanePosition);
        TOAD_ATTACK.ENDINGS.push(createEnding(i, currentLanePosition));
        currentLanePosition += LANE_INTERVAL;
    }

    // Adjust TOAD_ATTACK.camera position
    TOAD_ATTACK.camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER/2)];

     // Load enemies
     TOAD_ATTACK.TOADS.forEach(function (t) {
     BABYLON.SceneLoader.ImportMesh(t, "assets/", "toad.babylon", TOAD_ATTACK.scene, function (meshes) {
     var m = meshes[0];
     m.isVisible = false;
     m.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
     TOAD_ATTACK.TOADS_MODELS.push(m);
     });
     });


     // Creates a note in a random lane
     var createEnemy = function () {
     if (TOAD_ATTACK.TOADS_MODELS.length > 0){
     var posZ = NOTE_START_POSITION_Z;
     // random lane
     var posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

     var m = TOAD_ATTACK.TOADS_MODELS[randomNumber(0,3)];
     var note = m.clone(m.name+TOAD_ATTACK.TOTAL_NUMBER);
     note.id = m.name+(TOAD_ATTACK.TOTAL_NUMBER++);
     note.pressed = false;
     note.isVisible = true;
     note.position = new BABYLON.Vector3(posX, note.position.y/2, posZ);
     TOAD_ATTACK.ENEMIES.push(note);
     }
     };

     setInterval(createEnemy, 350);

};

/// 5
var cleanEnemies = function () {
    for (var n=0; n<TOAD_ATTACK.ENEMIES.length; n++) {
        if (TOAD_ATTACK.ENEMIES[n].position.z < -10 || TOAD_ATTACK.ENEMIES[n].position.y > 3) {
            var note = TOAD_ATTACK.ENEMIES[n];
            note.dispose();
            TOAD_ATTACK.ENEMIES.splice(n, 1);
            n--;
        }
    }
};

/// 6
var getNoteOnEnding = function (ending) {
    for (var i=0; i<TOAD_ATTACK.ENEMIES.length; i++){
        var note = TOAD_ATTACK.ENEMIES[i];
        var label, score;
        if (note.position.x === ending.position.x) {
            var diffSup = ending.position.z + (TOAD_ATTACK.ENDING_WIDTH);
            var diffInf = ending.position.z - (TOAD_ATTACK.ENDING_WIDTH);

            if (note.position.z > diffInf && note.position.z < diffSup ) {
                // compute score
                var t = Math.abs(ending.position.z-note.position.z);
                if (t <= 1){
                    label = "PERFECT !!";
                    score = 4;
                } else if (t <= 1.5){
                    label = "Good !";
                    score = 2;
                }else {
                    label = "Ok";
                    score = 1;
                }

                return {note: note, label:label, score:score};
            }
        }
    }
};

/// 7

// Animate the ending
var animateEnding = function (ending) {
    var posY = ending.position.y;
    var animateEnding = new BABYLON.Animation(
        "animateEnding",
        "position.y",
        100,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var keys = [];
    keys.push({
        frame: 0,
        value: posY
    },{
        frame: 5,
        value: posY+0.5
    },{
        frame: 10,
        value: posY
    });

    animateEnding.setKeys(keys);
    ending.animations.push(animateEnding);
    TOAD_ATTACK.scene.beginAnimation(ending, 0, 10, false, 1);
};

/// 8
var onKeyDown = function (evt) {
    var currentEnding = -1;
    switch (evt.keyCode) {
        case 65 : //'A'
            currentEnding = 0;
            break;
        case 90 : //'Z'
            currentEnding = 1;
            break;
        case 69 : //'E'
            currentEnding = 2;
            break;
    }
    if (currentEnding != -1) {
        animateEnding(TOAD_ATTACK.ENDINGS[currentEnding]);
        var res = getNoteOnEnding(TOAD_ATTACK.ENDINGS[currentEnding]);
        var note = res.note;
        if (note) {
            // play sound, jump note
            note.material = null;
            note.pressed = true;

            // SPARKS !!!
            var particleSystem = new BABYLON.ParticleSystem("particles", 10, TOAD_ATTACK.scene);
            particleSystem.particleTexture = new BABYLON.Texture("assets/coins.png", TOAD_ATTACK.scene);
            particleSystem.emitter = TOAD_ATTACK.ENDINGS[currentEnding];
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
            particleSystem.updateSpeed = 0.15;
            particleSystem.targetStopDuration  = 2;
            particleSystem.start();

            // Display score
            document.getElementById("label").innerHTML = res.label;
            TOAD_ATTACK.SCORE += res.score;
            document.getElementById("score").innerHTML = TOAD_ATTACK.SCORE;

        }
    }
};
window.addEventListener("keydown", onKeyDown);
