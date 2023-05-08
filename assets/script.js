var today = moment().format("dddd [|] LL");
console.log(today)
document.querySelector("#todays-date").textContent=today;

var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var activeCityNameEl = document.querySelector("#active-city");
var activeCityIconEl = document.querySelector("#active-city-icon");
var cardContainerEl = document.querySelector("#card-container");

            // GETTING DATA FROM LOCAL STORAGE

function getStoredCities(){
  //var weather_city = localStorage.getItem("weather_city");
    for (var j = 0; j < localStorage.length; j++) {
      var key = localStorage.key(j);
      //console.log(key);
      if (key.startsWith("weather_city_")){
        var storedCity = JSON.parse(window.localStorage.getItem(key));
        console.log(storedCity);

        var cityList = document.querySelector("#result-log");
        var storedBtn = document.createElement("button");
      
        storedBtn.classList.add("btn", "city-buttons", "btn-lg", "btn-block");
        storedBtn.textContent = storedCity.name + " - " + storedCity.state;
        cityList.appendChild(storedBtn);

        storedBtn.setAttribute("type", "button");
        storedBtn.setAttribute("lat", storedCity.lat);
        storedBtn.setAttribute("lon", storedCity.lon);
        
        // RESETTING THE LOCAL STORAGE
        var resetBtn = document.querySelector("#reset");
        resetBtn.classList.add("visible");
        resetBtn.addEventListener("click", function(event){
        event.preventDefault();  
        window.localStorage.clear();
        document.location.reload();
        })

        storedBtn.addEventListener("click", function(event){

          cardContainerEl.innerHTML = "";
          activeCityNameEl.textContent = "";
          activeCityIconEl.textContent = "";
          activeCityNameEl.textContent = this.textContent;

          var lat = event.target.getAttribute("lat");
          var lon = event.target.getAttribute("lon");

          searchOneCall(lat, lon);
        });
      }// end of if 
    }//end of for 
}
getStoredCities();


function formSubmitHandler(event) {
    event.preventDefault();

    var cityNameEntered = searchInputEl.value.trim();
        
    console.log(cityNameEntered);
    
    if (cityNameEntered) {
      searchGeocode(cityNameEntered);
      searchInputEl.value = "";
      activeCityNameEl.textContent = "";
      activeCityIconEl.textContent = "";
    } else {
      alert("Please enter a city name");
    }
};

searchFormEl.addEventListener('submit', formSubmitHandler);

            // SEARCHING GEOCODE API 

// Search for coordinates from Geocode example:
// "http://api.openweathermap.org/geo/1.0/direct?q=chapel+hill&limit=3&appid=26361e188cd235438e3f1a2b81fff3d0"

function searchGeocode(cityName) {
    var geocodeUrl = "https://api.openweathermap.org/geo/1.0/direct?&appid=26361e188cd235438e3f1a2b81fff3d0";
  
    if (cityName) {
      geocodeUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=2&appid=26361e188cd235438e3f1a2b81fff3d0";
    }
    
    console.log(geocodeUrl);
    
    fetch(geocodeUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
  
      .then(function (geocodeResult) {
        
        console.log(geocodeResult);
  
        if (!geocodeResult.length) {
            alert("No results found!");
        } else {
              for (var i = 0; i < geocodeResult.length; i++) {
              printCityNameResults(geocodeResult[i]);
            }
        }
      })
              
}

            // PRINTING THE RESULTS FROM GEOCODE


function printCityNameResults(resultObj) {
  console.log(resultObj);

  var cityList = document.querySelector("#result-log");
  var resultBtn = document.createElement("button");
   
  resultBtn.classList.add("btn", "btn-success", "btn-lg", "btn-block");
  resultBtn.value = resultObj.name;
  resultBtn.textContent = resultObj.name + " - " + resultObj.state;
  cityList.appendChild(resultBtn);
  
  resultBtn.setAttribute("type", "button");
  resultBtn.setAttribute("lat", resultObj.lat);
  resultBtn.setAttribute("lon", resultObj.lon);
  
  resultBtn.addEventListener("click", function(event){

    cardContainerEl.innerHTML = "";
    activeCityNameEl.textContent = "";
    activeCityIconEl.textContent = "";
    activeCityNameEl.textContent = resultObj.name + " - " + resultObj.state;
    
    var lat = event.target.getAttribute("lat");
    var lon = event.target.getAttribute("lon");
    searchOneCall(lat, lon);
    window.localStorage.setItem("weather_city_"+resultObj.name, JSON.stringify({
    name: resultObj.name,
    state: resultObj.state,
    lat: resultObj.lat,
    lon: resultObj.lon    
    }));
  });
  
}

// Search for weather and forecast from One Call API:
// "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=minutely,hourly&appid=26361e188cd235438e3f1a2b81fff3d0"

function searchOneCall(lat, lon) {
    console.log(lat);
    console.log(lon);
    var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?&appid=26361e188cd235438e3f1a2b81fff3d0";
  
    if (lat && lon) {
      oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=26361e188cd235438e3f1a2b81fff3d0";
    }
    console.log(oneCallUrl);
    
    fetch(oneCallUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })

    .then(function (oneCallResult) {
        console.log(oneCallResult);
        
        printForecastResults(oneCallResult);
    })
}

