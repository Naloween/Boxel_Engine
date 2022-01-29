
// GPU functions
function intersectionGPU(boxel_position, boxel_sizes, cast_point, direction){
    let t_minx = direction[0] == 0 ? -1. : (boxel_position[0] - cast_point[0]) / direction[0];
    let t_maxx = direction[0] == 0 ? -1. : (boxel_position[0] + boxel_sizes[0] - cast_point[0]) / direction[0];
    let t_miny = direction[1] == 0 ? -1. : (boxel_position[1] - cast_point[1]) / direction[1];
    let t_maxy = direction[1] == 0 ? -1. : (boxel_position[1] + boxel_sizes[1] - cast_point[1]) / direction[1];
    let t_minz = direction[2] == 0 ? -1. : (boxel_position[2] - cast_point[2]) / direction[2];
    let t_maxz = direction[2] == 0 ? -1. : (boxel_position[2] + boxel_sizes[2] - cast_point[2]) / direction[2];

    let face_min = 0;
    let face_max = 1;
    let t_min = t_minx;
    let t_max = t_maxx;

    if (t_maxx < t_minx) {
        t_min = t_maxx;
        t_max = t_minx;
        face_min = 1;
        face_max = 0;
    }

    if (t_miny < t_maxy){
        if (t_min < t_miny) {
            t_min = t_miny;
            face_min = 2;
        }
        if (t_max > t_maxy) {
            t_max = t_maxy;
            face_max = 3;
        }
    } else {
        if (t_min < t_maxy) {
            t_min = t_maxy;
            face_min = 3;
        }
        if (t_max > t_miny) {
            t_max = t_miny;
            face_max = 2;
        }
    }

    if (t_minz < t_maxz){
        if (t_min < t_minz) {
            t_min = t_minz;
            face_min = 4;
        }
        if (t_max > t_maxz) {
            t_max = t_maxz;
            face_max = 5;
        }
    } else {
        if (t_min < t_maxz) {
            t_min = t_maxz;
            face_min = 5;
        }
        if (t_max > t_minz) {
            t_max = t_minz;
            face_max = 4;
        }
    }

    if (t_min > t_max || t_max < 0.) {
        return [-1, -1]
    } else {
        if (t_min < 0.){
            return [t_max, face_max]
        } else {
            return [t_min, face_min]
        }
    }
    
}

