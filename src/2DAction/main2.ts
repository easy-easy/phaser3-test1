import 'phaser'

class MainScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image
    // private player!: Phaser.Physics.Arcade.Sprite
    private stars!: Phaser.Physics.Arcade.Group
    private spikes!: Phaser.Physics.Arcade.Group
    private score: number
    private scoreText!: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'MainScene' })
        this.score = 0
    }

    preload() {
        this.load.image('sky', 'src/assets/bg_evening.jpg')
        this.load.image('star', 'src/assets/music_file.jpg')
        this.load.image('spike', 'src/assets/decision.jpg')
        this.load.image('dude', 'src/assets/kuya_shonin_l.jpg')
        // this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
    }

    create() {
        this.add.image(400, 300, 'sky')

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
            setScale: { x: 0.1, y: 0.1 },
            bounceY: 0.4,
            collideWorldBounds: true,
        })

        this.stars.children.iterate((child) => {
            child.setActive(true)
            // child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
            return true
        })

        this.spikes = this.physics.add.group()

        for (let i = 0; i < 6; i++) {
            const x = Phaser.Math.Between(100, 700)
            const y = Phaser.Math.Between(100, 500)
            const spike = this.spikes.create(x, y, 'spike').setScale(0.02)
            spike.setCollideWorldBounds(true)
            spike.setBounce(1)
            spike.setVelocity(Phaser.Math.Between(-200, 200), 20)
        }

        this.player = this.physics.add.image(100, 450, 'dude').setScale(0.1)
        // this.player = this.physics.add.sprite(100, 450, 'dude')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        this.physics.add.collider(this.player, this.spikes, () => {
            this.physics.pause()
            this.scene.restart()
            this.score = 0
        })

        // this.physics.add.overlap(
        //     this.player,
        //     this.stars,
        //     (obj) => {
        //         if (obj instanceof Phaser.Physics.Arcade.) {
        //             obj.disableBody(true, true)
        //         }
        //         star.disableBody(true, true)
        //         this.score += 10
        //     },
        //     null,
        //     this
        // )

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' })
    }

    update() {
        const cursors = this.input.keyboard!.createCursorKeys()
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160)
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160)
        } else {
            this.player.setVelocityX(0)
        }

        if (cursors.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-330)
        }

        this.scoreText.setText('Score: ' + this.score)
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: false,
        },
    },
}

const game = new Phaser.Game(config)
