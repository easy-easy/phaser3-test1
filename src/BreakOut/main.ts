// 必要なPhaserクラスをインポートします
import Phaser from 'phaser'

// ゲームの設定を定義します
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
}

// ゲームインスタンスを作成します
new Phaser.Game(config)

// ゲームの状態を保持する変数を定義します
let ball: Phaser.Physics.Arcade.Sprite
let paddle: Phaser.Physics.Arcade.Sprite
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let scoreText: Phaser.GameObjects.Text
let score = 0

function preload(this: Phaser.Scene) {
    // アセットをロードします
    this.load.image('ball', '/src/BreakOut/assets/ball.dio.png')
    this.load.image('paddle', '/src/BreakOut/assets/paddle.dio.png')
    this.load.image('brick', '/src/BreakOut/assets/brick.dio.png')

    // SEをロードします
    this.load.audio('brickHit', '/src/BreakOut/assets/hit.mp3')
}

function create(this: Phaser.Scene) {
    // ボールを作成します
    ball = this.physics.add.sprite(400, 500, 'ball').setScale(0.5)
    ball.setCollideWorldBounds(true)
    ball.setBounce(1)
    ball.setData('onPaddle', true)

    // パドルを作成します
    paddle = this.physics.add.sprite(400, 550, 'paddle')
    paddle.setImmovable(true)
    paddle.setCollideWorldBounds(true)

    // スコアテキストを作成します
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '20px',
        color: '#ffffff',
    })

    // キーボード入力を設定します
    cursors = this.input.keyboard!.createCursorKeys()

    // ブロックを作成します
    const bricks = this.physics.add.staticGroup()
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 5; j++) {
            bricks.create(80 + i * 64, 50 + j * 32, 'brick')
        }
    }

    // コリジョンを設定します
    this.physics.add.collider(ball, bricks, (obj1, obj2) => hitBrick(obj1, obj2, this), undefined, this)
    this.physics.add.collider(ball, paddle, hitPaddle, undefined, this)

    // スペースキーでボールを発射します
    this.input.keyboard!.on('keydown-SPACE', function (event: any) {
        if (ball.getData('onPaddle')) {
            ball.setVelocity(-75, -300)
            ball.setData('onPaddle', false)
        }
    })
}

function update(this: Phaser.Scene) {
    // パドルの移動を制御します
    // paddle.x = this.input.x || 400

    if (ball.getData('onPaddle')) {
        ball.x = paddle.x
    }

    if (cursors.left.isDown) {
        paddle.setVelocityX(-500)
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(500)
    } else {
        paddle.setVelocityX(0)
    }

    // ゲームのルールを実装します
    if (ball.y > 590) {
        resetBall()
    }
}

function hitBrick(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    scene: Phaser.Scene
) {
    // brickがPhaser.Types.Physics.Arcade.GameObjectWithBodyかどうかの判定
    if (brick instanceof Phaser.Physics.Arcade.Sprite) {
        brick.disableBody(true, true)
    }
    console.log(typeof brick)

    // スコアを更新します
    score += 10
    scoreText.setText(`Score: ${score}`)

    // ブロックにボールが接触した際の音を鳴らします
    scene.sound.play('brickHit')
}

function hitPaddle(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
) {
    console.log(typeof ball)

    // brickがPhaser.Types.Physics.Arcade.GameObjectWithBodyかどうかの判定
    if (ball instanceof Phaser.Physics.Arcade.Sprite) {
        if (ball.x < paddle.x) {
            // ボールがパドルの左側に当たった場合
            const diff = paddle.x - ball.x
            ball.setVelocityX(-10 * diff)
        } else if (ball.x > paddle.x) {
            // ボールがパドルの右側に当たった場合
            const diff = ball.x - paddle.x
            ball.setVelocityX(10 * diff)
        } else {
            // ボールがパドルの中央に当たった場合
            ball.setVelocityX(2 + Math.random() * 8)
        }
    }
}

function resetBall() {
    ball.setVelocity(0)
    ball.setPosition(paddle.x, 500)
    ball.setData('onPaddle', true)
}
