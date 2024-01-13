
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

    //find non matching pixels
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

    //run density based scan 
    var dbScanner = jDBSCAN().eps(12).minPts(1).distance('EUCLIDEAN').data(data);
 
    var point_assignment_result = dbScanner();

    //count the differences 
    var numDiffs = 0;

    for(var i = 0; i < point_assignment_result.length; i++){

        if (point_assignment_result[i] > numDiffs){
            numDiffs = point_assignment_result[i];
        }

    }

    var sum_x = 0;
    var sum_y = 0;
    var num_points = 0;

    // draw circles 
    for(var i = 0; i < numDiffs; i++){
        //calculate the center of the cluster of different pixels
        for(var j = 0; j < point_assignment_result.length; j++){
            if(point_assignment_result[j] == i){
                sum_x += data[j].x;
                sum_y += data[j].y;
                num_points = num_points + 1;
            }
        }

        var center_x = sum_x / num_points;
        var center_y = sum_y / num_points;

        //get radius of circle
        var max_distance_from_center = 0;

        for(var j = 0; j < point_assignment_result.length; j++){
            if(point_assignment_result[j] == i){
                var dist = Math.sqrt(((data[j].x - center_x) * (data[j].x - center_x)) + ((data[j].y - center_y) * (data[j].y - center_y)));

                if (Math.abs(dist) > max_distance_from_center){
                    max_distance_from_center = Math.abs(dist);
                }
            }
        }

        //use that center and radius to draw a circle
        contextOne.lineWidth = 3;
        contextOne.beginPath();
        contextOne.arc(center_x, center_y, max_distance_from_center ,0 , 2 * 3.14159); // 10 ought to become a radius
        contextOne.strokeStyle = "blue";
        contextOne.stroke();

        contextTwo.lineWidth = 3;
        contextTwo.beginPath();
        contextTwo.arc(center_x, center_y, max_distance_from_center ,0 , 2 * 3.14159); // 10 ought to become a radius
        contextTwo.strokeStyle = "blue";
        contextTwo.stroke();
        sum_x = 0;
        sum_y = 0;
        num_points = 0;
        max_distance_from_center = 0;
    }

    /*
    for(var i = 0; i < point_assignment_result.length; i++){

        switch (point_assignment_result[i]) {
            case 10:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 14, 185, 12, 111); // green rgba(14, 185, 12, 1)
                break;
            case 1:
                setPixel(imageDataOne,data[i].y * canvasOne.width + data[i].x, 255, 0, 0, 111); // red
                break;
            case 2:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 255, 0, 111); //yellow
                break;
            case 3:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 0, 255, 111); //blue
                break;
            case 4:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 255, 0, 205, 111); //pink
                break;
            case 5:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 255, 255, 111); //"tuquois"
                break;
            case 6:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 255, 162, 0, 111); //orange
                break;
            case 7:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 0, 0, 0, 111); //black
                break;
            case 8:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 255, 255, 255, 111); //white
                break;
            case 9:
                setPixel(imageDataOne, data[i].y * canvasOne.width + data[i].x, 150, 150, 150, 111); //grey
                break;
        }

    }

    contextOne.putImageData(imageDataOne, 0, 0);
    //contextTwo.putImageData(imageDataTwo, 0, 0);*/
    
}
