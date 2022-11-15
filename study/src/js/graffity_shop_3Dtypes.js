import * as THREE from '../../../build/three.module.js';
import { GLTFLoader } from "../../../examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "../../../examples/jsm/loaders/OBJLoader.js";
import { Area_table } from '../../db/database.js';

export class graffity_shop_3Dtypes{
    constructor(container_id){
        this.container = document.querySelector(container_id);

        const renderer = new THREE.WebGL1Renderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;


        this._setupCamera();
        this._setupLight();
        this._setupModel();
        //this._setupControls();

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
        camera.position.set(0, 0, 1.2);
        camera.lookAt(0, -0.1, 0);

        this._camera =  camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        // gltfLoader.load("./src/digital_graffities/test.glb", (gltf)=> {
        //     const model = gltf.scene;

        //     model.traverse(child => {
        //         if(child instanceof THREE.Mesh){
        //             child.material = new THREE.MeshNormalMaterial({transparent:true, opacity:0.9});
        //             console.log(child.position)
        //             child.position.set(0, 0, 0)
        //         }

        //     })
        //     this._scene.add(model);
        //     console.log(model);

        //     const animationClips = gltf.animations;
        //     const mixer = new THREE.AnimationMixer(model);
        //     const animationsMap = {};
        //     animationClips.forEach(clip => {
        //         const name = clip.name;
        //         console.log(name);
        //         animationsMap[name] = mixer.clipAction(clip);
        //     });

        //     this._mixer = mixer;
        //     this._animationMap = animationsMap;
        //     this._currentAnimationAction = this._animationMap["Curve.001Action"];
        //     this._currentAnimationAction.play();
        // })
        this.objects = [];
    }

    _setupControls() {
        new OrbitControls(this._camera, this.archieve_container);
    }

    reset_model(name){
        const objLoader = new OBJLoader();
        let object_names = [name]

        for(let i = 0; i< this.objects.length; i++){ 
            this._scene.remove( this.objects[i] )
        }

        this.objects = [];

        for(let i = 0; i< object_names.length; i++){ 
            let directory = './study/src/digital_graffities/' + object_names[i]
            objLoader.load(directory, (obj)=>{
                obj.children[0].position.set(0, 0, 0);
                obj.children[0].material = new THREE.MeshNormalMaterial({transparent:true, opacity: 0.9});
                
                this._scene.add( obj );
                this.objects.push(obj);
            })
        }
    }

    reset_model_v3(name){
        const objLoader = new OBJLoader();
        let object_names = [name]

        for(let i = 0; i< this.objects.length; i++){ 
            this._scene.remove( this.objects[i] )
        }

        this.objects = [];

        for(let i = 0; i< object_names.length; i++){ 
            let directory = './study/src/digital_graffities/' + object_names[i]
            objLoader.load(directory, (obj)=>{
                obj.children[0].position.set(0, 0, 0);
                // obj.children[0].material = new THREE.MeshNormalMaterial({transparent:true, opacity: 0.9});
                const edges = new THREE.EdgesGeometry( obj.children[0].geometry );
                const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x00ffff, linewidth: 100} ) );
                this._scene.add( line );
                
                this._scene.add( line );
                this.objects.push(line);
            })
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

    update(time) {
        this._renderer.setClearColor( 0x000000, 0 );

        //auto rotation
        time *= 0.001; // second unit


        if(this._mixer) {
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);
        }
        this._previousTime = time;

        this._scene.rotation.y = Math.sin(time)/2;;
        //console.log(this.objects.length)
        for(let i = 0; i< this.objects.length; i++){
            this.objects[i].position.y = Math.sin(time*5)*0.05+i/2;

        }
    }
}

