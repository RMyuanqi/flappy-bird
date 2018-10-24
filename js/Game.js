/*
 * Game  游戏类
 * @ctx  画笔
 * @bird 鸟的实例
 * @pipe 管子的实例
 * @land 地面的实例
 * @mountain 背景的实例
 * @logo   ready，over
 * */
function Game(ctx, bird, pipe, land, mountain, logo) {
    this.ctx = ctx;
    this.bird = bird;
    this.pipeArr = [pipe];
    this.land = land;
    this.mountain = mountain;
    this.logoArr = [logo];
    this.timer = null;
    //定义帧   翅膀煽动的频率
    this.iframe = 0;

    //管子的帧
    this.pipe_iframe = 0;

    //调用init 最后一句
    this.init();
}

//初始化
Game.prototype.init = function () {
    // this.start();
    // this.bindEvent();
    //页面打开状态
    this.bindEventStar();
};

//渲染山
Game.prototype.renderMountain = function () {
    var img = this.mountain.img;
    this.mountain.x -= this.mountain.step;
    if (this.mountain.x < -img.width) {
        this.mountain.x = 0
    }
    this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
    this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
    this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);
};



//渲染地面
Game.prototype.renderLand = function () {
    var img = this.land.img;
    this.land.x -= this.land.step;
    if (this.land.x < -img.width) {
        this.land.x = 0
    }
    this.ctx.drawImage(img, this.land.x, this.land.y);
    this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
    this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
};
//开始游戏
Game.prototype.start = function () {
    var me = this;
    this.timer = setInterval(function () {
        //改变帧
        me.iframe++;
        me.clear();
        //像素检测
        // me.checkPX();
        me.renderMountain();
        me.renderLand();
        me.renderBird();
        if (!(me.iframe % 10)) {
            me.bird.fly()
        }
        //鸟下降
        me.bird.fallDown();
        //管子移动
        me.movePipe();
        //渲染管子
        me.renderPipe();
        //管子的帧改变
        me.pipe_iframe++;
        if (!(me.pipe_iframe % 65)) {
            me.createPipe();
        }
        // //清除管子
        me.clearPipe();

        //渲染鸟的四个点
        // me.renderBirdPoints();
        // me.renderPipePoints();

        //碰撞检测
        me.checkBoom();
    }, 20)
};

//清屏
Game.prototype.clear = function () {
    this.ctx.clearRect(0, 0, 360, 512)
};

//渲染鸟
Game.prototype.renderBird = function () {
    var img = this.bird.img;
    this.ctx.save();
    this.ctx.translate(this.bird.x, this.bird.y);
    // this.ctx.strokeRect(-this.bird.img.width / 2 + 5, -this.bird.img.height / 2 + 8, this.bird.img.width - 10, this.bird.img.height - 15);
    var deg = this.bird.state === "Down" ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
    this.ctx.rotate(deg);
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
    this.ctx.restore();
};

//页面打开
Game.prototype.bindEventStar = function () {
    var me = this;
    this.timer = setInterval(function () {
        //改变帧
        me.iframe++;
        me.clear();
        me.renderMountain();
        me.renderLand();
        me.renderBird();
        if (!(me.iframe % 10)) {
            me.bird.fly()
        }
        me.renderGameReady();
        me.renderTitle();
    }, 20);
    //准备状态值能点击一次
    var result = true;
    this.ctx.canvas.onclick = function () {
        if(result){
            clearInterval(me.timer);
            //游戏开始
            me.start();
            //点击上升
            me.bindEvent();
        }
        result = false;
    }
};

//绑定点击事件
Game.prototype.bindEvent = function () {
    var me = this;
    this.ctx.canvas.onclick = function () {
        me.bird.goUp();
    }
};

