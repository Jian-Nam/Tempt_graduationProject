import * as THREE from '../../build/three.module.js'
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js"
import { OBJLoader } from "../../examples/jsm/loaders/OBJLoader.js"
import { Area_table } from '../db/database.js';




export class virtual_space{
    constructor(virtual_space_individual){
        this.container = document.querySelector("#virtual_space_container");
        this.virtual_space_individual = virtual_space_individual
        this.discription = document.querySelector('#discription');
        this.discription_video = document.querySelector('#discription_video_virtual');

        this.area_number = document.querySelector('#area_number')
        this.owner = document.querySelector('#owner')
        this.area_size = document.querySelector('#Area_size');
        this.area_popularity = document.querySelector('#Popularity');
        this.area_price = document.querySelector('#Price');
        this.building_size = document.querySelector('#Building_size');

        const renderer = new THREE.WebGL1Renderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;



        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        this.resize();

        
        requestAnimationFrame(this.render.bind(this));
    }



    _setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.001,
            100
        );
        //camera.position.z = 9;
        camera.position.set(0, 10, 0);
        this.camera_origin = camera.position.clone();
        this.camera_lookat = new THREE.Vector3(0, 0, 0);
        camera.lookAt(this.camera_lookat);

        this._camera =  camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;

        const light1 = new THREE.DirectionalLight(color, intensity);
        light1.position.set(-1, 3, 4);
        this._scene.add(light1);

        const light2 = new THREE.DirectionalLight(color, 0.8);
        light2.position.set(2, 3, 4);
        this._scene.add(light2);

        const light3 = new THREE.DirectionalLight(color, 0.5);
        light3.position.set(0, 0, -7);
        this._scene.add(light3);
    }

    _setupModel() {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("./study/src/digital_graffities/test3.glb", (gltf)=> {
            const model = gltf.scene;
            // model.rotation.z = Math.PI/2
            model.position.set(-3, -2, 0);  
            model.rotation.z = Math.PI/18;
            model.scale.set(2.5, 2.5, 2.5); 


            // model.traverse(child => {
            //     if(child instanceof THREE.Mesh){
            //         // child.material = new THREE.MeshBasicMaterial({color: 0x505050, transparent:true, opacity:0.9});
            //     }
            // })
            // this._scene.add(model);
            // console.log(model);

            let model2 = model.clone();
            model2.position.set(30, -2, 0);  
            // model2.rotation.z = Math.PI/2;
            // this._scene.add(model2);

            let model3 = model.clone();
            model3.position.set(-30, -2, 0);  
            // model3.rotation.z = -Math.PI/2;
            // this._scene.add(model3);

            const animationClips = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const mixer2 = new THREE.AnimationMixer(model2);
            const mixer3 = new THREE.AnimationMixer(model3);
            const animationsMap = {};
            animationClips.forEach(clip => {
                mixer.clipAction(clip).play();
                mixer2.clipAction(clip).play();
                mixer3.clipAction(clip).play();
            });

            this._mixer = mixer;
            this._mixer2 = mixer2;
            this._mixer3 = mixer3;

            this._animationMap = animationsMap;

            // for(let id in animationsMap){
            //     animationsMap[id].play();
            // }
        })

        // gltfLoader.load("./study/src/digital_graffities/test2.glb", (gltf)=> {
        //     const model = gltf.scene;
        //     // model.rotation.z = Math.PI/2
        //     model.position.set(0, -2, 0);   
        //     // model.traverse(child => {
        //     //     if(child instanceof THREE.Mesh){
        //     //         // child.material = new THREE.MeshBasicMaterial({color: 0x505050, transparent:true, opacity:0.9});
        //     //     }
        //     // })
        //     this._scene.add(model);
        //     // console.log(model);

        //     let model2 = model.clone();
        //     model2.position.set(16, -2, 0);  
        //     // model2.rotation.z = Math.PI/2;

        //     let model3 = model.clone();
        //     model3.position.set(-16, -2, 0);  
        //     // model3.rotation.z = -Math.PI/2;

        //     const animationClips = gltf.animations;
        //     const mixer = new THREE.AnimationMixer(model);
        //     const mixer2 = new THREE.AnimationMixer(model2);
        //     const mixer3 = new THREE.AnimationMixer(model3);
        //     const animationsMap = {};
        //     animationClips.forEach(clip => {
        //         mixer.clipAction(clip).play();
        //         mixer2.clipAction(clip).play();
        //         mixer3.clipAction(clip).play();
        //     });

        //     this._mixer = mixer;
        //     this._mixer2 = mixer2;
        //     this._mixer3 = mixer3;

        //     this._animationMap = animationsMap;

        //     // for(let id in animationsMap){
        //     //     animationsMap[id].play();
        //     // }
        // })


        const size = 100;
        const divisions = 60;

        const gridHelper = new THREE.GridHelper( size, divisions );
        // this._scene.add( gridHelper );

        const objLoader = new OBJLoader();

        objLoader.load("./study/src/maps/virtual.obj", (obj) => {
            this._scene.add(obj);
            obj.position.set(0, 1.5, 0);
            this.architecture = obj;
            this.raycasting_obj = [];
            // console.log(this.architecture);

            this.architecture.traverse(child => {
                if(child instanceof THREE.Mesh){
                    // console.log(child.name);
                    // child.material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.7});
                    // child.material = new THREE.MeshStandardMaterial();
                    if(Area_table[child.name].owner == "None"){
                        child.material = new THREE.MeshNormalMaterial({transparent:true, opacity:0.7});
                        child.material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent:true, opacity:0.7});
                    }else{
                        child.material = new THREE.MeshBasicMaterial({color: 0xff00ff, transparent:true, opacity:0.7});
                    }
                    
                    // child.material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:true});
                    this.raycasting_obj.push(child);

                    const edges = new THREE.EdgesGeometry( child.geometry );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 100} ) );
                    line.position.set(0, 1.5, 0);
                    this._scene.add( line );

                }
            })
            this._setupPicking();
            
        })

    }

    _setupControls() {
        // this.container.addEventListener("wheel", (event) => {this.move_camera(event);})
    }



    _setupPicking() {
        this.hoverable = 1;
        this.rayCaster = new THREE.Raycaster();
        this._renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this._renderer.domElement.addEventListener("click", this.onMouseClick.bind(this), false);
        //console.log(this.architecture.children[0].children)
        //this.raycasting_obj = this.architecture.children[0].children.slice(1,);
    }

    onMouseMove(e) {
        this.mouse = new THREE.Vector2();
        this.mouse.x = this.mouse.y = -1;
        this.mouse.x = (e.clientX/window.innerWidth)*2-1;
        this.mouse.y = -((e.clientY/window.innerHeight)*2-1);

        this.rayCaster.setFromCamera(this.mouse, this._camera);
    }

    onMouseClick(e) {

        if(this.hoverable == 0){
            this.hoverable = 1
            // this.toggle.style.color = "#00FF00"
            // this.title.style.color = "#00FF00"
        }else{
            let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

            if(intersects[0]){
                for(let i = 0; i < this.raycasting_obj.length; i++){
                    if(intersects[0].object == this.raycasting_obj[i]) {
                        this.hoverable = 0;
                        // this.toggle.style.color = "#000000"
                        // this.title.style.color = "#000000"
                        this.virtual_space_individual.reset_model(this.raycasting_obj[i].name);
                        this.discription.style.right = "0%";
                    } 
                }
            }
        }
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    reset_discription(name){
        let area_info = Area_table[name];

        this.area_number.innerHTML = name;
        this.owner.innerHTML = area_info.owner;
        if(area_info.owner == "None"){
            this.owner.style.color = "red"
        }else{
            this.owner.style.color = "aqua"
        }
        this.area_size.innerHTML = "Size : " + area_info.size;
        this.area_popularity.innerHTML = "Popularity : " + area_info.popularity;
        this.area_price.innerHTML = "Price : " + area_info.price;
        this.building_size.innerHTML = "Building size : " +  area_info.building_size;
    }


    go_closer(point){
        let fraction = 0.03;
        let camera_offset_height = 3

        point.y += camera_offset_height;
        point.multiplyScalar(fraction);

        this._camera.position.multiplyScalar(1-fraction);
        this._camera.position.add(point);
    }

    come_back(){
        let fraction = 0.03;
        let root_position_y = 10;

        this._camera.position.multiplyScalar(1-fraction);
        this._camera.position.y += fraction * root_position_y;
    }


    update(time) {
        this._renderer.setClearColor( 0x00ff00, 0 );
        //auto rotation
        time *= 0.001; // second unit

        //show animation
        if(this._mixer) {
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);
            this._mixer2.update(deltaTime);
            this._mixer3.update(deltaTime);

        }
        this._previousTime = time;

        //mouse hover
        if(this.architecture && this.rayCaster){

            let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

            if(this.hoverable){
                if(intersects[0]){
                    intersects[0].object.material.opacity = 0.9;

                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        if(intersects[0].object == this.raycasting_obj[i]) {
                            this.reset_discription(intersects[0].object.name);
                            this.discription.style.right = "-96vh"

                            this.raycasting_obj[i].position.y = this.raycasting_obj[i].position.y * 0.7 +0.15;

                            let point = intersects[0].point.clone();
                            this.go_closer(point)
                        }else{
                            this.raycasting_obj[i].position.y = this.raycasting_obj[i].position.y * 0.7;
                            this.raycasting_obj[i].material.opacity = 0.7;
                        }
                    }
                }else {
                    this.discription.style.right = "-135vh";
                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        this.raycasting_obj[i].material.opacity = 0.7;
                        this.raycasting_obj[i].position.y = this.raycasting_obj[i].position.y * 0.7;
                    }
                    this.come_back();
                }
            }
        }
    }
}

