class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100        

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)


        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)
        // Create a tween to set bouncing wall
        this.tweens.add({
            targets: wallA,
            x: {
                from: wallA.x,
                to: width - wallA.width / 2,
            },
            duration: 2000, // Adjust the duration as needed
            yoyo: true, // This makes it go back and forth
            repeat: -1, // Repeat indefinitely
        });
        

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])
        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false


        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            //improve shot logic
             // Calculate the difference in x-position between pointer and ball
             let xOffset = pointer.x - this.ball.x;
             // Calculate the ratio of xOffset to the maximum xOffset (half of the ball's width)
             let xRatio = xOffset / (this.ball.width / 2);
 
             // Set the ball's x-velocity based on the ratio
             this.ball.body.setVelocityX(xRatio * this.SHOT_VELOCITY_X);
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
    
        })


        

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy()
            //add ball reset logic on succesful shot
            this.resetBall()
            this.physics.add.collider(this.ball, this.walls);
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)
        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneway)
    }

    update() {

    }

    createBall() {
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball');
        this.ball.body.setCircle(this.ball.width / 2);
        this.ball.body.setCollideWorldBounds();
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);
    }

    resetBall() {
        this.ball.destroy(); // Destroy the existing ball
        this.createBall();   // Create a new ball
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ ] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/