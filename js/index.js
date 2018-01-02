window.onload=function () {
 let section =document.querySelector('section');
 let mask = document.querySelector('.mask');
 // let canvas = document.querySelector('canvas');
 let shade = document.querySelectorAll('.shade>li');
 let option = document.querySelectorAll('.option>li');
 let styleBtn = document.querySelectorAll('.styleBtn');
 let colorBtn = document.querySelectorAll('input[type=color]');
 let lineWidth = document.querySelector('input[type=number]');
 let eraser = document.querySelector('.eraser');
 let eraserBtn = document.querySelector('.eraserBtn');
 let fontBtn = document.querySelector('.fontBtn');
 let clipBtn = document.querySelector('.clipBtn');
 let clip = document.querySelector('.clip');
 let create = document.querySelector('.create');
 let save = document.querySelector('#save>a');
 let palette =null;
 let canvas=null;
 //新建
 create.addEventListener ('click',function () {
     canvas = document.createElement('canvas');
     canvas.width = prompt('请输入画布的宽');
     canvas.height = prompt('请输入画布的高');
     section.appendChild(canvas);
     palette = new Palette(mask,canvas);
 });

//保存
save.addEventListener('click',function () {
    console.log(save)
    save.href = canvas.toDataURL('image/png');
    save.download = '1.png';
    // return false;
});
 shade.forEach(element=>{
     element.onclick=function () {
         let type = this.id;
         shade.forEach(ele=>ele.classList.remove('active'));
         element.classList.add('active');
         if(type=='ploy' || type=='ployJ'){
             let num = parseInt(prompt('请输入边数或者角数'));
             palette.draw(type,num);
         }else if(type=='pencil'){
             palette[type]();
         }else{
             palette.draw(type);
         }
     };

 });
 // shade[0].onclick();
 /////////////////////////////////////

 styleBtn.forEach(element=>{
    element.onclick=function () {
        styleBtn.forEach(ele=>ele.classList.remove('active'));
        element.classList.add('active');
        palette.style=this.id;
    };
});
 // styleBtn[0].onclick();
 //////////////////////////////////

 colorBtn.forEach(element=>{
     element.onchange=function () {
         palette[this.id]=this.value;
     }
 });
 //////////////////////////////////////////

 lineWidth.onchange=function () {
     palette.lineWidth=this.value;
 };

 ///////////////////////////////////////
  option.forEach(element=>{
      element.onclick=function () {
          let type = this.id;
          option.forEach(ele=>ele.classList.remove('active'));
          element.classList.add('active');
          if( type=='back' ){
              palette.back();
          }
         /* if(type=='newCreat'){
                if(confirm('确定要新建吗？')){
                    let w = prompt('请输入画布的宽');
                    let h = prompt('请输入画布的高');
                    let section = document.querySelector('section');
                    section.removeChild(canvas);
                    canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    // canvas.className = 'canvasStyle';
                    section.insertBefore(canvas,section.firstElementChild);
                    let mask = document.querySelector('.mask');
                    let palette = new Palette(mask,canvas);
                    shade[0].onclick();
                }
          }*/

      }
  });
  eraserBtn.onclick=function () {
        let w = prompt('请输入大小');
        palette.eraser(eraser,w);
    };

// 撤回 Ctrl+z
    window.onkeydown=function (e) {
        if(e.ctrlKey && e.key=='z'){
            if(palette.history.length){
                palette.history.pop();
                if(palette.history.length>0){
                    palette.ctx.putImageData(palette.history[palette.history.length -1],0,0);
                }
            }
        }
    };

//编辑文字
    fontBtn.onclick = function () {
        this.classList.add('active');
        palette.font();
    };
//裁剪
    clipBtn.onclick = function () {
        this.classList.add('active');
        palette.clip(clip);
    }
};