//绘制管子
Game.prototype.renderPipe = function () {
    var me = this;
    this.pipeArr.forEach(function (value, index) {
        //上管子
        //drawImage9个参数，矩形x，矩形y，矩形w，矩形h，canvas上的x，y，w，h
        var up_img = value.pipe_up;
        var img_x = 0;
        //图片的高度-上管子的高度
        var img_y = up_img.height - value.up_height;
        //上管子的宽度
        var img_w = up_img.width;
        //上管子的高度
        var img_h = value.up_height;
        //canvas上的x点  canvas的宽
        var canvas_x = me.ctx.canvas.width - value.step * value.count;
        var canvas_y = 0;
        //上管子宽度
        var canvas_w = up_img.width;
        //上管子的高度
        var canvas_h = value.up_height;
        //绘制图片
        me.ctx.drawImage(up_img, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);

        //下管子
        var down_img = value.pipe_down;
        var down_img_x = 0;
        var down_img_y = 0;
        var down_img_w = down_img.width;
        //下管子的高度  250-上管子的高度
        var down_img_h = 250 - value.up_height;
        //canvas的宽度
        var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
        //上管子的高度+开口距离
        var down_canvas_y = value.up_height + 150;
        //下管子的宽度
        var down_canvas_w = down_img_w;
        //250-上管子的高度
        var down_canvas_h = down_img_h;
        me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h)
    })
};

//管子移动
Game.prototype.movePipe = function () {
    this.pipeArr.forEach(function (value) {
        value.count++;
    })
};

//创建多根管子
Game.prototype.createPipe = function () {
    var pipe = this.pipeArr[0].createPipe();
    this.pipeArr.push(pipe);
};

//清理数组中的管子
Game.prototype.clearPipe = function () {
    for (var i = 0; i < this.pipeArr.length; i++) {
        var pipe = this.pipeArr[i];
        // console.log(this.ctx.canvas.width);
        if (pipe.x - pipe.count * pipe.step < -pipe.pipe_up.width) {
            this.pipeArr.splice(i, 1);
            // console.log("第" + i + "根管子该移除了");
            // console.log(this.pipeArr.length);
            return
        }
    }
};

//绘制鸟的四个点
Game.prototype.renderBirdPoints = function () {
    var bird_A = {
        x: -this.bird.img.width / 2 + 5 + this.bird.x,
        y: -this.bird.img.height / 2 + 8 + this.bird.y
    };
    var bird_B = {
        x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 10 + this.bird.x,
        y: -this.bird.img.height / 2 + 8 + this.bird.y
    };
    var bird_C = {
        x: -this.bird.img.width / 2 + 5 + this.bird.x,
        y: -this.bird.img.height / 2 + 8 + this.bird.img.height - 15 + this.bird.y
    };
    var bird_D = {
        x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 10 + this.bird.x,
        y: -this.bird.img.height / 2 + 8 + this.bird.img.height - 15 + this.bird.y
    };
    this.ctx.beginPath();
    this.ctx.moveTo(bird_A.x, bird_A.y);
    this.ctx.lineTo(bird_B.x, bird_B.y);
    this.ctx.lineTo(bird_D.x, bird_D.y);
    this.ctx.lineTo(bird_C.x, bird_C.y);
    this.ctx.closePath();
    this.ctx.stroke();
};

//管子上的8个点
Game.prototype.renderPipePoints = function () {
    for (var i = 0; i < this.pipeArr.length; i++) {
        var pipe = this.pipeArr[i];
        //上管子
        var pipe_up_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: 0
        };
        var pipe_up_B = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: 0
        };
        var pipe_up_C = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height
        };
        var pipe_up_D = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: pipe.up_height
        };

        this.ctx.beginPath();
        this.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
        this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
        this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
        this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = "blue";
        this.ctx.stroke();

        //下管子
        var pipe_down_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height + 150
        };
        var pipe_down_B = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: pipe.up_height + 150
        };
        var pipe_down_C = {
            x: pipe_down_A.x,
            y: 400
        };
        var pipe_down_D = {
            x: pipe_down_B.x,
            y: 400
        };
        this.ctx.beginPath();
        this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
        this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
        this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
        this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
};

