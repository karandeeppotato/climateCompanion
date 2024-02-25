import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

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

app.get("/", (res, req) => {
  req.redirect("/weather");
});

app.get("/weather", async (req, res) => {
  try {
    const response_fr = await axios.get(
      API_URL_FORECAST + "&q=New%20Delhi,%20IN&appid=" + API_KEY
    );
    const forecast = response_fr.data;
    const response_curr = await axios.get(
      API_URL_CURRENT + "&q=New%20Delhi,%20IN&appid=" + API_KEY
    );
    const currData = response_curr.data;
    // console.log(currData);
    const content = {
      // CURRENT DATA
      currentTemperature: currData.main.temp,
      currentCity: currData.name,
      currentCountry: currData.sys.country,
      currentHumidity: currData.main.humidity,
      currentFeelsLike: currData.main.feels_like,
      currentMinTemp: currData.main.temp_min,
      currentMaxTemp: currData.main.temp_max,
      currentDescription: currData.weather[0].description,
      currentDescriptionId: currData.weather[0].id,
      currentPressure: currData.main.pressure,
      currentVisibility: currData.visibility,
      currentWindSpeed: currData.wind.speed,
      currentSunrise: currData.sys.sunrise,
      currentSunset: currData.sys.sunset,

      // TIMELINE
      time_tl: forecast.list,
      weather_tl: forecast.list,
      temp_tl: forecast.list,
    };
    res.render("index.ejs", content);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
