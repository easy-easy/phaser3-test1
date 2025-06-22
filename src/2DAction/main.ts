import 'phaser'

let player: Phaser.Physics.Arcade.Sprite
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let score = 0
let scoreText: Phaser.GameObjects.Text
let endObj: Phaser.Physics.Arcade.Image
let bombs: Phaser.Physics.Arcade.Group

class Example extends Phaser.Scene {
    // 画面ロード前の実行ロジック
    preload() {
        this.load.image('bg', 'src/2DAction/assets/bg_2.jpg')
        this.load.image('bar', 'src/2DAction/assets/bar.dio.png')
        this.load.image('melody', 'src/2DAction/assets/music_file.jpg')
        this.load.image('kuya_shonin', 'src/2DAction/assets/kuya_shonin_r.jpg')
        this.load.image('chrome', 'src/2DAction/assets/chrome_icon.png')

        cursors = this.input.keyboard!.createCursorKeys()
    }

    // 画面作成時の実行ロジック
    create() {
        this.add.image(400, 300, 'bg').setScale(0.5)

        const platforms = this.physics.add.staticGroup()
        platforms.create(400, 568, 'bar').setScale(2).refreshBody()
        platforms.create(600, 400, 'bar')
        platforms.create(50, 250, 'bar')
        platforms.create(750, 220, 'bar')

        player = this.physics.add.sprite(100, 150, 'kuya_shonin').setScale(0.2)

        player.setBounce(0.2)
        // 世界の境界線との衝突
        player.setCollideWorldBounds(true)
        this.physics.add.collider(player, platforms)
        if (player.body instanceof Phaser.Physics.Arcade.Body) {
            player.body.setGravityY(200)
        }

        // this.anims.create({
        //   key: "left",
        //   frames: this.anims.generateFrameNumbers("kuya_shonin", { start: 0, end: 0 }),
        //   frameRate: 10,
        //   repeat: -1,
        // });

        // this.anims.create({
        //     key: 'turn',
        //     frames: [ { key: 'kuya_shonin', frame: 4 } ],
        //     frameRate: 20
        // });

        // this.anims.create({
        //   key: "right",
        //   frames: this.anims.generateFrameNumbers("kuya_shonin", { start: 1, end: 1 }),
        //   frameRate: 10,
        //   repeat: -1,
        // });
        // this.add.image(400, 300, "sky");

        // this.add.image(670, 380, "kuya_shonin").setScale(0.5);

        // const logo = this.physics.add.image(400, 100, "logo");

        // logo.setVelocity(100, 100);
        // logo.setBounce(1, 1);
        // logo.setCollideWorldBounds(true);

        // const particles = this.add.particles(0, 0, "red", {
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: "ADD",
        //   });

        // particles.startFollow(logo);
        const melody = this.physics.add.image(400, 100, 'melody').setScale(0.1)
        melody.setCollideWorldBounds(true)
        this.physics.add.collider(melody, platforms)

        // キャラとオブジェクトの接触時の処理
        this.physics.add.overlap(player, melody, () => {
            melody.disableBody(true, true)
            score += 10
            scoreText.setText(`Score: ${score}`)
        })

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px' })

        bombs = this.physics.add.group()
        bombs.create(200, 500, 'chrome').setScale(0.2).setCollideWorldBounds(true)

        this.physics.add.collider(bombs, platforms)

        const hitBomb = () => {
            // 停止
            this.physics.pause()

            // 死
            player.setTint(0xff0000)

            // 画面上をChromeが左から右に流れる
            const curtain = this.add.image(-100, 300, 'chrome').setScale(2.5)
            this.tweens.add({
                targets: curtain,
                x: { value: 1300, duration: 2000 },
                repeat: -1, // 無限に繰り返す
                // yoyo: true, // 左右を行き来する
            })
            // gameOver = true
        }
        // this.physics.add.collider(bombs, player)
        this.physics.add.collider(player, bombs, hitBomb, undefined, this)
        // endObj = this.physics.add.image(200, 500, 'chrome').setScale(0.2)
        // endObj.setCollideWorldBounds(true)
        // this.physics.add.collider(endObj, platforms)
        // this.physics.add.overlap(player, endObj, () => {
        //     // melody.disableBody(true, true)
        //     score -= 10
        //     scoreText.setText(`Score: ${score}`)
        // })
    }

    // 画面更新時の実行ロジック
    update(time: number, delta: number): void {
        if (cursors.left.isDown) {
            player.setVelocityX(-160)
            // player.anims.play('left', true)
        } else if (cursors.right.isDown) {
            player.setVelocityX(160)
            // player.anims.play('right', true)
        } else {
            player.setVelocityX(0)
            // player.anims.play('turn')
        }

        if (cursors.up.isDown && player.body instanceof Phaser.Physics.Arcade.Body && player.body.touching.down) {
            player.setVelocityY(-350)
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 200 },
        },
    },
}

const game = new Phaser.Game(config)
