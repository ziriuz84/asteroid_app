import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

type WeatherForecast = {
}


export const WeatherForecast = () => {

  [weather, setWeather] = useState({})

  const getWeatherForecast = async () => {
    const data = await invoke("get_weather_forecast");
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
