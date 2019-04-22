const KEYS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    SPACE: ' ',
};

let game = {
    platform: null,
    ball: null,
    blocks: [],
    rows: 4,
    cols: 8,
    width: 640,
    height: 360,
    ctx: null,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null
    },

    init() {
        this.ctx = document.getElementById('mycanvas').getContext('2d');
        this.setEvents();
    },
    setEvents() {
        window.addEventListener('keydown', (event) => {
            if (event.key === KEYS.SPACE) {
                this.platform.shoot();
            } else if (event.key === KEYS.LEFT || event.key === KEYS.RIGHT) {
                this.platform.start(event.key);
            }
        });

        window.addEventListener('keyup', () => {
            this.platform.stop();
        })
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;

        let onImageLoad = () => {
            ++loaded;

            if (loaded >= required) {
                callback();
            }
        };

        for (let key in this.sprites) {
            if (this.sprites.hasOwnProperty(key)) {

                this.sprites[key] = new Image();
                this.sprites[key].src = `img/${key}.png`;

                this.sprites[key].addEventListener('load', () => onImageLoad())
            }
        }
    },
    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x: 64 * col + 65,
                    y: 24 * row + 35,
                })
            }
        }
    },
    update() {
        this.platform.move();
        this.ball.move();
    },
    run() {
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        });
    },
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage
        (
            this.sprites.ball,
            0,
            0,
            this.ball.width,
            this.ball.height,
            this.ball.x,
            this.ball.y,
            this.ball.width,
            this.ball.height
        );
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
    },
    renderBlocks() {
        for (let block of this.blocks) {
            this.ctx.drawImage(this.sprites.block, block.x, block.y);
        }
    },
    start() {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
    }
};

game.ball = {
    offsetY: 0,
    limit: 3,
    x: 320,
    y: 280,
    width: 20,
    height: 20,
    start() {
        this.offsetY = -this.limit;
    },
    move() {
        if (this.offsetY) {
            this.y += this.offsetY;
        }
    }
};

game.platform = {
    offsetX: 0,
    limit: 6,
    x: 280,
    y: 300,
    ball: game.ball,
    shoot() {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
        }
    },
    start(direction) {
        if (direction === KEYS.LEFT) {
            this.offsetX = -this.limit;
        } else if (direction === KEYS.RIGHT) {
            this.offsetX = this.limit;
        }
    },
    stop() {
        this.offsetX = 0
    },
    move() {
        if (this.offsetX) {
            this.x += this.offsetX;
            if (this.ball) {
                this.ball.x += this.offsetX;
            }
        }
    }
};

window.addEventListener('load', () => {
    game.start();
});
