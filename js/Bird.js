/*
* 鸟类
* @imgArr   图片数组
* @idx      图片索引
* @img      具体图片
* */
function Bird(imgArr, x, y) {
    this.imgArr = imgArr;
    this.idx = parseInt(Math.random() * this.imgArr.length);
    this.img = this.imgArr[this.idx];
    this.x = x;
    this.y = y;
    //定义鸟的状态
    this.state = "Down";
    //定义鸟的速度
    this.speed = 0;
}
//鸟煽动翅膀
Bird.prototype.fly = function () {
    this.idx++;
    if(this.idx >= this.imgArr.length){
        this.idx = 0
    }
    this.img = this.imgArr[this.idx];
};

//下降
Bird.prototype.fallDown = function () {
    //判断鸟的状态
    if(this.state === "Down"){
        this.speed++;
        //修改speed的值
        this.y += Math.sqrt(this.speed);
    }else{
        this.speed--;
        if(this.speed <= 0){
            this.state = "Down";
            return
        }
        this.y -= Math.sqrt(this.speed);
    }
};
//上升
Bird.prototype.goUp = function () {
    // this.y -= 30
    //非Down状态
    this.state = "Up";
    //上升速度
    this.speed = 20;
};