
// Materials
let air_material = new Material([0.,0.0,0.5], 0.99, 0, 1);
let red_material = new Material([1.,0,0], 0.0, 0, 1);
let mirror_material = new Material([0,1.0,0], 0.0, 0.5, 1);
let glass_material = new Material([0.5,0.,0.5], 0.5, 0.0, 1.1);
let ground_material = new Material([1.,1.,1.], 0.0, 0.0, 1.);

let materials = [];
materials.push(air_material.toArray());
materials.push(red_material.toArray());
materials.push(mirror_material.toArray());
materials.push(glass_material.toArray());
materials.push(ground_material.toArray());

// Boxels
let world_boxel = new Boxel([0,0,0], [50,50,50], [1,0,0,0,0,0], 0, -1, [1, 2, 3, 4]);
let red_cube = new Boxel([22,22,22], [1,2,3], [5,0.5,10,1,0,0], 1, 0, [-1, -1, -1, -1])
let mirror = new Boxel([25,22,22], [1,1,0.1], [0,0,0,0,0,0], 2, 0, [-1, -1, -1, -1])
let glass = new Boxel([23.5,23.5,22], [0.1,2,2], [0,0,0,0,0,0], 3, 0, [-1, -1, -1, -1])
let ground = new Boxel([10.,10.,20.], [20,20,0.5], [1,1,1,1,1,1], 4, 0, [-1, -1, -1, -1])

let boxels = [];
boxels.push(world_boxel.toArray());
boxels.push(red_cube.toArray());
boxels.push(mirror.toArray());
boxels.push(glass.toArray());
boxels.push(ground.toArray());

let world_boxel_id = 0;

console.log(boxels);

let width = 800;
let height = 500;

let camera = new Camera(width, height)
camera.position = [20,20,20];
camera.drawFrame(boxels, materials, world_boxel_id);
//console.log(camera.fooGPU(boxels));

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
    camera.drawFrame(boxels, materials, world_boxel_id);

    window.requestAnimationFrame(nextFrame);
}

function run(){
    window.requestAnimationFrame(nextFrame);
}

run();