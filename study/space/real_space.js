import * as THREE from '../../build/three.module.js'
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js"
import { OBJLoader } from "../../examples/jsm/loaders/OBJLoader.js";
import { Place_table } from "../db/database.js"


export class real_space{
    constructor(){
        this.container = document.querySelector("#real_space_container");

        this.discription = document.querySelector('#discription_real');
        this.discription_video = document.querySelector('#discription_video_real');
        this.discription_title = document.querySelector('#discription_title_real');
        this.graffiti_info = document.querySelector('#graffiti_info');
        this.graffiti_size = document.querySelector('#graffiti_size');
        this.graffiti_style = document.querySelector('#graffiti_style');
        this.wall_size = document.querySelector('#wall_size');
        this.maintext = document.querySelector('#maintext');

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
        camera.position.set(0, 3, 0);



        this._camera =  camera;
        this.camera_origin = camera.position.clone();
        this.camera_lookat = new THREE.Vector3(0, 0, 0);
        camera.lookAt(this.camera_lookat);
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        const size = 100;
        const divisions = 60;




        const gridHelper = new THREE.GridHelper( size, divisions );
        this._scene.add( gridHelper );


        const objLoader = new OBJLoader();
        objLoader.load("./study/src/maps/archive object.obj", (obj) => {
            obj.traverse(child => {
                if(child instanceof THREE.Mesh){
                    
                    child.material = new THREE.MeshBasicMaterial({color:0xffffff});

                    const edges = new THREE.EdgesGeometry( child.geometry );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 100} ) );
                    this._scene.add( line );

                }
            })
            this._s
            this._scene.add(obj);
        })

        // const objLoader = new OBJLoader();
        objLoader.load("./study/src/maps/spot.obj", (obj) => {
            this._scene.add(obj);

            this.raycasting_obj = [];
            obj.traverse(child => {
                if(child instanceof THREE.Mesh){
                    // child.material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.7});
                    // child.material = new THREE.MeshStandardMaterial();
                    // child.material = new THREE.MeshNormalMaterial({transparent:true, opacity:0.7});
                    
                    child.material = new THREE.MeshBasicMaterial({color:0x00ffff});
                    this.raycasting_obj.push(child);

                    const edges = new THREE.EdgesGeometry( child.geometry );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 100} ) );
                    this._scene.add( line );

                }
            })
            this._setupPicking();
        })

    }

    _setupControls() {
        // this.container.addEventListener("wheel", (event) => {this.move_camera(event);})
    }

    move_camera(event){
        event.preventDefault();
        const min = 3;
        const max = 15
        this._camera.position.z = Math.min(Math.max(this._camera.position.z+event.deltaY*0.002, min), max)
    }

    _setupPicking() {
        this.hoverable = 1;
        this.rayCaster = new THREE.Raycaster();
        this._renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this._renderer.domElement.addEventListener("click", this.onMouseClick.bind(this), false);
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
                        console.log( this.raycasting_obj[i].position);
                        this.discription.style.right = "4vh";
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

    control_camera(){

        if(this.mouse && this.hoverable){
            let fraction = 0.1

            const minX = -7;
            const maxX = 7;

            const minZ = -5;
            const maxZ = 5;


            let compare_plusXY = this.mouse.y > this.mouse.x;
            let compare_minusXY = this.mouse.y > -this.mouse.x;

            if(compare_plusXY + compare_minusXY == 1){
                if(Math.abs(this.mouse.x)>0.3){
                    this._camera.position.x = Math.min(Math.max(this._camera.position.x + this.mouse.x * fraction, minX), maxX);
                }
            }else{
                if(Math.abs(this.mouse.y)>0.3){
                    this._camera.position.z = Math.min(Math.max(this._camera.position.z - this.mouse.y * fraction, minZ), maxZ);
                }
            }
        }
    }

    reset_discription(name){
        var info = Place_table[name]
        this.discription_title.innerHTML = info.address_eng
        this.graffiti_info.innerHTML = "";
        this.graffiti_size.innerHTML = info.graffiti_size;
        this.graffiti_style.innerHTML = info.graffiti_style;
        this.wall_size.innerHTML = info.wall_size;
        this.maintext.innerHTML = info.discription;
    }

    update(time) {
        this._renderer.setClearColor( 0x000000, 1 );
        //auto rotation
        time *= -0.0002; // second unit
        // this._scene.rotation.y = time;

        //mouse hover
        this.control_camera();

        if(this.raycasting_obj && this.rayCaster){
            for(let i = 0; i < this.raycasting_obj.length; i++){
                this.raycasting_obj[i].material.opacity = 0.7
            }
            
            let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

            if(this.hoverable){
                if(intersects[0]){
                    intersects[0].object.material.opacity = 0.9;
                    // intersects[0].object.rotation.y = time*10;
                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        if(intersects[0].object == this.raycasting_obj[i]) {
                            this.reset_discription(intersects[0].object.name)
                            this.discription.style.right = "-96vh"                          
                        }
                    }
                }else {
                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        this.discription.style.right = "-135vh";
                    }
                }
            }
        }
    }
}

