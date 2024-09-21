// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.tsx"
import { Layout } from "./Layout.tsx";
import { Configuration } from "./pages/Configuration.tsx"
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
          <Route path="configuration" element={<Configuration />} >
            <Route path="language" element={<div>language</div>} />
            <Route path="observatory" element={<div>observatory</div>} />
          </Route>
          <Route path="scheduling" element={<div>Scheduling</div>} >
            <Route path="weather_forecast" element={<div>Weather Forecast</div>} />
            <Route path="whatsup" element={<div>Whatsup</div>} />
            <Route path="neocp" element={<div>Neocp</div>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
