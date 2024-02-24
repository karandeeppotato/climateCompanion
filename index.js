import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import geolocation from "geolocation";
import geoip from "geoip-lite";

const app = express();
const port = 3000;
const API_URL = "api.openweathermap.org/data/2.5/forecast";
const API_KEY = "0773f06d983e61482c094fb56f2cc21a";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  try {
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const location = geolocateUser(iphard);
    console.log(location.ll[0] + " " + location.ll[1]);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function geolocateUser(ip) {
  const geo = geoip.lookup(ip);
  return geo;
}
