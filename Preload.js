class Preload extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "assets/images/slotContainer.png");
        this.load.image("button_spin", "assets/images/button_spin.png");
        this.load.image("button_stop", "assets/images/button_stop.png");
        
        this.load.image("potion_yellow", "assets/images/potion1.png");
        this.load.image("potion_blue", "assets/images/potion2.png");
        this.load.image("potion_red", "assets/images/potion3.png");
        this.load.image("potion_purple", "assets/images/potion4.png");
        
        this.load.audio('BG_Music', "assets/sounds/BG_Music.wav");
        this.load.audio('spin_sound', "assets/sounds/Spin.wav");

    }

    create() {
        this.add.text(20, 20, "Loading Game...", {font: "25px Ariel", fill: "yellow"});
        this.scene.start("playGame");
    }
}