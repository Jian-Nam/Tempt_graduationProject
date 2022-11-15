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

        this.d_background = document.querySelector("#discription_main_background")


        this.p01 = document.querySelector("#p01");
        this.p02 = document.querySelector("#p02");
        this.p03 = document.querySelector("#p03");

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
                        var info = Place_table[this.raycasting_obj[i].name]
                        this.p01.src = "./study/src/photoes/" + info.pic1
                        this.p02.src = "./study/src/photoes/" + info.pic2
                        this.p03.src = "./study/src/photoes/" + info.pic3
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
        // this.maintext.innerHTML = info.discription;
        this.maintext.innerHTML = 
        "실현에 긴지라 무엇을 어디 청춘 무엇이 철환하였는가? 청춘을 노년에게서 설레는 따뜻한 얼마나 장식하는 튼튼하며, 있으며, 있는 이것이다. 만물은 현저하게 피가 보이는 곧 청춘 불러 운다. 천하를 있는 같은 위하여 길을 인류의 트고, 착목한는 사막이다. 황금시대를 있으며, 못하다 열매를 이상 생의 아니다. 전인 인생에 긴지라 인생을 트고, 밥을 능히 귀는 것이다. 이상 있음으로써 구하지 인생을 커다란 때문이다. 자신과 같이 낙원을 봄바람을 무엇을 희망의 불어 속잎나고, 위하여서. 그들은 그것을 넣는 얼음이 설산에서 가진 아름답고 사랑의 그림자는 것이다. 능히 용감하고 이성은 청춘 때문이다. 있는 것은 만물은 타오르고 군영과 청춘에서만 이것이다."
        +"가진 능히 간에 힘차게 끓는 봄바람이다. 청춘은 인생에 그러므로 들어 것이다. 그것은 그들의 풍부하게 있는가? 가치를 장식하는 몸이 천고에 인류의 이상의 뼈 청춘을 피다. 이것을 만물은 무엇을 얼마나 따뜻한 있는 굳세게 것이다. 고행을 눈에 않는 인생에 크고 앞이 듣기만 것이다. 들어 것은 듣기만 그들의 듣는다. 있는 있음으로써 노년에게서 불러 그들은 우리의 따뜻한 석가는 끓는다. 위하여서 인생의 가는 두손을 이것이다. 이상, 작고 동력은 창공에 무한한 싸인 충분히 아니다. 위하여 것이 이상이 청춘은 바이며, 그리하였는가?"
        +"끓는 그들은 인도하겠다는 더운지라 그리하였는가? 더운지라 천자만홍이 같지 석가는 살 소금이라 인간이 굳세게 그것은 것이다. 길지 만천하의 옷을 할지라도 약동하다. 용기가 얼음과 이상을 것이 천고에 우리 행복스럽고 너의 영락과 말이다. 인간은 얼마나 사람은 청춘 소금이라 이것을 굳세게 천고에 피다. 물방아 보내는 희망의 반짝이는 것이다.보라, 시들어 힘있다. 없으면 동력은 할지니, 우리의 그러므로 대중을 칼이다. 그들의 풀이 가슴이 인도하겠다는 얼음과 크고 황금시대다. 남는 착목한는 소리다.이것은 인간은 없으면, 교향악이다."


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

