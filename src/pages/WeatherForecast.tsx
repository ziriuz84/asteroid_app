import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
type ForecastResponse = {
  product: string,
  init: string,
  dataseries: Forecast[]
}

type Forecast = {
  timepoint: number,
  cloudcover: number,
  seeing: number,
  transparency: number,
  lifted_index: number,
  rh2m: number,
  wind10m: Wind,
  temp2m: number,
  prec_type: string
}

type Dictionary = {
  [key: number]: string
}

type Wind = {
  direction: string,
  speed: number
}


export const WeatherForecast = () => {

  const [weather, setWeather] = useState({})

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
  }

  const seeingDictionary: Dictionary = {
    1: "<0.5\"",
    2: "0.5\"-0.75\"",
    3: "0.75\"-1\"",
    4: "1\"-1.25\"",
    5: "1.25\"-1.5\"",
    6: "1.5\"-2\"",
    7: "2\"-2.5\"",
    8: ">2.5\"",
  }

  const transparencyDictionary: Dictionary = {
    1: "<0.3",
    2: "0.3-0.4",
    3: "0.4-0.5",
    4: "0.5-0.6",
    5: "0.6-0.7",
    6: "0.7-0.85",
    7: "0.85-1",
    8: ">1",
  }

  const liftedIndexDictionary: Dictionary = {
    "-10": "Below -7",
    "-6": "-7 - -5",
    "-4": "-5 - -3",
    "-1": "-3 - 0",
    "2": "0 - 4",
    "6": "4 - 8",
    "10": "8 - 11",
    "15": "Over 11",
  }

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
  }

  const wind10mDictionary: Dictionary = {
    1: "Below 0.3 m/s",
    2: "0.3-3.4 m/s",
    3: "3.4-8.0 m/s",
    4: "8.0-10.8 m/s",
    5: "10.8-17.2 m/s",
    6: "17.2-24.5 m/s",
    7: "24.5-32.6 m/s",
    8: "Over 32.6 m/s",
  }

  const getWeatherForecast = async () => {
    const data: ForecastResponse = await invoke("get_weather_forecast");
    console.log(data)
  }

  useEffect(() => {
    getWeatherForecast()
  }, [])

  return (
    <div>
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
  )
}