function castRayGPU(boxels, materials, lights, ray_boxel_id, cast_point, direction, channel){

    // return color

    let color = 0.

    let iteration = 0;
    let next_ray = true;
    let next_ray_boxel_id = ray_boxel_id;
    let next_ray_percentage = 1;
    let next_ray_cast_point = cast_point;
    let next_ray_direction = direction;
    
    while ( next_ray && iteration < 3){
        next_ray = false;
        let boxel_id = next_ray_boxel_id;
        let ray_percentage = next_ray_percentage;

        if (boxel_id < 0){
            break;
        }

        let current_cast_point = next_ray_cast_point;
        let current_direction = next_ray_direction;
        let distance = 0.;
        let nb_steps = 0;

        while (nb_steps < 10) {
    
            //Calcul de t la distance entre le point de cast et le bord le plus proche du boxel
            let res = intersectionGPU(
                [boxels[boxel_id][0], boxels[boxel_id][1], boxels[boxel_id][2]],
                [boxels[boxel_id][3], boxels[boxel_id][4], boxels[boxel_id][5]],
                current_cast_point, current_direction);
            let t = res[0];
            let face = res[1];
            if (t < 0) {
                break;
            }
    
            let potential_next_boxel_id = -1;
    
            //On regarde si on intercepte un boxel contenu dans le boxel courant
            for (let k=0; k<4; k++){
                let inner_boxel_id = boxels[boxel_id][26 + k];
                if (inner_boxel_id >= 0){
                    let res = intersectionGPU(
                        [boxels[inner_boxel_id][0], boxels[inner_boxel_id][1], boxels[inner_boxel_id][2]],
                        [boxels[inner_boxel_id][3], boxels[inner_boxel_id][4], boxels[inner_boxel_id][5]],
                        current_cast_point, current_direction);
                    let t2 = res[0];
                    let face2 = res[1];
    
                    if (t2 > 0 && t2 < t){
                        t = t2;
                        face = face2;
                        potential_next_boxel_id = inner_boxel_id;
                    }
                }
            }
    
            t += 0.001;
    
            if (potential_next_boxel_id < 0){
                potential_next_boxel_id = boxels[boxel_id][25]; // set next boxel to parent boxel  
            }

            //Point d'arrivée du ray

            let next_cast_point = [current_cast_point[0] + t * current_direction[0],
            current_cast_point[1] + t * current_direction[1],
            current_cast_point[2] + t * current_direction[2]];
            let next_direction = current_direction;
    
            //Pass through current boxel
            let material_id = boxels[boxel_id][24];

            
            let transparency = materials[material_id][3 + channel];

            let light = 0.;
            
            if (transparency <= 0.){
                let nearest_face = 0;
                let distance_to_nearest_face = Math.abs(current_cast_point[0] - boxels[boxel_id][0]);

                for (let potential_nearest_face=1; potential_nearest_face < 6; potential_nearest_face++){
                    let F = boxels[boxel_id][potential_nearest_face / 2];
                    let add_size = potential_nearest_face % 2;

                    if ( add_size == 1){
                        F += boxels[boxel_id][3 + potential_nearest_face / 2]; //ajout de la size
                    }

                    let distance_to_face = Math.abs(current_cast_point[potential_nearest_face / 2] - F);
                    if (distance_to_face < distance_to_nearest_face){
                        distance_to_nearest_face = distance_to_face;
                        nearest_face = potential_nearest_face;
                    }
                }
                light += boxels[boxel_id][6 + 6 * channel + nearest_face];

            } else if(transparency >= 1.) {
                light = 0.0;
            } else {

                let id_light = boxels[boxel_id][30];

                if (id_light >= 0){ // Si le boxel possède une source de lumière
                    let t_dmin = (lights[id_light][4] - current_cast_point[0])*current_direction[0]
                                    + (lights[id_light][5] - current_cast_point[1])*current_direction[1]
                                    + (lights[id_light][6] - current_cast_point[2])*current_direction[2];
                    let dmin = Math.sqrt((current_cast_point[0] + t_dmin*current_direction[0] - lights[id_light][4])**2
                                        + (current_cast_point[1] + t_dmin*current_direction[1] - lights[id_light][5])**2
                                        + (current_cast_point[2] + t_dmin*current_direction[2] - lights[id_light][6])**2);
                    light += -lights[id_light][0] * lights[id_light][1 + channel] * (transparency**(Math.abs(t_dmin)+2*dmin))/dmin * (Math.atan((t_dmin-t)/dmin) - Math.atan(t_dmin/dmin));
                }
                
                for (let dir=0; dir< 6; dir++){
                    let index_direction = dir/2;
                    let F = boxels[boxel_id][index_direction];
                    let add_size = dir%2;
                    if ( add_size == 1){
                        F += boxels[boxel_id][3 + index_direction] //ajout de la size
                    }
                    let A = boxels[boxel_id][6 + 6 * channel + dir]; //light on face
    
                    let d = F - current_cast_point[index_direction] - t * (current_direction[index_direction] - 1);
                    let d0 = F - current_cast_point[index_direction];
                    let den = Math.log(transparency) * Math.abs(current_direction[index_direction] - 1);
    
                    if (d < 0){
                        if (d0 < 0){
                            light += A * Math.abs((transparency**(-d) - 2) / (den) - (transparency**(-d0) - 2) / den);
                        } else {
                            light += A * Math.abs((transparency**(-d) - 2) / (den) - (transparency**(d0)) / (-den));
                        }
                    } else {
                        if (d0 < 0){
                            light += A * Math.abs(transparency**d / (-den) - (transparency**(-d0) - 2) / den);
                        } else {
                            light += A * Math.abs(transparency**d / (-den) - (transparency**(d0)) / (-den));
                        }
                    }
                }
            }

            light *= ray_percentage * (1-transparency) * materials[material_id][channel] //diffusion
            color += light;
            ray_percentage *= transparency**t

            // check ray percentage

            if (ray_percentage <= 0.0) {
                break
            }
    
            if (potential_next_boxel_id >= 0){
                let next_material_id = boxels[potential_next_boxel_id][24];
                //Reflect on next boxel
                let coef_reflection = ray_percentage * materials[next_material_id][6 + channel];            
                
                let direction_reflection = [-current_direction[0], current_direction[1], current_direction[2]];
                if (face == 2 || face == 3) {
                    direction_reflection = [current_direction[0], -current_direction[1], current_direction[2]];
                } else if (face == 4 || face == 5){
                    direction_reflection = [current_direction[0], current_direction[1], -current_direction[2]];
                }
    
                let t_reflection = t - 0.02;
                    
                let cast_point_reflection = [current_cast_point[0] + t_reflection * current_direction[0],
                                            current_cast_point[1] + t_reflection * current_direction[1],
                                            current_cast_point[2] + t_reflection * current_direction[2]];
    
                if (!next_ray && coef_reflection > 0.0) {
                    ray_percentage *= (1-coef_reflection);
                    next_ray = true;
                    next_ray_percentage = coef_reflection;
                    next_ray_cast_point = cast_point_reflection;
                    next_ray_direction = direction_reflection;
                }
    
                // Refraction
                //n1sin(i) = n2sin(r)
                
                let n1 = materials[material_id][9 + channel];
                let n2 = materials[next_material_id][9 + channel];
                if (n2 != n1) {
                    let normale = [1., 0., 0.];
                    if (face == 2 || face == 3){
                        normale = [0., 1., 0.]
                    } else if (face == 4 || face == 5){
                        normale = [0., 0., 1.]
                    }
    
                    let cosi = current_direction[0] * normale[0] + current_direction[1] * normale[1] + current_direction[2] * normale[2];
                    if (cosi < 0.) {
                        cosi = -cosi;
                        normale = -normale;
                    }
                    let sini = Math.sqrt(1. - cosi * cosi);
                    let sinr = n1/n2 * sini;
                    let cosr = Math.sqrt(1. - sinr * sinr);
                    
                    let c = (cosr * cosr + sini * sini);
                    let normale90 = [c * current_direction[0] - cosr * normale[0],
                                    c * current_direction[1] - cosr * normale[1],
                                    c * current_direction[2] - cosr * normale[2]];
                    let norme_normale90 = Math.sqrt(normale90[0] * normale90[0] + normale90[1] * normale90[1] + normale90[2] * normale90[2])
                    normale90 = [normale90[0]/norme_normale90, normale90[1]/norme_normale90, normale90[2]/norme_normale90];
                    
                    let direction_refraction = [cosr * normale[0] + sinr * normale90[0],
                                                cosr * normale[1] + sinr * normale90[1],
                                                cosr * normale[2] + sinr * normale90[2]];
                    next_direction = direction_refraction;
                    
                    // Reflection totale quand r > pi/2
                    if (n1 > n2 && sini >= n2/n1) {
                        next_direction = direction_reflection;
                        next_cast_point = cast_point_reflection;
                        potential_next_boxel_id = boxel_id;
                    }
                }
    
                // Next step
                distance += t;
                current_cast_point = next_cast_point;
                current_direction = next_direction;
    
                boxel_id = potential_next_boxel_id;
                
                nb_steps += 1;
            } else {
                break;
            }
        }
    }
    
    return color;
}


