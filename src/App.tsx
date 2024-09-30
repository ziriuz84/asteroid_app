// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.tsx"
import { Layout } from "./Layout.tsx";
import { Configuration } from "./pages/Configuration.tsx"
import { Language } from "./pages/Language.tsx"
import { Observatory } from "./pages/Observatory.tsx"
import { Scheduling } from "./pages/Scheduling.tsx";
import { WeatherForecast } from "./pages/WeatherForecast.tsx";
import "./App.css";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  //   const result = await invoke("get_weather_forecast");
  //   console.log(result)
  // }

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="configuration" >
            <Route index element={<Configuration />} />
            <Route path="language" element={<Language />} />
            <Route path="observatory" element={<Observatory />} />
          </Route>
          <Route path="scheduling" >
            <Route index element={<Scheduling />} />
            <Route path="weather_forecast" element={<WeatherForecast />} />
            <Route path="whatsup" element={<div>Whatsup</div>} />
            <Route path="neocp" element={<div>Neocp</div>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
