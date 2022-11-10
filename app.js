const box = document.querySelector(".box"), 
      img = document.querySelector(".img")

let img_h=img.height,
    img_w=img.width,
    box_h=box.offsetHeight,
    box_w=box.offsetWidth,
    limit_h=(img_h-box_h),//圖片可以移動的限制距離
    limit_w=(img_w-box_w),//圖片可以移動的限制距離
    condition

let scale = 1,
    scale_min = 1,//最小倍率
    scale_max = 10,//最大倍率
    Magnification =1,//每次調整n倍
    mouse_D = false,
    start = { x: 0, y: 0 },
    d_XY={ x: 0, y:0 },
    n_XY={ x: 0, y: 0 }

//顯示移動的樣式
function setTransform() {
                        img.style.transform = `translate(${d_XY.x}px, ${d_XY.y}px)scale(${scale})`;
                        img_h=img.height*scale;
                        img_w=img.width*scale;
                        limit_h=(img_h-box_h);
                        limit_w=(img_w-box_w)
                    }
setTransform()
//畫面初始化
window.onload=()=>{ if(img.style.height=="100%"){d_XY={ x: -(limit_w)/2, y:0 }}
                    else if(img.style.width=="100%"){d_XY=d_XY={ x: 0, y:-(limit_h)/2 }}
                    setTransform()
                    
                }
//畫面初始化
window.onresize=()=>{ if(img.style.height=="100%"){d_XY={ x: -(limit_w)/2, y:0 }}
                    else if(img.style.width=="100%"){d_XY=d_XY={ x: 0, y:-(limit_h)/2 }}
                    img_h=img.height,
                    img_w=img.width,
                    box_h=box.offsetHeight,
                    box_w=box.offsetWidth,
                    limit_h=(img_h-box_h),//圖片可以移動的限制距離
                    limit_w=(img_w-box_w),//圖片可以移動的限制距離
                    setTransform()
                    
                }

//縮放功能
img.addEventListener ( "wheel" , e => {
//取消默認滾動事件，如果原本超過顯示介面會自動產生滾軸時，這時候默認的滾動事件就會是自動產生的那個卷軸，如果沒有阻止原本產生的卷軸滾動，那麼後來設定的滾動事件將無法觸及
                                        e.preventDefault();
                                        let xs = (e.offsetX - d_XY.x) / scale,
                                            ys = (e.offsetY - d_XY.y) / scale;

                                        if (e.deltaY < 0) {//向上滑動
                                                            if (scale >= scale_min && scale < scale_max) {//放大
                                                                        //縮放倍數四捨五入到小數後一位
                                                                        scale += Magnification;
                                                                        scale = Number( scale.toFixed(1) );
                                                                        // setTransform();
                                                                        //將圖片縮放到新倍數後，距離原尺寸的偏移量
                                                                        d_XY.x = (xs - xs * scale);
                                                                        d_XY.y = (ys - ys * scale);
                                                                
                                                                    }
                                        }else{//向下滑動
                                                scale -= Magnification;//縮小

                                                if(scale<=scale_min){scale=scale_min}; //最小為原尺寸
                                                    
                                                //縮放倍數四捨五入到小數後一位
                                                scale = Number( scale.toFixed(1) );

                                                setTransform();//先縮放圖片一遍，可以更新圖片尺寸方便後面呼叫

                                                //將圖片縮放到新倍數後，距離原尺寸的偏移量
                                                d_XY.x = (xs - xs * scale);
                                                d_XY.y = (ys - ys * scale);
                                                
                                                //若是寬度填滿
                                                if ( img.style.width == "100%" ) {
                                                    
                                                    if (scale == 1) { //縮放為原尺寸時，圖片置中
                                                        d_XY = {x : 0 , y : -(limit_h) / 2};
                                                    
                                                    } else if (img_h<box_h) { //縮小到圖高比容器高小時
                                                        //垂直調整
                                                        d_XY = {x : -(limit_w) / 2 , y : -(limit_h) / 2};//將圖片垂直置中
                                                    }

                                                };
                                                //若是高度填滿
                                                if(img.style.height == "100%"){

                                                    if (scale == 1) { //縮放為原尺寸時，圖片置中
                                                        d_XY = {x :  -(limit_w) / 2 , y : 0};
                                                    
                                                    } else if (img_w < box_w) { //縮小到圖寬比容器寬小時
                                                        //水平調整
                                                        d_XY = {x : -(limit_w) / 2 , y : -(limit_h) / 2};//將圖片水平置中
                                                    }
                                                }
                                        }

                                        setTransform();
                                        
                                    })

