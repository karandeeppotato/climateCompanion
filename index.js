import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config';

const app = express();
const port = 3000;
const API_URL_FORECAST =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric";
const API_URL_CURRENT =
  "https://api.openweathermap.org/data/2.5/weather?units=metric";
const API_KEY = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const response_fr = await axios.get(
      API_URL_FORECAST + `&q=New%20Delhi,IN&appid=` + API_KEY
    );
    const forecast = response_fr.data;
    const response_curr = await axios.get(
      API_URL_CURRENT + `&q=New%20Delhi,IN&appid=` + API_KEY
    );
    const currData = response_curr.data;

    const content = {
      // CURRENT DATA
      currentTemperature: Math.floor(currData.main.temp),
      currentCity: currData.name,
      currentCountry: currData.sys.country,
      currentHumidity: currData.main.humidity,
      currentFeelsLike: Math.floor(currData.main.feels_like),
      currentMinTemp: currData.main.temp_min.toFixed(1),
      currentMaxTemp: currData.main.temp_max.toFixed(1),
      currentDescription: currData.weather[0].description,
      currentDescriptionId: currData.weather[0].id,
      currentPressure: currData.main.pressure,
      currentVisibility: currData.visibility,
      currentWindSpeed: currData.wind.speed,
      currentSunrise: new Date((currData.sys.sunrise) * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      currentSunset: new Date((currData.sys.sunset) * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isMorning: true,

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
    const currData2 = response_curr.data;
    
    const content = {
      // CURRENT DATA
      currentTemperature: Math.floor(currData2.main.temp),
      currentCity: currData2.name,
      currentCountry: currData2.sys.country,
      currentHumidity: currData2.main.humidity,
      currentFeelsLike: Math.floor(currData2.main.feels_like),
      currentMinTemp: Math.floor(currData2.main.temp_min),
      currentMaxTemp: Math.floor(currData2.main.temp_max),
      currentDescription: currData2.weather[0].description,
      currentDescriptionId: currData2.weather[0].id,
      currentPressure: currData2.main.pressure,
      currentVisibility: currData2.visibility,
      currentWindSpeed: currData2.wind.speed,
      currentSunrise: new Date((currData2.sys.sunrise) * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      currentSunset: new Date((currData2.sys.sunset) * 1000).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isMorning: true,

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