function renderGPU(boxels, materials, lights, width, height, fov, u, ux, uy, position, boxel_id, diaphragme){
    
    
    let dx = fov * (this.thread.x - width/2) ;
    let dy = fov * ((height - this.thread.y) - height/2);

    let direction = [u[0] - dx * ux[0] - dy * uy[0],
                    u[1] - dx * ux[1] - dy * uy[1],
                    u[2] - dx * ux[2] - dy * uy[2]];
    let n = Math.sqrt(direction[0]*direction[0] + direction[1]*direction[1] + direction[2]*direction[2]);
    direction = [direction[0]/n, direction[1]/n, direction[2]/n]

    let r = castRayGPU(boxels, materials, lights, boxel_id, [position[0], position[1], position[2]], direction, 0);
    let g = castRayGPU(boxels, materials, lights, boxel_id, [position[0], position[1], position[2]], direction, 1);
    let b = castRayGPU(boxels, materials, lights, boxel_id, [position[0], position[1], position[2]], direction, 2);
    this.color(diaphragme * r, diaphragme * g, diaphragme * b, 1)
}

// Classes

class Light{
    constructor(power, color, position, parent){
        this.power = power;
        this.color = color;
        this.position = position;
        this.id = -1;
    }

    toArray(){
        let result = [this.power];
        result = result.concat(this.color);
        result = result.concat(this.position);

        return result;
    }
}

