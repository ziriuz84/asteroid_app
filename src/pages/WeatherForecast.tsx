import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

//import {
//  createColumnHelper,
//  flexRender,
//  getCoreRowModel,
//  useReactTable,
//} from '@tanstack/react-table'
type ForecastResponse = {
  product: string;
  init: string;
  dataseries: Forecast[];
};
type ConvertedForecastResponse = {
  product: string;
  init: string;
  dataseries: ConvertedForecast[];
};

type Forecast = {
  timepoint: string;
  cloudcover: number;
  seeing: number;
  transparency: number;
  lifted_index: number;
  rh2m: number;
  wind10m: Wind;
  temp2m: number;
  prec_type: string;
};

type Dictionary = {
  [key: number | string]: string;
};

type Wind = {
  direction: string;
  speed: number;
};

type ConvertedWind = {
  direction: string;
  speed: string;
};

type ConvertedForecast = {
  timepoint: string;
  cloudcover: string;
  seeing: string;
  transparency: string;
  lifted_index: string;
  rh2m: string;
  wind10m: ConvertedWind;
  temp2m: number;
  prec_type: string;
};

export const WeatherForecast = () => {
  const [weather, setWeather] = useState<ConvertedForecastResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const cloudCoverDictionary: Dictionary = {
    1: "0%-6%",
    2: "6%-19%",
    3: "19%-31%",
    4: "31%-44%",
    5: "44%-56%",
    6: "56%-69%",
    7: "69%-81%",
    8: "81%-94%",
    9: "94%-100%",
  };

  const seeingDictionary: Dictionary = {
    1: '<0.5"',
    2: '0.5"-0.75"',
    3: '0.75"-1"',
    4: '1"-1.25"',
    5: '1.25"-1.5"',
    6: '1.5"-2"',
    7: '2"-2.5"',
    8: '>2.5"',
  };

  const transparencyDictionary: Dictionary = {
    1: "<0.3",
    2: "0.3-0.4",
    3: "0.4-0.5",
    4: "0.5-0.6",
    5: "0.6-0.7",
    6: "0.7-0.85",
    7: "0.85-1",
    8: ">1",
  };

  const liftedIndexDictionary: Dictionary = {
    "-10": "Below -7",
    "-6": "-7 - -5",
    "-4": "-5 - -3",
    "-1": "-3 - 0",
    "2": "0 - 4",
    "6": "4 - 8",
    "10": "8 - 11",
    "15": "Over 11",
  };

  const rh2mDictionary: Dictionary = {
    "-4": "0%-5%",
    "-3": "5%-10%",
    "-2": "10%-15%",
    "-1": "15%-20%",
    "0": "20%-25%",
    "1": "25%-30%",
    "2": "30%-35%",
    "3": "35%-40%",
    "4": "40%-45%",
    "5": "45%-50%",
    "6": "50%-55%",
    "7": "55%-60%",
    "8": "60%-65%",
    "9": "65%-70%",
    "10": "70%-75%",
    "11": "75%-80%",
    "12": "80%-85%",
    "13": "85%-90%",
    "14": "90%-95%",
    "15": "95%-99%",
    "16": "100%",
  };

  const wind10mDictionary: Dictionary = {
    1: "Below 0.3 m/s",
    2: "0.3-3.4 m/s",
    3: "3.4-8.0 m/s",
    4: "8.0-10.8 m/s",
    5: "10.8-17.2 m/s",
    6: "17.2-24.5 m/s",
    7: "24.5-32.6 m/s",
    8: "Over 32.6 m/s",
  };

  const getWeatherForecast = async () => {
    try {
      await invoke("get_weather_forecast").then((data: unknown) => {
        const response = JSON.parse(data as string) as ForecastResponse;
        const convertCloudCover = (value: number): string =>
          cloudCoverDictionary[value] || "Unknown";
        const convertSeeing = (value: number): string =>
          seeingDictionary[value] || "Unknown";
        const convertTransparency = (value: number): string =>
          transparencyDictionary[value] || "Unknown";
        const convertLiftedIndex = (value: number): string =>
          liftedIndexDictionary[value.toString()] || "Unknown";
        const convertRh2m = (value: number): string =>
          rh2mDictionary[value.toString()] || "Unknown";
        const convertWind10m = (value: number): string =>
          wind10mDictionary[value] || "Unknown";
        const convertedTime = (value: string): string => {
          const now = new Date();
          const futureTime = new Date(now);
          futureTime.setHours(now.getHours() + parseInt(value));
          return futureTime.toLocaleString();
        };

        const convertedData: ConvertedForecastResponse = {
          product: response.product,
          init: response.init,
          dataseries: response.dataseries.map((forecast: Forecast) => ({
            ...forecast,
            timepoint: convertedTime(forecast.timepoint),
            cloudcover: convertCloudCover(forecast.cloudcover),
            seeing: convertSeeing(forecast.seeing),
            transparency: convertTransparency(forecast.transparency),
            lifted_index: convertLiftedIndex(forecast.lifted_index),
            rh2m: convertRh2m(forecast.rh2m),
            wind10m: {
              direction: forecast.wind10m.direction,
              speed: convertWind10m(forecast.wind10m.speed),
            },
          })),
        };
        console.log(convertedData);
        setWeather(convertedData);
      });
    } catch (error) {
      console.error("Errore nel caricamento della previsione meteo:", error);
      // Gestire l'errore (ad esempio, mostrando un messaggio all'utente)
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        await getWeatherForecast();
      } catch (error) {
        console.error("Errore nel caricamento della previsione meteo:", error);
        // Gestire l'errore (ad esempio, mostrando un messaggio all'utente)
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading weather forecast...</div>
      ) : weather && weather.dataseries ? (
        <table className="weatherforecast">
          <thead>
            <tr>
              <th>Time</th>
              <th>Cloud Cover</th>
              <th>Seeing</th>
              <th>Transparency</th>
              <th>Lifted Index</th>
              <th>RH2m</th>
              <th>Wind</th>
              <th>Temp2m</th>
              <th>Prec Type</th>
            </tr>
          </thead>
          <tbody>
            {weather.dataseries.map((forecast: ConvertedForecast, index) => (
              <tr key={index}>
                <td>
                  <span className="label">Time</span>
                  {forecast.timepoint}
                </td>
                <td>
                  <span className="label">Cloud Cover</span>
                  {forecast.cloudcover}
                </td>
                <td>
                  <span className="label">Seeing</span>
                  {forecast.seeing}
                </td>
                <td>
                  <span className="label">Transparency</span>
                  {forecast.transparency}
                </td>
                <td>
                  <span className="label">Lifted Index</span>
                  {forecast.lifted_index}
                </td>
                <td>
                  <span className="label">RH2m</span>
                  {forecast.rh2m}
                </td>
                <td>
                  <span className="label">Wind</span>
                  {forecast.wind10m.speed} {forecast.wind10m.direction}
                </td>
                <td>
                  <span className="label">Temp2m</span>
                  {forecast.temp2m}
                </td>
                <td>
                  <span className="label">Prec Type</span>
                  {forecast.prec_type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No weather data available</div>
      )}
      <nav>
        <ul>
          <li>
            <Link to="/scheduling">Back</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
