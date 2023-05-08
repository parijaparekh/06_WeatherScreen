var today = moment().format("dddd [|] LL");
console.log(today)
document.querySelector("#todays-date").textContent=today;

var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var activeCityNameEl = document.querySelector("#active-city");
var activeCityIconEl = document.querySelector("#active-city-icon");
var cardContainerEl = document.querySelector("#card-container");
// var cardArray = document.getElementsByClassName("card");
// console.log(cardArray);
// var x .splice(5, 1)?????;

            // GETTING DATA FROM LOCAL STORAGE

function getStoredCities(){
    for (var j = 0; j < localStorage.length; j++) {
      var key = localStorage.key(j);
      console.log(key);
      var storedCity = JSON.parse(window.localStorage.getItem(key));
      console.log(storedCity);

      var cityList = document.querySelector("#result-log");
      var storedBtn = document.createElement("button");
      
      storedBtn.classList.add("btn", "btn-secondary", "btn-lg", "btn-block");
      storedBtn.textContent = storedCity.name + " - " + storedCity.state;
      cityList.appendChild(storedBtn);

      storedBtn.setAttribute("type", "button");
      storedBtn.setAttribute("lat", storedCity.lat);
      storedBtn.setAttribute("lon", storedCity.lon);
      
      storedBtn.addEventListener("click", function(event){

        cardContainerEl.innerHTML = "";
        activeCityNameEl.textContent = "";
        activeCityIconEl.textContent = "";
        activeCityNameEl.textContent = this.textContent;

        var lat = event.target.getAttribute("lat");
        var lon = event.target.getAttribute("lon");

        searchOneCall(lat, lon);
      });
    }
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
    var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?&appid=26361e188cd235438e3f1a2b81fff3d0";
  
    if (cityName) {
      geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=2&appid=26361e188cd235438e3f1a2b81fff3d0";
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
            // resultContentEl.textContent = '';
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
    window.localStorage.setItem(resultObj.name, JSON.stringify({
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
    var oneCallUrl = "http://api.openweathermap.org/data/2.5/onecall?&appid=26361e188cd235438e3f1a2b81fff3d0";
  
    if (lat && lon) {
      oneCallUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=26361e188cd235438e3f1a2b81fff3d0";
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

    // resultBtn.classList.add("btn", "btn-success", "btn-lg", "btn-block");
    var temp = document.getElementById("temp");
    var humidity = document.getElementById("humidity");
    var windSpeed = document.getElementById("wind-speed");
    var uvIndex = document.getElementById("uv-index");

    temp.textContent = "Temperature: " + resultObj.current.temp + "°F";
    humidity.textContent = "Humidity: " + resultObj.current.humidity + "%";
    windSpeed.textContent = "Wind speed: " + resultObj.current.wind_speed + "miles/hour";
    uvIndex.textContent = "UV Index: " + resultObj.current.uvi;
    

    for (var i = 1; i < 6; i++) {
        var dailyForecast = resultObj.daily[i];
        function printDailyForecast(){
            var forecastCard = document.createElement("div");
            forecastCard.classList.add("card", "col-2");
            var cardTitle = document.createElement("h5");
            var rawDate = moment.unix(dailyForecast.dt);
            var forecastDate = moment(rawDate).format("dddd [|] LL");

            cardTitle.textContent = forecastDate;
            forecastCard.appendChild(cardTitle);
            
            var cardUl = document.createElement("ul");
            cardUl.classList.add("list-group", "list-group-flush");

            forecastCard.appendChild(cardUl);
            
// cardArray = ["icon", "temp", "humidity"] 
            // for (var j = 0; j < cardArray.length; j++) {
                

            for (var j = 0; j < 3; j++) {
                var cardLi = document.createElement("li");
                console.log(cardLi);
                cardLi.dataset.number = [j];
                cardLi.classList.add("list-group-item");
                cardUl.appendChild(cardLi);
            }    
            
// var w = document.querySelectorAll('[data-number="1"]');
            // console.log(w);
            // var ww = Array.from(w);
            // console.log(ww);
            // for (var k = 0; k < ww.length; k++) {
            //     ww[k].textContent = "Temperature: " + dailyForecast.temp.day + "°F";
            // };


            var x = document.querySelectorAll('[data-number="0"]');
            console.log(x);
            x.innerHTML = "hello"
            
            var y = document.querySelectorAll('[data-number="1"]');
            y.innerHTML = "Temperature: " + dailyForecast.temp.day + "°F";
            
            var z = document.querySelectorAll('[data-number="2"]');
            z.innerHTML = "Humidity: " + dailyForecast.humidity + "%";
            
            cardContainerEl.appendChild(forecastCard);
        };
        printDailyForecast()
    }

//     var cityList = document.querySelector("#result-log");
//   var resultBtn = document.createElement("button");
   
//   resultBtn.classList.add("btn", "btn-success", "btn-lg", "btn-block");
//   resultBtn.value = resultObj.name;
//   resultBtn.textContent = resultObj.name + " - " + resultObj.state;
//   cityList.appendChild(resultBtn);
  
//   resultBtn.setAttribute("type", "button");
//   resultBtn.setAttribute("lat", resultObj.lat);
//   resultBtn.setAttribute("lon", resultObj.lon);



  }