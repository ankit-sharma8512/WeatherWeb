const changeWidth = 850; // swapping size in px between stylesheets for big and small displays
const menuToggleSpeed = 150; // speed of menu changing
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
let lastTimeoutID=-1;

$(function () {
    let currState = $(window).width() >= changeWidth ? 0 : 1;
    changeLocation("Kolkata");

    $("#firstSearchRes").text("Delhi");
    $("#secondSearchRes").text("Chennai");
    $("#thirdSearchRes").text("Mumbai");

    $(window).resize(function () {
        if ($(window).width() >= changeWidth && currState == 1) {
            $(".leftCard").show();
            $(".rightCard").show();
            currState = 0;
        }
        else if ($(window).width() < changeWidth && currState == 0) {
            $(".leftCard").show();
            $(".rightCard").hide();
            currState = 1;
        }
    });

    $(".menu").click(function () {
        $(".leftCard").toggle(menuToggleSpeed);
        $(".rightCard").toggle(menuToggleSpeed);
    });

    $("#searchBar").keypress(function (e) {
        if (e.which == 13) {
            changeLocation($("#searchBar").val());
        }
    });

    function changeLocation(location)
    {
        if(lastTimeoutID!=-1)
            clearTimeout(lastTimeoutID);
        getData(location)
                .then((data) => {
                    if (data.cod != 200)
                        $("#firstSearchRes").text("City Not Found");
                    else {
                        if ($("#firstSearchRes").text() == "City Not Found" || $("#firstSearchRes").text() == "Error Occured")
                            $("#firstSearchRes").text(data.name);
                        else if($("#firstSearchRes").text() != data.name) {
                            $("#fourthSearchRes").text($("#thirdSearchRes").text());
                            $("#thirdSearchRes").text($("#secondSearchRes").text());
                            $("#secondSearchRes").text($("#firstSearchRes").text());
                            $("#firstSearchRes").text(data.name);
                        }
                        setData(data);
                        lastTimeoutID =  setTimeout(()=>{
                            changeLocation(location);
                        },300000);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    $("#firstSearchRes").text("Error Occured");
                });
    }

    function setData(data) {
        if(data.weather[0].main == "Clear")
        {
            if(data.weather[0].icon[2]=="d")
                $("#background").css("background-image","url(/images/Cleard.jpg)");
            else
            $("#background").css("background-image","url(/images/Clearn.jpg)");
        }
        else
            $("#background").css("background-image",`url(/images/${data.weather[0].main}.jpg)`);

        $("#currTemp").text(Math.round(Number(data.main.temp)).toString());
        $("#placeText").text(data.name);

        const date = new Date();
        let localTime = date.getTime();
        let localOffset = date.getTimezoneOffset() * 60000;
        let utcTime = localTime + localOffset;
        let destUtcOffset = Math.round(Number(data.timezone)) * 1000 + utcTime;
        const destDate = new Date(destUtcOffset);
        let hr = destDate.getHours() <= 9 ? `0${destDate.getHours()}` : `${destDate.getHours()}`
        let mi = destDate.getMinutes() <= 9 ? `0${destDate.getMinutes()}` : `${destDate.getMinutes()}`
        const dateText = `${hr}:${mi} - ${days[destDate.getDay()]}, ${destDate.getDate()} ${month[destDate.getMonth()]} '${destDate.getFullYear().toString().substring(2)}`;
        $("#timeText").text(dateText);
        $("#currMaxTemp").text(Math.round(Number(data.main.temp_max)).toString());
        $("#currMinTemp").text(Math.round(Number(data.main.temp_min)).toString());
        $("#windSpeed").text(Math.round(Number(data.wind.speed)).toString());
        $("#humidity").text(Math.round(Number(data.main.humidity)).toString());
        $("#wdesc").text(data.weather[0].main);

        const sunriseDate = new Date(data.sys.sunrise * 1000);
        let hr1 = sunriseDate.getHours() <= 9 ? `0${sunriseDate.getHours()}` : `${sunriseDate.getHours()}`
        let mi1 = sunriseDate.getMinutes() <= 9 ? `0${sunriseDate.getMinutes()}` : `${sunriseDate.getMinutes()}`
        $("#sunRise").text(`${hr1}:${mi1}`);

        const sunsetDate = new Date(data.sys.sunset * 1000);
        let hr2 = sunsetDate.getHours() <= 9 ? `0${sunsetDate.getHours()}` : `${sunsetDate.getHours()}`
        let mi2 = sunsetDate.getMinutes() <= 9 ? `0${sunsetDate.getMinutes()}` : `${sunsetDate.getMinutes()}`
        $("#sunSet").text(`${hr2}:${mi2}`);

        $("#infoLogo").attr("src",`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    }

    $(".searchRes").click(function (e) {
        e.preventDefault();
        const location = $(this).text();
        if (location != "City Not Found" && location != "Error Occured") {
            getData(location)
                .then((data) => {
                    if (data.cod != 200)
                        $(this).text("Error Occured");
                    else {
                        setData(data);
                    }
                })
                .catch((err) => {
                    $(this).text("Error Occured");
                });
        }
    });
});