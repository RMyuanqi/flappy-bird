/*
* 管子类
* @pipe_up  上管子
* @pipe_down    下管子
* @step         步长
* @x            x位置
* */
function Pipe(pipe_up, pipe_down,step, x) {
    this.pipe_up = pipe_up;
    this.pipe_down = pipe_down;
    //上管子的高
    this.up_height = parseInt(Math.random() * 249) + 1;
    //下管子的高
    this.down_height = 250 - this.up_height;
    //步长
    this.step = step;
    this.x = x;
    //计数器
    this.count = 0;
}

//创建管子
Pipe.prototype.createPipe = function () {
    return new Pipe(this.pipe_up, this.pipe_down, this.step, this.x)
};
