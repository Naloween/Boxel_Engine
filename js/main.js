
// Lights

let my_light = new Light(100, [1., 1., 1.], [30,30,30], 0);

// Materials
let air_material = new Material([1,1,1], // Diffusion, i.e color
                                [0.999,0.9993,0.9995], // Transparency percentage
                                [0, 0, 0], // Reflection percentage
                                [1, 1, 1]); // Refraction indice
let red_material = new Material([1.,0.0,0.],
                                [0.5, 0.5, 1.],
                                [0, 0, 0],
                                [1, 1, 1]);
let mirror_material = new Material([1.,1.0,1.],
                                [0,0,0],
                                [1.,1.0,1.0],
                                [1, 1, 1]);
let glass_material = new Material([1.,0.0,1.],
                                [0.5, 0.5, 0.5],
                                [0, 0, 0],
                                [1.1, 1.2, 1.3]);
let ground_material = new Material([1., 1., 1.],
                                [0, 0, 0],
                                [0, 0, 0],
                                [1, 1, 1]);

// Boxels
let world_boxel = new Boxel([0,0,0], // position
                            [1000,1000,1000], // sizes
                            air_material, // material
                            null, //parent boxel
                            [], // inner boxels
                            my_light); // Light
let red_cube = new Boxel([22,22,22], [1,2,3], red_material, world_boxel, [], null)
let mirror = new Boxel([25,22,22], [1,1,0.1], mirror_material, world_boxel, [],null)
let glass = new Boxel([23.5,23.5,22], [0.1,2,2], glass_material, world_boxel, [],null)
let cloud = new Boxel([10.,10.,15.], [20,20,3], ground_material, world_boxel, [],null)
let littlecube = new Boxel([20,20,16], [2,1,0.1], red_material, world_boxel, [],null)

world_boxel.inner_boxels.push(red_cube);
world_boxel.inner_boxels.push(mirror);
world_boxel.inner_boxels.push(glass);
world_boxel.inner_boxels.push(cloud);

let width = 1000;
let height = 600;

let camera = new Camera(width, height, document.getElementById("view"));
camera.position = [20,20,30];

let boxel_engine = new BoxelEngine(camera, world_boxel);

console.log(boxels);

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
let running = false;
let v = 2; //vitesse en m/ms
let previousTimeStamp=0;

function nextFrame(timestamp){
    if (!running){
        return
    }

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
    if (running){
        window.requestAnimationFrame(nextFrame);
    }
}

console.log("starting Boxel Engine...");
play_btn = document.getElementById("play_btn");
play_btn.addEventListener("mousedown",(event)=>{
    if (event.button == 0){
        running = !running;
        run();
    }
});