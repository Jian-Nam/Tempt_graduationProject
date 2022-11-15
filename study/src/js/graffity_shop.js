import { Graffity_table } from "../../db/database.js"
import { graffity_shop_3Dtypes } from "./graffity_shop_3Dtypes.js"

class App {
    constructor() {
        this.set_structure();
        this.fetch_data();
        this.add_listPageEvent();
        this.add_typePageEvent();

        this.v1_THREEjs = new graffity_shop_3Dtypes("#v1"); 
        this.v2_THREEjs = new graffity_shop_3Dtypes("#v2"); 

        window.onresize = this.resize.bind(this);
    }
    
    set_structure(){
        this.title = document.querySelector("#title");
        this.title.addEventListener("click", this.go_home.bind(this));

        this.graffity_types_container = document.querySelector("#graffity_types_container")
        
        const scrollContainer = document.querySelector("#list_container");

        scrollContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        });

    }

    fetch_data(){
        this.list1 = document.querySelector("#list1");
        this.list2 = document.querySelector("#list2");

        var count = 0;
        for(let id in Graffity_table){
            var li_elem = document.createElement("li");
            var img_elem = document.createElement("img");
            var info_elem = document.createElement("div");
            var identifier_elem = document.createElement("div");
            var size_elem = document.createElement("div");
            var price_elem = document.createElement("div");

            img_elem.src = "./study/src/vectors/" + Graffity_table[id].v1

            li_elem.setAttribute("id", String(id));

            info_elem.classList.add("graffity_info");
            identifier_elem.classList.add("graffity_title");
            size_elem.classList.add("graffity_size");
            price_elem.classList.add("graffity_price");

            identifier_elem.innerHTML = Graffity_table[id].gid;
            size_elem.innerHTML = "Size: "+ Graffity_table[id].size;
            price_elem.innerHTML = "Price: "+ Graffity_table[id].price;

            info_elem.append(identifier_elem, size_elem, price_elem);
            li_elem.append(img_elem, info_elem);

            if(count%2 == 0){
                this.list1.appendChild(li_elem);
            }else{
                this.list2.appendChild(li_elem);
            }

            count+=1
        }

        this.list1.style.width = String((count/2+1) * 50) + "vh"
        this.list2.style.width = String(count/2 * 50) + "vh"

    }

    add_listPageEvent(){
        this.listElements = document.querySelectorAll("li");

        this.index_now = 1;
        for(let value of this.listElements){
            console.log(value.firstElementChild.style)
            value.addEventListener("mouseover", ()=>{
                value.style.background = "rgba(20, 20, 20, 1.0) "
                value.firstElementChild.style.filter = "invert(60%) sepia(69%) saturate(3291%) hue-rotate(83deg) brightness(115%) contrast(130%)" });
            value.addEventListener("mouseout", ()=>{
                value.style.background = "rgba(20, 20, 20, .0) "
                value.firstElementChild.style.filter = "invert(91%) sepia(93%) saturate(29%) hue-rotate(197deg) brightness(107%) contrast(100%)" });
            value.addEventListener("click", (event)=>{this.show_types(event)});
        }
    }

    add_typePageEvent(){
        this.v0 = document.querySelector("#v0");
        this.v1 = document.querySelector("#v1");
        this.v2 = document.querySelector("#v2");

        this.lists_button = document.querySelector("#lists_button");
        this.lists_button.addEventListener("click", this.go_lists.bind(this) );

        this.left_button = document.querySelector("#left_button");
        this.right_button = document.querySelector("#right_button");

        this.left_button.addEventListener("click", this.go_left.bind(this) );
        this.right_button.addEventListener("click", this.go_right.bind(this) );

        this.graffity_id = document.querySelector("#graffity_id");

    }

    resize(){
        this.v1_THREEjs.resize();
        this.v2_THREEjs.resize();

    }
    go_home(){
        console.log("go home");
        document.location.href = "index.html";
    }

    show_types(e){
        this.graffity_types_container.style.top = "0%";
        var id = e.currentTarget.id;
        console.log(Graffity_table[id]);
        this.graffity_id.innerHTML = Graffity_table[id].gid;

        this.v0.src = "./study/src/vectors/" + Graffity_table[id].v1;
        this.v1_THREEjs.reset_model(Graffity_table[id].v2);
        this.v2_THREEjs.reset_model_v3(Graffity_table[id].v2);
    }

    go_lists(){
        this.graffity_types_container.style.top = "100%"
        this.index_now = 1;
        this.v0.style.left = "-100%"
        this.v1.style.left = "0%"
        this.v2.style.left = "100%"

        this.v0.style.right = "100%"
        this.v1.style.right = "0%"
        this.v2.style.right = "-100%"
    }


    go_left(){
        if(this.index_now>0){
            this.index_now -= 1;
        }

        this.v0.style.left = String(0 - (this.index_now*100)) + "%"
        this.v1.style.left = String(100 - (this.index_now*100)) + "%"
        this.v2.style.left = String(200 - (this.index_now*100)) + "%"

        this.v0.style.right = String(0 + (this.index_now*100)) + "%"
        this.v1.style.right = String(-100 + (this.index_now*100)) + "%"
        this.v2.style.right = String(-200 + (this.index_now*100)) + "%"
    }

    go_right(){
        if(this.index_now<2){
            this.index_now += 1;
        }

        this.v0.style.left = String(0 - (this.index_now*100)) + "%"
        this.v1.style.left = String(100 - (this.index_now*100)) + "%"
        this.v2.style.left = String(200 - (this.index_now*100)) + "%"

        this.v0.style.right = String(0 + (this.index_now*100)) + "%"
        this.v1.style.right = String(-100 + (this.index_now*100)) + "%"
        this.v2.style.right = String(-200 + (this.index_now*100)) + "%"

    }

}
window.onload = function() {
    new App();
}