class Material{
    constructor(diffusion, transparency, reflection, refraction){
        this.diffusion = diffusion; // diffusion pour chaque couleur, entre 0 (transparent) et 1 (opaque)
        this.transparency = transparency;
        this.reflection = reflection; // entre 0 et 1
        this.refraction = refraction; //n1*sin(i) = n2*sin(r)
        this.id = -1;
    }

    toArray(){
        let result = this.diffusion;
        result = result.concat(this.transparency);
        result = result.concat(this.reflection);
        result = result.concat(this.refraction);

        return result //[r, g, b, transparency, reflection, refraction]
    }
}

class Boxel{
    constructor(position, sizes, material, parent_boxel, inner_boxels, light){
        this.position = position;
        this.sizes = sizes;
        this.lighting = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // each face has an amount of light, we store only the flux i.e amount of light / surface
        this.material = material; // id of material
        this.parent_boxel = parent_boxel;
        this.inner_boxels = inner_boxels; // ids of inner boxels
        this.light = light;
        this.id = -1;
    }

    toArray(){
        let result = this.position; //0
        result = result.concat(this.sizes); //3
        result = result.concat(this.lighting); //6
        result.push(this.material.id); // 24

        if (this.parent_boxel == null){ // 25
            result.push(-1);
        } else {
            result.push(this.parent_boxel.id);
        }

        for (let k=0; k<4; k++){ //26
            if (k >= this.inner_boxels.length){
                result.push(-1);
            } else {
                result.push(this.inner_boxels[k].id);
            }
        }

        if (this.light == null){ // 30
            result.push(-1);
        } else {
            result.push(this.light.id);
        }

        return result //[posx, posy, posz, sizex, sizey, sizez, lightnings, material_id, parent_boxel, boxelid1, boxelid2, boxelid3, boxelid4, light_id]
    }
}

class Camera{
    constructor(width, height, element_to_add_canvas){
        this.width = width;
        this.height = height;

        this.position = [0.0,0.0,0.0];
        this.teta = 0.0;
        this.phi = Math.PI/2.0;

        this.FOV = 0.001;
        this.diaphragme = 1;
        this.render_distance = 1000.0;

        this.u = new Array(3);
        this.ux = new Array(3);
        this.uy = new Array(3);

        this.update();

        this.gpu = new GPU();
        this.gpu.addFunction(intersectionGPU);
        this.gpu.addFunction(castRayGPU);
        this.render = this.gpu.createKernel(renderGPU)
        .setOutput([width, height])
        .setGraphical(true); 

        element_to_add_canvas.appendChild(this.render.canvas);
    }

    update(){        
        this.u[0] = Math.sin(this.phi) * Math.cos(this.teta);
        this.u[1] = Math.sin(this.phi) * Math.sin(this.teta);
        this.u[2] = Math.cos(this.phi);
        
        this.uy = [-Math.cos(this.phi) * Math.cos(this.teta),
            -Math.cos(this.phi) * Math.sin(this.teta),
            Math.sin(this.phi)];
        
        // ux produit vectoriel de u et uy
        
        this.ux = [this.u[1] * this.uy[2] - this.u[2] * this.uy[1],
            this.u[2] * this.uy[0] - this.u[0] * this.uy[2],
            this.u[0] * this.uy[1] - this.u[1] * this.uy[0]];
    }

