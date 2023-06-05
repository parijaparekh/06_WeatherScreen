# 06 Server-Side APIs: Weather Dashboard

## Description

 A weather dashboard is build using [OpenWeather One Call API](https://openweathermap.org/api/one-call-api) to retrieve weather data for cities.
 The application usese `localStorage` to store any persistent data(searched cities history).

## Features

```
A user can view see the weather outlook for multiple cities. 

WHEN the user searches for a city
THEN he is presented with current and future conditions for that city and that city is added to the search history for this user(in the client browser)
WHEN the user views the current weather conditions for that city
THEN he is presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN the user views the UV index
THEN he is presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN the user views future weather conditions for that city
THEN he is presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN he clicks on a city in the search history
THEN he is again presented with current and future conditions for that city
```
- - -
© 2022 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
