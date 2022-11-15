import {setupMenu} from "./setupMenu.js"

class App{
    constructor(){
        this.setup_menu = new setupMenu();
    }
    
}
window.onload = function() {
    new App();
}