window.onload = readData();

function readData() {
    var url = "./data.json"
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        // if (request.status == 200) {
        var json = JSON.parse(request.responseText);
        console.log(json);

        diaplay(json);
        // }
    }
}

function diaplay(jsonData) {
    var mainArea = document.getElementById('mainArea');

    //节气
    for (term in jsonData) {
        var termDiv = document.createElement("div");
        termDiv.className = 'termArea';
        mainArea.append(termDiv);

        var termHeader = document.createElement("h3");
        termDiv.append(termHeader);
        termHeader.innerHTML = `${term}`;
        termHeader.style.textAlign = "center";
        termHeader.className = 'term-name';
        var weatherData = jsonData[term];

        //三侯
        for (weather in weatherData) {

            var weatherP = document.createElement("h4");
            termDiv.append(weatherP);
            weatherP.innerHTML = `${weather}`;
            weatherP.className = "weather-name";
            var colorData = weatherData[weather];

            //起承转合4颜色
            for (i in colorData) {
                var rgbData = colorData[i].RGB.split(',');
                var r = parseInt(rgbData[0]);
                var g = parseInt(rgbData[1]);
                var b = parseInt(rgbData[2]);

                var txt = `${colorData[i].NAME}: R${r} G${g} B${b}`
                var rgbHex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

                var li = document.createElement("span");
                termDiv.append(li);
                li.innerHTML = txt;
                li.style.backgroundColor = rgbHex;
                if (r + g + b < 383) {
                    li.style.color = "#FFF";
                }
                li.className = "color-name";
            }

            var br = document.createElement("br");
            termDiv.append(br);
        }



    }


}