    drawFrame(boxels, materials, lights, boxel_id){
        this.render(boxels, materials, lights,
            this.width, this.height, this.FOV,
            this.u, this.ux, this.uy,
            this.position, boxel_id, this.diaphragme);
    }
}

class BoxelEngine{
    constructor(camera, current_boxel){

        this.camera = camera;
        this.current_boxel = current_boxel;

        this.lights_array = [];
        this.materials_array = [];
        this.boxels_array = [];

        this.build_arrays();
        this.process_lights();
    }

    build_arrays(){

        this.boxels_on_gpu = [];
        for (let gpu_boxel of this.boxels_on_gpu){
            gpu_boxel.id = -1;
        }

        this.lights_array = [];
        this.materials_array = [];
        this.boxels_array = [];

        this.add_boxel_to_array(this.current_boxel);
        
    }

    add_boxel_to_array(boxel){

        if (boxel.light != null){
            if (boxel.light.id < 0){ // Si la lumière n'est pas déjà ajoutée
                boxel.light.id = this.lights_array.length;
                this.lights_array.push(boxel.light.toArray());
            }
        }

        if (boxel.material.id < 0){ // Si le material n'est pas déjà ajoutée
            boxel.material.id = this.materials_array.length;
            this.materials_array.push(boxel.material.toArray());
        }

        for (let inner_boxel of boxel.inner_boxels){
            this.add_boxel_to_array(inner_boxel);
        }

        boxel.id = this.boxels_array.length;
        this.boxels_array.push(boxel.toArray());
        this.boxels_on_gpu.push(boxel);

        for (let inner_boxel of boxel.inner_boxels){
            this.boxels_array[inner_boxel.id][25] = boxel.id;
        }
    }

    render(){
        this.camera.drawFrame(this.boxels_array, this.materials_array, this.lights_array, this.current_boxel.id);
    }

    process_lights(){

        // Initialisation des lights à 0
        for (let boxel of this.boxels_array){
            for (let channel=0; channel < 3; channel++){
                for (let face=0; face < 6; face++){
                    boxel[6 + face + 6 * channel] = 0;
                }
            }
        }

        // Calcul de la lumière pour chaque boxel possédant une source de lumière
        for (let parent_boxel of this.boxels_array){
            let light_id = parent_boxel[30];
            if (light_id >= 0){
                let light = this.lights_array[light_id];
                
                // Pour chacun des enfants du parent_boxel
                for (let k=0; k<4; k++){

                    let boxel_id = parent_boxel[26 + k];
                    if (boxel_id < 0){
                        break;
                    }
                    
                    let boxel = this.boxels_array[boxel_id];
                    
                    for (let channel=0; channel < 3; channel++){
                        for (let face=0; face < 6; face++){
                            let direction = Math.floor(face / 2);
                            let normale = [0,0,0];

                            if (face % 2 == 1){
                                normale[direction] = 1;
                            } else {
                                normale[direction] = -1
                            }
    
                            let P = [boxel[0] + boxel[3]/2, boxel[1] + boxel[4]/2, boxel[2] + boxel[5]/2];
    
                            if (face%2 == 1){
                                P[direction] += boxel[3 + direction]/2;
                            } else {
                                P[direction] -= boxel[3 + direction]/2;
                            }
    
                            let u = substract([light[4], light[5], light[6]], P);
                            let d = Math.sqrt(scal(u, u));
                            u = mul(1/d, u);
    
                            let coef = scal(normale, u);
                            if (coef >=0){
                                boxel[6  + 6 * channel + face] += coef * light[0] * light[1 + channel]/(d*d);
                            }
                        }
                    }
                }
            }
        }
    }
}
