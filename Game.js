window.onload = function() {
    var confing = {
        type: Phaser.CANVAS,
        width: 800,
        height: 800,
        backgroundColor: 0x000000,
        scene: [Preload, PlayGame]
    }

    var game = new Phaser.Game(confing);
}