
// Materials
let air_material = new Material([0.,0.0,0.5], // Diffusion, i.e color
                                [0.99, 0.99, 0.99], // Transparency percentage
                                [0, 0, 0], // Reflection percentage
                                [1, 1, 1]); // Refraction indice
let red_material = new Material([1.,0.0,0.],
                                [0.2, 0.2, 0.2],
                                [0, 0, 0],
                                [1, 1, 1]);
let mirror_material = new Material([1.,1.0,1.],
                                [0,0,0],
                                [1.,1.0,1.0],
                                [1, 1, 1]);
let glass_material = new Material([0.5,0.0,0.5],
                                [0.5, 0.5, 0.5],
                                [0, 0, 0],
                                [1.1, 1.2, 1.3]);
let ground_material = new Material([1., 1., 1.],
                                [0.5, 0.5, 0.5],
                                [0, 0, 0],
                                [1, 1, 1]);

let materials = [];
materials.push(air_material.toArray());
materials.push(red_material.toArray());
materials.push(mirror_material.toArray());
materials.push(glass_material.toArray());
materials.push(ground_material.toArray());

// Boxels
let world_boxel = new Boxel([0,0,0], // position
                            [50,50,50], // sizes
                            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0], // lightning for each face and each channel (r,g,b)
                            0, // material id
                            -1, //parent boxel
                            [1, 2, 3, 4]); // inner boxels
let red_cube = new Boxel([22,22,22], [1,2,3], [5,0,10,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0], 1, 0, [-1, -1, -1, -1])
let mirror = new Boxel([25,22,22], [1,1,0.1], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 2, 0, [-1, -1, -1, -1])
let glass = new Boxel([23.5,23.5,22], [0.1,2,2], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 3, 0, [-1, -1, -1, -1])
let cloud = new Boxel([10.,10.,15.], [20,20,3], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 4, 0, [5, -1, -1, -1])
let littlecube = new Boxel([20,20,16], [2,1,0.1], [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 1, 4, [-1, -1, -1, -1])

let boxels = [];
boxels.push(world_boxel.toArray());
boxels.push(red_cube.toArray());
boxels.push(mirror.toArray());
boxels.push(glass.toArray());
boxels.push(cloud.toArray());
boxels.push(littlecube.toArray());

console.log(boxels);

let world_boxel_id = 0;

let width = 1000;
let height = 600;

let camera = new Camera(width, height)
camera.position = [20,20,20];

let lights = [new Light(10, [1., 1., 1.], [20,20,25], 0)];

let boxel_engine = new BoxelEngine(boxels, materials, camera, lights);

//events

let sensibilite = 0.001;

let mouse_down = false;
let mouse_x = 0;
let mouse_y = 0;
let mouse_click_x = 0;
let mouse_click_y = 0;
let teta_click = 0;
let phi_click = Math.PI/2

let change_mode = false;
let move_left = false;
let move_right = false;
let move_front = false;
let move_back = false;
let move_up = false;
let move_down = false;

window.addEventListener("keydown", function(event){
    if (event.code == "AltLeft"){
        change_mode = true;
    } else if(event.code == "KeyW"){
        move_front = true;
    } else if(event.code == "KeyS"){
        move_back = true;
    } else if(event.code == "KeyA"){
        move_left = true;
    } else if(event.code == "KeyD"){
        move_right = true;
    }  else if(event.code == "Space"){
        move_up = true;
    } else if(event.code == "ShiftLeft"){
        move_down = true;
    } else {
        console.log(event.code);
    }
});

window.addEventListener("keyup", function(event){
    if (event.code == "AltLeft"){
        change_mode = false;
    } else if(event.code == "KeyW"){
        move_front = false;
    } else if(event.code == "KeyS"){
        move_back = false;
    } else if(event.code == "KeyA"){
        move_left = false;
    } else if(event.code == "KeyD"){
        move_right = false;
    }  else if(event.code == "Space"){
        move_up = false;
    } else if(event.code == "ShiftLeft"){
        move_down = false;
    } else {
        console.log(event.code);
    }
});

window.addEventListener("mousedown", function(event){
    if (event.button == 0){
        mouse_down = true;
        mouse_click_x = event.x;
        mouse_click_y = event.y;
        teta_click = camera.teta;
        phi_click = camera.phi;
    } else {
        console.log(event.button);
    }
});

window.addEventListener("mouseup", function(event){
    if (event.button == 0){
        mouse_down = false
    } else {
        console.log(event.button);
    }
});

window.addEventListener("mousemove", function(event){
    mouse_x = event.x;
    mouse_y = event.y;
});

//run
// let fps = 25;
// let T = 1000/fps;
let v = 2; //vitesse en m/ms

let previousTimeStamp=0;

function nextFrame(timestamp){
    //time
    const dt = (timestamp - previousTimeStamp)/1000; // in secondes
    previousTimeStamp = timestamp;

    //fps
    let fps = document.getElementById("fps");
    fps.innerText = 1/dt + "fps";
    
    // Controls
    if (move_left){
        camera.position = add(camera.position, mul(v * dt,camera.ux));
    }
    if (move_right){
        camera.position = substract(camera.position, mul(v * dt,camera.ux));
    } 
    if (move_front){
        camera.position = add(camera.position, mul(v * dt,camera.u));
    }
    if (move_back){
        camera.position = substract(camera.position, mul(v * dt,camera.u));
    }
    if (move_up){
        camera.position[2] += v * dt;
    }
    if (move_down){
        camera.position[2] -= v * dt;
    }

    if (mouse_down){
        let dx = mouse_click_x - mouse_x;
        let dy = mouse_click_y - mouse_y;
        
        let teta = teta_click - sensibilite * dx;
        let phi = phi_click - sensibilite * dy;

        camera.teta = teta;
        camera.phi = phi;
    }

    //draw frame
    camera.update();
    boxel_engine.render();

    window.requestAnimationFrame(nextFrame);
}

function run(){
    window.requestAnimationFrame(nextFrame);
}

run();