//碰撞检测
Game.prototype.checkBoom = function () {
    for (var i = 0; i < this.pipeArr.length; i++) {
        var pipe = this.pipeArr[i];
        //上管子
        var pipe_up_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: 0
        };
        var pipe_up_B = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: 0
        };
        var pipe_up_C = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height
        };
        var pipe_up_D = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: pipe.up_height
        };

        // this.ctx.beginPath();
        // this.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
        // this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
        // this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
        // this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
        // this.ctx.closePath();
        // this.ctx.strokeStyle = "blue";
        // this.ctx.stroke();

        //下管子
        var pipe_down_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height + 150
        };
        var pipe_down_B = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: pipe.up_height + 150
        };
        var pipe_down_C = {
            x: pipe_down_A.x,
            y: 400
        };
        var pipe_down_D = {
            x: pipe_down_B.x,
            y: 400
        };
        // this.ctx.beginPath();
        // this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
        // this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
        // this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
        // this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
        // this.ctx.closePath();
        // this.ctx.stroke();

        //鸟的四个点
        var bird_A = {
            x: -this.bird.img.width / 2 + 5 + this.bird.x,
            y: -this.bird.img.height / 2 + 12 + this.bird.y
        };
        var bird_B = {
            x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
            y: -this.bird.img.height / 2 + 12 + this.bird.y
        };
        var bird_C = {
            x: -this.bird.img.width / 2 + 5 + this.bird.x,
            y: -this.bird.img.height / 2 + 7 + this.bird.img.height - 17 + this.bird.y
        };
        var bird_D = {
            x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
            y: -this.bird.img.height / 2 + 7 + this.bird.img.height - 17 + this.bird.y
        };
        // this.ctx.beginPath();
        // this.ctx.moveTo(bird_A.x, bird_A.y);
        // this.ctx.lineTo(bird_B.x, bird_B.y);
        // this.ctx.lineTo(bird_D.x, bird_D.y);
        // this.ctx.lineTo(bird_C.x, bird_C.y);
        // this.ctx.closePath();
        // this.ctx.stroke();


        //碰撞检测
        //鸟的B点与上管子的C点对比
        if (bird_B.x >= pipe_up_C.x && bird_B.y <= pipe_up_C.y && bird_A.x <= pipe_up_D.x) {
            console.log("gameOver上");
            this.renderGameOver();
        }
        //鸟的D点与下管子的A点对比
        if (bird_D.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_A.x <= pipe_down_B.x) {
            console.log("gameOver下");
            this.renderGameOver();
        }

        //与地面检测
        var land = {
            // x : this.ctx.canvas.width - pipe.step * pipe.count,
            y: 400
        };
        if (bird_D.y >= land.y) {
            console.log("撞地上了");
            this.renderGameOver();
        }

    }
};

//结束
Game.prototype.renderGameOver = function () {
    var me = this;
    this.logoArr.forEach(function (value, index) {
        var img = value.over;
        me.ctx.drawImage(img, me.ctx.canvas.width / 2 - img.width / 2, me.ctx.canvas.height / 2 - img.height);
    });
    clearInterval(this.timer);
};

//title
Game.prototype.renderTitle = function () {
    var me = this;
    this.logoArr.forEach(function (value) {
        var img = value.title;
        me.ctx.drawImage(img, me.ctx.canvas.width / 2 - img.width / 2, me.ctx.canvas.height / 2 - img.height * 3);
    })
};

//ready
Game.prototype.renderGameReady = function () {
    var me = this;
    this.logoArr.forEach(function (value) {
        var img = value.ready;
        me.ctx.drawImage(img, me.ctx.canvas.width / 2 - img.width / 2, me.ctx.canvas.height / 2 - img.height);
    });
};

// //像素检测

// Game.prototype.checkPX = function () {
//     this.ctx.clearRect(0, 0, 360, 512);
//     this.ctx.save();
//     this.renderPipe();
//     // 改变融合方式
//     this.ctx.globalCompositeOperation = "source-in";
//     this.renderBird();
//     this.ctx.restore();
//     // var imgData = this.ctx.getImageData(0, 0, 360, 512);
//     // for (var i = 0; i < imgData.data.length; i++) {
//     //     if (imgData.data[i]) {
//     //         console.log("撞到了");
//     //         this.renderGameOver();
//     //         return;
//     //     }
//     // }
// };