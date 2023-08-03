//const jDBSCAN = require("./jDBSCAN");

function enableButton() {
    document.getElementById("spotTheDiff").disabled = false;
}

function loadFirstImg() {
    var canvas = document.getElementById("ImgDisOne");
    var image = document.getElementById("fImage");

    var img = new SimpleImage(image);
    img.drawTo(canvas);
}

function loadSecondImg() {
    var canvas = document.getElementById("ImgDisTwo");
    var image = document.getElementById("sImage");

    var img = new SimpleImage(image);
    img.drawTo(canvas);
}

function getPixel(imgData, index) {
    var i = index * 4, d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}

function setPixel(imgData, index, r, g, b, a) {
    var i = index * 4, d = imgData.data;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
}

function spotTheDiff() {
    var canvasOne = document.getElementById("ImgDisOne");
    var canvasTwo = document.getElementById("ImgDisTwo");

    var diffs = document.getElementById("diffs");

    diffs.width = canvasOne.width;
    diffs.height = canvasOne.height;

    var contextOne = canvasOne.getContext("2d");
    var contextTwo = canvasTwo.getContext("2d");

    var diffsContext = diffs.getContext("2d");
    var diffsImage = diffsContext.getImageData(0, 0, diffs.width, diffs.height);

    if (canvasOne.width != canvasTwo.width || canvasOne.height != canvasTwo.height) {
        alert("Images must be the same size");
        return;
    }

    var imageDataOne = contextOne.getImageData(0, 0, canvasOne.width, canvasOne.height);
    var imageDataTwo = contextTwo.getImageData(0, 0, canvasTwo.width, canvasTwo.height);

    for (let i = 0; i < canvasOne.width * canvasOne.height; i++) {
        var pxOne = getPixel(imageDataOne, i);
        var pxTwo = getPixel(imageDataTwo, i);
        if (JSON.stringify(pxOne) === JSON.stringify(pxTwo)) {

        } else {
            //setPixel(diffsImage, i , 57, 255, 20, 150);
            setPixel(imageDataOne, i, 57, 255, 20, 150);
            setPixel(imageDataTwo, i, 57, 255, 20, 150);
            //console.log("pixel being set");
        }
    }
    //diffsContext.putImageData(diffsImage, 0, 0);
    contextOne.putImageData(imageDataOne, 0, 0);
    contextTwo.putImageData(imageDataTwo, 0, 0);

    return;
}

function spotTheDiffClustersKMeans() {
    var canvasOne = document.getElementById("ImgDisOne");
    var canvasTwo = document.getElementById("ImgDisTwo");

    var contextOne = canvasOne.getContext("2d");
    var contextTwo = canvasTwo.getContext("2d");

    if (canvasOne.width != canvasTwo.width || canvasOne.height != canvasTwo.height) {
        alert("Images must be the same size");
        return;
    }

    var imageDataOne = contextOne.getImageData(0, 0, canvasOne.width, canvasOne.height);
    var imageDataTwo = contextTwo.getImageData(0, 0, canvasTwo.width, canvasTwo.height);

    var vectors = new Array;
    var pixelCount = 0;

    for (let w = 0; w < canvasOne.width; w++) {
        for (let h = 0; h < canvasOne.height; h++) {
            if (JSON.stringify(getPixel(imageDataOne, h * canvasOne.width + w)) === JSON.stringify(getPixel(imageDataTwo, h * canvasOne.width + w))) {

            } else {
                vectors[pixelCount] = [w, h];
                pixelCount = pixelCount + 1;
            }
        }
    }

    console.log(vectors);

    var clusters = figue.kmeans(document.getElementById("numDiffs").value, vectors);

    for (let i = 0; i < vectors.length; i++) {
        var cluster = clusters.assignments[i];

        switch (cluster) {
            case 0:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 14, 185, 12, 255); // green rgba(14, 185, 12, 1)
                break;
            case 1:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 255, 0, 0, 255); // red
                break;
            case 2:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 0, 255, 0, 255); //yellow
                break;
            case 3:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 0, 0, 255, 255); //blue
                break;
            case 4:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 255, 0, 205, 255); //pink
                break;
            case 5:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 0, 255, 255, 255); //"tuquois"
                break;
            case 6:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 255, 162, 0, 255); //orange
                break;
            case 7:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 0, 0, 0, 255); //black
                break;
            case 8:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 255, 255, 255, 255); //white
                break;
            case 9:
                setPixel(imageDataOne, vectors[i][1] * canvasOne.width + vectors[i][0], 150, 150, 150, 255); //grey
                break;
        }

    }

    contextOne.putImageData(imageDataOne, 0, 0);
    contextTwo.putImageData(imageDataTwo, 0, 0);

    return;
}

function spotTheDiffClustersDBSCAN(){
    var canvasOne = document.getElementById("ImgDisOne");
    var canvasTwo = document.getElementById("ImgDisTwo");

    var contextOne = canvasOne.getContext("2d");
    var contextTwo = canvasTwo.getContext("2d");

    if (canvasOne.width != canvasTwo.width || canvasOne.height != canvasTwo.height) {
        alert("Images must be the same size");
        return;
    }

    var imageDataOne = contextOne.getImageData(0, 0, canvasOne.width, canvasOne.height);
    var imageDataTwo = contextTwo.getImageData(0, 0, canvasTwo.width, canvasTwo.height);
    
    let data = [];
    var dataIndex = 0;

    for (let w = 0; w < canvasOne.width; w++) {
        for (let h = 0; h < canvasOne.height; h++) {
            if (JSON.stringify(getPixel(imageDataOne, h * canvasOne.width + w)) === JSON.stringify(getPixel(imageDataTwo, h * canvasOne.width + w))) {

            } else {
                data[dataIndex] = 
                    {
                        x: w,
                        y: h
                    };
                dataIndex = dataIndex + 1;
            }
        }
    }


    var dbScanner = jDBSCAN().eps(12).minPts(1).distance('EUCLIDEAN').data(data);

    var point_assignment_result = dbScanner();

    
    for(var i = 0; i < point_assignment_result.length; i++){

        switch (point_assignment_result[i]) {
            case 10:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 14, 185, 12, 255); // green rgba(14, 185, 12, 1)
                break;
            case 1:
                setPixel(imageDataOne,data[i].y * canvasOne.width + data[i].x, 255, 0, 0, 255); // red
                break;
            case 2:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 255, 0, 255); //yellow
                break;
            case 3:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 0, 255, 255); //blue
                break;
            case 4:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 255, 0, 205, 255); //pink
                break;
            case 5:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 255, 255, 255); //"tuquois"
                break;
            case 6:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 255, 162, 0, 255); //orange
                break;
            case 7:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 0, 0, 255); //black
                break;
            case 8:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 255, 255, 255, 255); //white
                break;
            case 9:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 150, 150, 150, 255); //grey
                break;
        }
    }

    contextOne.putImageData(imageDataOne, 0, 0);
    contextTwo.putImageData(imageDataTwo, 0, 0);
    
}