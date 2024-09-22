import { BackMenu } from "../components/BackMenu";
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

type Observatory = {
  place: string;
  latitude: number;
  longitude: number;
  altitude: number;
  observatory_name: string;
  observer_name: string;
  mpc_code: string;
  north_altitude: string;
  east_altitude: string;
  south_altitude: string;
  west_altitude: string;
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
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted:', formState);
    // Qui puoi aggiungere la logica per salvare i dati
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