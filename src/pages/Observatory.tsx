import { BackMenu } from "../components/BackMenu";
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

type Observatory = {
  place: string;
  latitude: number;
  longitude: number;
  altitude: number;
  observatory_name: string;
  observer_name: string;
  mpc_code: string;
  north_altitude: number;
  east_altitude: number;
  south_altitude: number;
  west_altitude: number;
};

type FormState = Partial<Observatory>;

export const Observatory = () => {
  const [formState, setFormState] = useState<FormState>({});

  const getObservatory = async () => {
    const result: { observatory: Observatory } = await invoke('get_settings');
    setFormState(result.observatory);
  };

  useEffect(() => {
    getObservatory();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numericFields = ['latitude', 'longitude', 'altitude', 'north_altitude', 'south_altitude', 'west_altitude', 'east_altitude'];
    setFormState(prevState => ({ ...prevState, [name]: numericFields.includes(name) ? parseFloat(value) : value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted:', formState);
    invoke('set_settings', { settings: { observatory: formState, general: { lang: 'en' } } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        {Object.entries(formState).map(([key, value]) => (
          <div key={key} className="element">
            <label htmlFor={key}>{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={value || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <button className="button" type="submit">Save</button>
      </form>
      <BackMenu backto="/configuration" />
    </div>
  );
};