//點擊圖片取得點擊座標start.x/start.y
img.addEventListener( "mousedown" , e => {//監聽圖片

                                    //取得圖片自身位置(e.offsetX/Y)
                                    start.x = e.offsetX;
                                    start.y = e.offsetY;
                
                                    mouse_D = true;
                                    img.style.cursor = "grabbing";
                                    document.addEventListener ( 'mousemove' , move )
                                    //移動監聽文件，可以超出紅框範圍外繼續拖動                
                                    }
                )

                
function move(e) {
            e.preventDefault();
            if (mouse_D) {//按下滑鼠打開一動開關才能移動
                if (e.target != img) {
//本來事件抓到的e.target是img，在chrome中，會因為移出box範圍外，img被隱藏而e.target電城body標籤，但是在火狐就不會(依樣會是img tag)
                                    mouse_D = false;//所以直接設定成chrome只能作用在抓地到沒影藏的圖片中，超過就會停止移動了
                } else {    //不過firefox還是可以繼續移動，所以一樣要做程式設定

                        //移動當下的新座標
                        n_XY.x = e.offsetX;
                        n_XY.y = e.offsetY;

                        //與按下滑鼠時的距離差多少
                        d_XY.x += n_XY.x - start.x;
                        d_XY.y += n_XY.y - start.y;

                        //執行改變圖片位置  
                        setTransform();

                }
                    }
            }   
document.addEventListener ( "mouseup" , e => {//完成移動監聽文件，可在紅框範圍外放開結束拖動
                                                e.preventDefault();
                                                if(img.style.width == "100%"){
                                                    
                                                                            //上下移動限制
                                                                            if (img_h < box_h){    //不論幾倍，只要圖高比容器高小，就把影像上下置中

                                                                                    d_XY.y = -(limit_h) / 2;

                                                                            } else {

                                                                                //上側貼邊極限
                                                                                if (d_XY.y >= 0) {    
                                                                                        d_XY.y = 0;//圖片上緣貼齊容器
                                                                                //下側貼邊極限
                                                                                } else {

                                                                                        if (d_XY.y < -limit_h) { d_XY.y = -limit_h };//圖片下緣貼齊容器
                                                                                }

                                                                            }

                                                                            //左右移動限制
                                                                            if (scale == 1) {// 一倍時不可移動，如果有放大的話執行else

                                                                                    d_XY.x = 0;

                                                                            } else {
                                                                                    //左側貼邊極限
                                                                                    if (d_XY.x >= 0) { d_XY.x = 0 };//圖片貼齊左側容器
                                                                                    //右側貼邊極限
                                                                                    if (d_XY.x <= -limit_w) { d_XY.x = -limit_w };//圖片貼其右側容器

                                                                            }
                                                                    
                                                //若是設定樣式為高度原尺寸左右自動的話                     
                                                } else if (img.style.height == "100%"){

                                                                                    //左右移動限制
                                                                                    if (img_w < box_w) {//不論幾倍，只要塗關比容器寬小，就把影像左右置中

                                                                                            d_XY.x = -(limit_w) / 2;

                                                                                    } else {
                                                                                        //左側貼邊極限
                                                                                        if (d_XY.x >= 0) {

                                                                                                d_XY.x = 0;//圖片貼齊左側容器
                                                                                        //右側貼邊極限
                                                                                        } else {

                                                                                                if (d_XY.x < -limit_w) { d_XY.x = -limit_w };//圖片貼其右側容器

                                                                                        }

                                                                                    }

                                                                                    // 上下移動限制
                                                                                    if (scale == 1) {// 一倍時不可移動，如果有放大的話執行else

                                                                                            d_XY.y = 0;

                                                                                    } else {
                                                                                        //上側貼邊極限
                                                                                        if (d_XY.y >= 0) {d_XY.y = 0};//圖片上緣貼齊容器
                                                                                        //下側貼邊極限
                                                                                        if (d_XY.y <= -limit_h) {d_XY.y = -limit_h };//圖片下緣貼齊容器
                                                                                    }
                                                }
                                                setTransform();//更新圖片位置，因為move時是允許圖片寬高拖到範圍外，但最後停住時要拉回來，所以要在改變一次移動距離
                                                img.style.cursor = "grab";//改回手掌圖標
                                                mouse_D = false;//關掉移動控制開關  
                                            }   
                        )
