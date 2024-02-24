import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import geolocation from "geolocation";
import geoip from "geoip-lite";

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "0773f06d983e61482c094fb56f2cc21a";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    try{
        const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?q=New%20Delhi,%20IN&appid=0773f06d983e61482c094fb56f2cc21a&units=metric");
        const result = response.data;
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
    
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
