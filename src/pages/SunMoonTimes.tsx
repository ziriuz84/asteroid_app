import { BackMenu } from "../components/BackMenu";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type SunMoonTimesResponse = {
  results: SunMoonTimes;
  status: string;
  tzid: string;
};

type SunMoonTimes = {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: string;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
};

export const SunMoonTimes = () => {
  const [sunMoonTimes, setSunMoonTimes] = useState<SunMoonTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getSunMoonTimes = async (): Promise<void> => {
    await invoke("get_sun_times")
      .then((response) => JSON.parse(response as string))
      .then((response) => setSunMoonTimes(response.results));
  };

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        setIsLoading(true);
        await getSunMoonTimes();
      } catch (error) {
        console.error("Error fetching times:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimes();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading Sun Moon Times...</div>
      ) : sunMoonTimes ? (
        <div className="times">
          <div className="item">
            <div className="name">Sunrise</div>
            <div className="value">{sunMoonTimes.sunrise}</div>
          </div>
          <div className="item">
            <div className="name">Sunset</div>
            <div className="value">{sunMoonTimes.sunset}</div>
          </div>
          <div className="item">
            <div className="name">Solar noon</div>
            <div className="value">{sunMoonTimes.solar_noon}</div>
          </div>
          <div className="item">
            <div className="name">Day length</div>
            <div className="value">{sunMoonTimes.day_length}</div>
          </div>
          <div className="item">
            <div className="name">Civil twilight begin</div>
            <div className="value">{sunMoonTimes.civil_twilight_begin}</div>
          </div>
          <div className="item">
            <div className="name">Civil twilight end</div>
            <div className="value">{sunMoonTimes.civil_twilight_end}</div>
          </div>
          <div className="item">
            <div className="name">Nautical twilight begin</div>
            <div className="value">{sunMoonTimes.nautical_twilight_begin}</div>
          </div>
          <div className="item">
            <div className="name">Nautical twilight end</div>
            <div className="value">{sunMoonTimes.nautical_twilight_end}</div>
          </div>
          <div className="item">
            <div className="name">Astronomical twilight begin</div>
            <div className="value">
              {sunMoonTimes.astronomical_twilight_begin}
            </div>
          </div>
          <div className="item">
            <div className="name">Astronomical twilight end</div>
            <div className="value">
              {sunMoonTimes.astronomical_twilight_end}
            </div>
          </div>
        </div>
      ) : (
        <div>Error in loading Times</div>
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
