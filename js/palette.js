/*
* 属性
*   canvas ctx
* 方法
*
* */




class Palette{
    constructor(mask,canvas){
        this.canvas = canvas;
        this.mask = mask;
        this.ctx = this.canvas.getContext('2d');

        this.cw = this.canvas.width;
        this.ch = this.canvas.height;

        this.style = 'fill';
        this.fillStyle='#000';
        this.strokeStyle='#000';
        this.lineWidth=1;

        this.history=[];
        this.temp=null;
    }
    _init(){
        this.ctx.fillStyle=this.fillStyle;
        this.ctx.strokeStyle=this.strokeStyle;
        this.ctx.lineWidth=this.lineWidth;
    }
    draw(type,num){
        let that = this;
        this.mask.onmousedown=function (e) {
            let ox = e.offsetX,oy = e.offsetY;
            that.mask.onmousemove=function (e) {
                let mx = e.offsetX,my = e.offsetY;
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if(that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }
                that._init();
                that[type](ox,oy,mx,my,num);
            };
            that.mask.onmouseup=function () {
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                that.mask.onmousemove=null;
                that.mask.onmouseup=null;
            };
        };
    }
    line(ox,oy,mx,my){
        this.ctx.beginPath();
        this.ctx.moveTo(ox,oy);
        this.ctx.lineTo(mx,my);
        this.ctx.stroke();
    }

    dash(ox,oy,mx,my) {
        this.ctx.beginPath();
        this.ctx.setLineDash([3],[10]);
        this.ctx.moveTo(ox,oy);
        this.ctx.lineTo(mx,my);
        this.ctx.stroke();
        this.ctx.setLineDash([0],[0]);
    }

