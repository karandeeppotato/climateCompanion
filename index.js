import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import expressIp from "express-ip";

const app = express();
const port = 3000;
const API_URL_FORECAST =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric";
const API_URL_CURRENT =
  "https://api.openweathermap.org/data/2.5/weather?units=metric";
const API_KEY = "0773f06d983e61482c094fb56f2cc21a";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressIp().getIpInfoMiddleware);

var currentDate = new Date();

function isTimeBetween7AMand6AM(currentTime) {
  let currentHour = currentTime.getHours();
  if(currentHour >= 7 && currentHour < 18) {
    return true;
  } else {
    return false;
  }
}

app.get("/", async (req, res) => {
  try {
    const latitude = req.ipInfo ? req.ipInfo.ll[0] : null;
    const longitude = req.ipInfo ? req.ipInfo.ll[1] : null;

    if (!latitude || !longitude) {
      throw new Error("Unable to determine location from IP address.");
    }

    console.log("Latitude:", latitude, "Longitude:", longitude);

    const response_fr = await axios.get(
      API_URL_FORECAST + `&lat=${latitude}&lon=${longitude}&appid=` + API_KEY
    );
    const forecast = response_fr.data;
    const response_curr = await axios.get(
      API_URL_CURRENT + `&lat=${latitude}&lon=${longitude}&appid=` + API_KEY
    );
    const currData = response_curr.data;

    const content = {
      // CURRENT DATA
      currentTemperature: Math.floor(currData.main.temp),
      currentCity: currData.name,
      currentCountry: currData.sys.country,
      currentHumidity: currData.main.humidity,
      currentFeelsLike: Math.floor(currData.main.feels_like),
      currentMinTemp: Math.floor(currData.main.temp_min),
      currentMaxTemp: Math.floor(currData.main.temp_max),
      currentDescription: currData.weather[0].description,
      currentDescriptionId: currData.weather[0].id,
      currentPressure: currData.main.pressure,
      currentVisibility: currData.visibility,
      currentWindSpeed: currData.wind.speed,
      currentSunrise: currData.sys.sunrise,
      currentSunset: currData.sys.sunset,
      isBetween7to6: isTimeBetween7AMand6AM(currentDate),

      // TIMELINE AND FORECAST
      tl: forecast.list,
    };
    res.render("index.ejs", content);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/search", async (req, res) => {
  try {
    // console.log(req.body["searchBar"]);
    const searchItem = req.body["searchBar"];
    const response_fr = await axios.get(
      API_URL_FORECAST + `&q=${searchItem}&appid=` + API_KEY
    );
    const forecast = response_fr.data;
    const response_curr = await axios.get(
      API_URL_CURRENT + `&q=${searchItem}&appid=` + API_KEY
    );
    const currData = response_curr.data;
    const content = {
      // CURRENT DATA
      currentTemperature: Math.floor(currData.main.temp),
      currentCity: currData.name,
      currentCountry: currData.sys.country,
      currentHumidity: currData.main.humidity,
      currentFeelsLike: Math.floor(currData.main.feels_like),
      currentMinTemp: Math.floor(currData.main.temp_min),
      currentMaxTemp: Math.floor(currData.main.temp_max),
      currentDescription: currData.weather[0].description,
      currentDescriptionId: currData.weather[0].id,
      currentPressure: currData.main.pressure,
      currentVisibility: currData.visibility,
      currentWindSpeed: currData.wind.speed,
      currentSunrise: currData.sys.sunrise,
      currentSunset: currData.sys.sunset,
      isBetween7to6: isTimeBetween7AMand6AM(currentDate),

      // TIMELINE AND FORECAST
      tl: forecast.list,
      
    };
    res.render("index.ejs", content);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
