
var randomNumber = function (min, max) {
    if (min == max) {
        return (min);
    }
    var random = Math.random();
    return Math.floor(((random * (max - min)) + min));
};



function axis(scene, size) {
    //X axis
    var x = BABYLON.Mesh.CreateCylinder("x", size, 0.1, 0.1, 4, scene, false);

    x.material = new BABYLON.StandardMaterial("xColor", scene);
    x.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

    x.position = new BABYLON.Vector3(size/2, 0, 0);
    x.rotation.z = Math.PI / 2;

    //X axis cone
    var x_cone = BABYLON.Mesh.CreateCylinder("xCone", 0.5, 0, 0.3, 5, scene, false);

    x_cone.material = new BABYLON.StandardMaterial("xConeColor", scene);
    x_cone.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

    x_cone.position = new BABYLON.Vector3(size + 0.1, 0, 0);
    x_cone.rotation.z = Math.PI / 2;

    //Y axis
    var y = BABYLON.Mesh.CreateCylinder("y", size, 0.1, 0.1, 4, scene, false);

    y.material = new BABYLON.StandardMaterial("yColor", scene);
    y.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

    y.position = new BABYLON.Vector3(0, size / 2, 0);

    //Y axis cone
    var y_cone = BABYLON.Mesh.CreateCylinder("yCone", 0.5, 0.3, 0, 5, scene, false);

    y_cone.material = new BABYLON.StandardMaterial("yConeColor", scene);
    y_cone.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

    y_cone.position = new BABYLON.Vector3(0, size + 0.1, 0);

    //Z axis
    var z = BABYLON.Mesh.CreateCylinder("z", size, 0.1, 0.1, 4, scene, false);

    z.material = new BABYLON.StandardMaterial("zColor", scene);
    z.material.diffuseColor = new BABYLON.Color3(0, 0, 1);

    z.position = new BABYLON.Vector3(0, 0, size/2);
    z.rotation.x = Math.PI / 2;

    //Z axis cone
    var z_cone = BABYLON.Mesh.CreateCylinder("zCone", 0.5, 0.3, 0, 5, scene, false);

    z_cone.material = new BABYLON.StandardMaterial("zConeColor", scene);
    z_cone.material.diffuseColor = new BABYLON.Color3(0, 0, 1);

    z_cone.position = new BABYLON.Vector3(0, 0, size + 0.1);
    z_cone.rotation.x = Math.PI / 2;
}