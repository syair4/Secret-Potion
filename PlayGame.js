class PlayGame extends Phaser.Scene {   
    symbols = ["potion_yellow","potion_red", "potion_blue","potion_purple"];
    symbol_width = 139;
    symbol_height = 139;
    topGap = 36;
    numOfReels = 5;
    numOfRows = 5;
    containerList = [];
    reelShouldStop = [];
    reelStopTimer = [];

    constructor() {
        super("playGame");
    }

    create() {
        this.randerView();
        this.initSounds();
        this.resetSpin();
    }

    update(){
        if(this.spinStart){
            this.containerList.forEach((container, i) => {
                //cheking if the reel need to be stoped.
                if(!this.reelShouldStop[i]){
                    container.each(child => {
                        child.y += 10;
                        if (child.y >= this.topGap + this.numOfRows*this.symbol_height)
                            this.resetSymbolPos(child);
                    });
                }
                //if the last reel need to be stoped than reset the spin.
                else if(i == this.containerList.length-1 && this.reelShouldStop[i]){
                    this.resetSpin();
                }
            });
        }
         //if "stop_button" has prees the first row be with ​yellow ​potions,
         // second row with ​red potions and third row with ​purple ​potions.  
        else if(this.stopSpin){
            this.containerList.forEach(container => {
                for (let i = 0; i < container.list.length; i++) {
                    container.list[i].y = this.topGap + this.symbol_height*i;
                }
                container.list[1].setTexture(this.symbols[0]);
                container.list[2].setTexture(this.symbols[1]);
                container.list[3].setTexture(this.symbols[3]);
            });
            this.resetSpin();
        }
    }

    //rander the view with background, title reels and buttons.
    randerView(){
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0,0);
        this.add.text(350, 57, "Secret Potion", {font: "30px Ariel", fill: "blue"});

        this.stop_button = this.add.sprite(650, 565 , 'button_stop').setInteractive();
        this.button_spin = this.add.sprite(650, 565 , 'button_spin').setInteractive();
        this.button_spin.on('pointerdown', this.startSpinEvent, this);
        this.stop_button.on('pointerdown', this.stopSpinEvent, this);

        let border = this.make.graphics().fillRect(74, 105, 695, 417);
        let mask = border.createGeometryMask();
        mask.invertAlpha = false;

        for (let i = 1; i <= this.numOfReels; i++) {
            let reel = this.add.container(this.symbol_width*i, 0);
            this.containerList.push(reel);
            this.setReel(reel);
           reel.setMask(mask);
        }
    }

    //init the container with ramdom symbols.
    setReel(container){
        for (let i = 0; i < this.numOfRows; i++) {
            container.add(this.add.sprite(0, this.topGap+this.symbol_height*i, this.getRandomSymbol()));
        }
        this.reelShouldStop.push(false);
    }

    initSounds(){
        this.spinSound = this.sound.add('spin_sound');
        this.sound.add('BG_Music').play();
    }

    //getting a random symbol form symbols list.
    getRandomSymbol(){
       return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    //call whene "button_spin" click and start the spin
    startSpinEvent(){
        //While spin button is disabled it have 50% opacity
        this.stop_button.setAlpha(0.5);
        this.button_spin.visible = false;
        this.spinStart = true; 

        //After 1 second from clicking play the button become enabled again
        this.enableStopTimer = this.time.addEvent({
            delay: 1000,
            callback: this.enableStopEvent,
            callbackScope: this,
            loop: false
        });

        //When the player presses Spin, after 2 seconds the slot stop the reels 1 by 1
        this.endOfSpinTimer = this.time.addEvent({
            delay: 2000,
            callback: this.endOfSpin,
            callbackScope: this,
            loop: false
        });

        this.spinSound.play();
    }
    //call whene the time "endOfSpinTimer" end, and set  stop timer for each reel.
    endOfSpin(){
        for (let i = 0; i < this.containerList.length; i++) {
            this.reelStopTimer[i] = this.time.addEvent({
                delay: 300*i,
                callback: this.stopReel,
                args: [i],
                callbackScope: this,
                loop: false
            });
        }
    }

    stopReel(index){
        this.reelShouldStop[index] = true;
    }

    //call whene the time "enableStopTimer" end, and enable the "stop_button" again.
    enableStopEvent(){
        this.enableStopButton();
    }

    enableStopButton(){
        this.stop_button.setAlpha(1); 
        this.enableStop = true;
    }

    //whene a symbol is at the bottom its move him to top of the screen
    resetSymbolPos(symbol){
        symbol.y =  this.topGap;
        symbol.x = 0;
        //after each spin iteration the symbols (potions) change
        symbol.setTexture(this.getRandomSymbol());

    }

    //call whene "stop_button" click and stop the spin in once
    stopSpinEvent(){
        if(this.enableStop){
            this.stopSpin = true;
            this.spinStart = false;
            this.endOfSpinTimer.destroy();
        }
    }

    //reset all spin flags, sound and timers
    resetSpin(){
        this.spinSound.stop();
        this.button_spin.visible = true;
        this.enableStop = false;
        this.spinEnd = false;
        this.spinStart = false; 
        this.stopSpin = false;
        this.reelShouldStop = this.reelShouldStop.map(stopReel => stopReel = false);
        this.reelStopTimer.forEach(timer => {
            timer.destroy();
        });
    }
}

