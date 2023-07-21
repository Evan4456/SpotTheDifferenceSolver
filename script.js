
function loadFirstImg(){
    var canvas = document.getElementById("ImgDisOne");
    var image = document.getElementById("fImage");

    var img = new SimpleImage(image);
    img.drawTo(canvas);
}

function loadSecondImg(){
    var canvas = document.getElementById("ImgDisTwo");
    var image = document.getElementById("sImage");

    var img = new SimpleImage(image);
    img.drawTo(canvas);
}

//should probably make these my own method later on
function getPixel(imgData, index) {
    var i = index*4, d = imgData.data;
    return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
}

function setPixel(imgData, index, r, g, b, a) {
    var i = index*4, d = imgData.data;
    d[i]   = r;
    d[i+1] = g;
    d[i+2] = b;
    d[i+3] = a;
  }

function spotTheDiff(){
    var canvasOne = document.getElementById("ImgDisOne");
    var canvasTwo = document.getElementById("ImgDisTwo");

    var diffs = document.getElementById("diffs");

    diffs.width = canvasOne.width;
    diffs.height = canvasOne.height;

    var contextOne = canvasOne.getContext("2d");
    var contextTwo = canvasTwo.getContext("2d");

    var diffsContext = diffs.getContext("2d");
    var diffsImage = diffsContext.getImageData(0,0, diffs.width, diffs.height);

    if(canvasOne.width != canvasTwo.width || canvasOne.height != canvasTwo.height){
        alert("Images must be the same size");
        return;
    }

    var imageDataOne = contextOne.getImageData(0,0, canvasOne.width, canvasOne.height );
    var imageDataTwo = contextTwo.getImageData(0,0, canvasTwo.width, canvasTwo.height );

    for(let i = 0; i < canvasOne.width * canvasOne.height; i++){
        var pxOne = getPixel(imageDataOne, i);
        var pxTwo = getPixel(imageDataTwo, i);
        if (JSON.stringify(pxOne) === JSON.stringify(pxTwo)){

        }else{
            setPixel(diffsImage, i , 57, 255, 20, 150);
            //setPixel(imageDataOne, i , 57, 255, 20, 150);
            //setPixel(imageDataTwo, i , 57, 255, 20, 150);
            //console.log("pixel being set");
        }
    }
    diffsContext.putImageData(diffsImage, 0, 0);
    //contextOne.putImageData(imageDataOne, 0, 0);
    //contextTwo.putImageData(imageDataTwo, 0, 0);

    return;
}