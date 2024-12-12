import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import {fetchCoordinates} from '../maps/CoordSearch'

const SearchBar = () => {
  const [formState, setFormState] = useState({
    direccion: "",
    organizador: "",
    nombre: "",
  });

  const navigate = useNavigate();

  const search = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (formState.direccion.trim()) {
      const coords = await fetchCoordinates(formState.direccion);
      if (coords) {
        params.append("lat", parseFloat(coords.lat));
        params.append("lon", parseFloat(coords.lon));
      }
    }
    navigate(`/eventos?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={search} className='flex gap-3 justify-center'>
      <div className='flex flex-col'>
        <label className="font-bold">Lugar del evento</label>
        <input
          type="text"
          name='direccion'
          value={formState.direccion}
          onChange={handleInputChange}
          className='border rounded px-4 py-2  mr-3 bg-gray-300'
        />
        <button type='submit' className="bg-blue-500 text-white w-fit mt-4 px-4 py-2 rounded hover:bg-blue-600 transition"> Buscar </button>
      </div>
    </form>
  );
};

export default SearchBar;