    pencil(){
        let that = this;
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX,oy = e.offsetY;
            that._init();
            that.ctx.beginPath();
            that.ctx.moveTo(ox,oy);
            that.mask.onmousemove=function (e) {
                let mx = e.offsetX,my = e.offsetY;
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if(that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }
                that.ctx.lineTo(mx,my);
                that.ctx.stroke();
            };
            that.mask.onmouseup=function () {
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.mask.onmousemove=null;
                that.mask.onmouseup=null;
            };

        }

    }

    circle(ox,oy,mx,my){
        let r=Math.sqrt(Math.pow(ox-mx,2) + Math.pow(oy-my,2));
        this.ctx.beginPath();
        this.ctx.arc(ox,oy,r,0,2*Math.PI);
        this.ctx[this.style]();
    }

    rect(ox,oy,mx,my){
        let w = mx-ox;
        let h = my-oy;
        this.ctx[this.style+'Rect'](ox,oy,w,h);

        }

    ploy(ox,oy,mx,my,num){
        let deg = 2*Math.PI/num;
        let r=Math.sqrt(Math.pow(ox-mx,2) + Math.pow(oy-my,2));
        this.ctx.beginPath();
        this.ctx.moveTo(ox+r,oy);
            for(let i=0;i<num;i++){
                let x = ox+r*Math.cos(deg*i);
                let y = oy+r*Math.sin(deg*i);
                this.ctx.lineTo(x,y);
            }
        this.ctx.closePath();
        this.ctx[this.style]();
    }

    ployJ(ox,oy,mx,my,num){
        let R=Math.sqrt(Math.pow(ox-mx,2) + Math.pow(oy-my,2));
        this.creatStar(R,ox,oy,num);

    }
    creatStar(R,ox,oy,num=5){
        let ang = Math.PI / num;
        let r = R/3;
        this._init();
        this.ctx.beginPath();
        this.ctx.moveTo(ox+R,oy);
        for(let i=0;i<num*2;i++){
            let x,y;
            if(i%2==0){
                x = ox +R*Math.cos(ang*i);
                y = oy +R*Math.sin(ang*i);
            }else{
                x = ox +r*Math.cos(ang*i);
                y = oy +r*Math.sin(ang*i);
            }
            this.ctx.lineTo(x,y);
        }
        this.ctx.closePath();
        this.ctx[this.style]();
    }

    // 橡皮擦
    eraser(eraser,w){
        let that = this;
        this.mask.onmousedown=function (e) {
            let ox = e.offsetX,oy = e.offsetY;
            eraser.style.display='block';
            eraser.style.width=w + 'px';
            eraser.style.height=w + 'px';
            eraser.style.left = ox-w/2 +'px';
            eraser.style.top = oy-w/2 +'px';
            that.mask.onmousemove=function (e) {
                let ox = e.offsetX,oy = e.offsetY;
                let lefts = ox-w/2,tops=oy-w/2;
                eraser.style.left = lefts+'px';
                eraser.style.top = tops+'px';
                that.ctx.clearRect(lefts,tops,w,w);

            };
            that.mask.onmouseup=function () {
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                eraser.style.display='none';
                that.mask.onmouseup=null;
                that.mask.onmousemove=null;


            }
        }
    }
    // 撤回
    back(){
        if(this.history.length){
            this.history.pop();
            if(this.history.length>0){
                this.ctx.putImageData(this.history[this.history.length -1],0,0);
            }
        }
    }
    //文字编辑
    font(){
        this.mask.ondblclick = function (e) {
            this.mask.onmousedown=null;
            let ox = e.offsetX, oy = e.offsetY;
            let inputs = document.createElement('input');
            inputs.style.cssText = `width:80px;height:40px;border:1px solid #ccc;
            position:absolute;left:${ox}px;top:${oy}px;z-index:99;
            `;
            inputs.autofocus=true;
            this.mask.appendChild(inputs);

            inputs.onblur=function () {
                let ox = inputs.offsetLeft, oy = inputs.offsetTop;
                let v = inputs.value;
                this.ctx.font='20px 微软雅黑';
                this.ctx.fillText(v,ox,oy);
                this.mask.removeChild(inputs);
                inputs = null;
            }.bind(this);
            //拖拽
            inputs.onmousedown = function (e) {
                let ox = e.clientX, oy = e.clientY,
                    l = inputs.offsetLeft, t = inputs.offsetTop;
                this.mask.onmousemove = function (e) {
                    let mx = e.clientX , my = e.clientY;

                    let lefts = l + mx - ox,
                        tops = t + my -oy;
                    if(lefts<0){
                        lefts = 0;
                    }
                    if(lefts>this.cw-82 ){
                        lefts = this.cw-82
                    }
                    if(tops<0){
                        tops = 0;
                    }
                    if(tops>this.ch-42 ){
                        tops = this.ch-42
                    }
                    console.log(this.ch);
                    inputs.style.left=lefts + 'px';
                    inputs.style.top=tops + 'px';
                }.bind(this);
                inputs.onmouseup = function () {
                    this.mask.onmousemove=null;
                    inputs.onmouseup=null;
                }.bind(this)
            }.bind(this);
        }.bind(this);   //改变this指向
        console.log(this);

    }
    
    //裁切
    clip(clip){
        let that = this;
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX, oy = e.offsetY ,w ,h,minx,miny;
            clip.style.display = 'block';
            clip.style.left=ox + 'px';
            clip.style.top =oy + 'px';
            that.mask.onmousemove = function (e) {
                let mx = e.offsetX,my = e.offsetY;
                minx = ox<mx?ox:mx; //判断左上角点的位置
                miny = oy<my?oy:my;
                w = Math.abs(ox-mx);//尺寸
                h = Math.abs(oy-my);
                clip.style.left=minx + 'px';
                clip.style.top =miny + 'px';
                clip.style.width = w + 'px';
                clip.style.height = h + 'px';
            };

            that.mask.onmouseup = function () {
                that.mask.onmousemove=null;
                that.mask.onmouseup=null;
                that.temp = that.ctx.getImageData(minx,miny,w,h);//存
                that.ctx.clearRect(minx,miny,w,h);//清
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));//加到历史记录
                that.ctx.putImageData(that.temp,minx,miny);//放
                that.drag(clip,minx,miny);

            }
        };
    }
    drag(clip,minx,miny){
        let that = this;
        this.mask.onmousedown=function (e) {
            let ox = e.offsetX, oy = e.offsetY;
            that.mask.onmousemove=function (e) {
                let mx = e.offsetX, my = e.offsetY;
                let lefts = minx + mx - ox,
                    tops = miny + my - oy;
                clip.style.left=lefts + 'px';
                clip.style.top=tops + 'px';

                that.ctx.clearRect(0,0,that.cw,that.ch);
                if(that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }
                that.ctx.putImageData(that.temp,lefts,tops);
            };
            that.mask.onmouseup=function () {
                that.mask.onmousedown=null;
                that.mask.onmousemove=null;
                that.mask.onmouseup=null;
                clip.style.display='none';
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
            }
        }
    }

}