// PRINTING THE RESULTS FROM ONE CALL


function printForecastResults(resultObj) {
    console.log(resultObj);

    var heading = document.getElementById("subtitle");
    var temp = document.getElementById("temp");
    var humidity = document.getElementById("humidity");
    var windSpeed = document.getElementById("wind-speed");
    var uvIndex = document.getElementById("uv-index");
    var iconCurrent = document.getElementById("active-city-icon");

    var imageIconCurrent = document.createElement("img");
    var codeIconCurrent = resultObj.current.weather[0].icon;
    console.log(codeIconCurrent);
    imageIconCurrent.src = "https://openweathermap.org/img/wn/" + codeIconCurrent + "@2x.png";
    iconCurrent.appendChild(imageIconCurrent);

    heading.textContent = "5-day Forecast:";
    temp.textContent = "Temperature: " + resultObj.current.temp + " °F";
    humidity.textContent = "Humidity: " + resultObj.current.humidity + " %";
    windSpeed.textContent = "Wind speed: " + resultObj.current.wind_speed + " miles/hour";
    uvIndex.textContent = "UV Index: " + resultObj.current.uvi;
    
    function uvLevelColor(){
        var uviLevel = resultObj.current.uvi;
        uvIndex.classList.remove("green", "yellow", "orange", "red") 
        if (uviLevel<=2) {uvIndex.classList.add("green")
        } else if (uviLevel>2&&uviLevel<=5) {uvIndex.classList.add("yellow")
        } else if (uviLevel>5&&uviLevel<=7) {uvIndex.classList.add("orange")
        } else if (uviLevel>7&&uviLevel<=10) {uvIndex.classList.add("red")
        };
    }      
    uvLevelColor();


    for (var i = 1; i < 6; i++) {
        var dailyForecast = resultObj.daily[i];
        console.log(dailyForecast);
        function printDailyForecast(){
            var forecastCard = document.createElement("div");
            forecastCard.classList.add("card", "col-2");
            var cardTitle = document.createElement("h5");
            var rawDate = moment.unix(dailyForecast.dt);
            var forecastDate = moment(rawDate).format("ddd[ - ]MMM D");
            // moment().format("dddd [|] LL");
            
            cardTitle.textContent = forecastDate;
            forecastCard.appendChild(cardTitle);
            
            var cardUl = document.createElement("ul");
            cardUl.classList.add("list-group", "list-group-flush");

            forecastCard.appendChild(cardUl);
            cardContainerEl.appendChild(forecastCard);
            
            var cardLiIcon = document.createElement("li");
            console.log(cardLiIcon);
            cardLiIcon.classList.add("list-group-item", "icon-img");
            cardUl.appendChild(cardLiIcon);
            
            var imageIcon = document.createElement("img");
            var codeIcon = dailyForecast.weather[0].icon;
            console.log(codeIcon);
            imageIcon.src = "https://openweathermap.org/img/wn/" + codeIcon + "@2x.png";
            cardLiIcon.appendChild(imageIcon);


            var cardLiTemp = document.createElement("li");
            console.log(cardLiTemp);
            cardLiTemp.classList.add("list-group-item");
            cardUl.appendChild(cardLiTemp);
            cardLiTemp.textContent = "Temperature: " + dailyForecast.temp.day + "°F";

            var cardLiHumid = document.createElement("li");
            console.log(cardLiHumid);
            cardLiHumid.classList.add("list-group-item");
            cardUl.appendChild(cardLiHumid);
            cardLiHumid.textContent = "Humidity: " + dailyForecast.humidity + "%";
       
        };
        printDailyForecast()
    }

}