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

    if (formState.email.trim()) {
      navigate(`/eventos?${formState.email}`);
    }
    
  };

  const postLog = async() => {
    const payload = {
        timestamp: new Date(now.getTime()),
        email: profile.email,
        caducidad: new Date(now.getTime() + user.expires_in * 1000),
        token: user.access_token,
    };

    try {
        const response = await axios.post(apiEnpoint.api+'logs/', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error("Error posting data:", error);
      } finally {
        cookies.set('email', profile.email, { path: '/' });
      }
}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={search} className='flex gap-3 justify-center'>
      <div className='flex flex-col'>
        <label className="font-bold">Marcadores de otro usuario</label>
        <input
          type="text"
          name='email'
          value={formState.email}
          onChange={handleInputChange}
          className='border rounded px-4 py-2  mr-3 bg-gray-300'
        />
        <button type='submit' className="bg-blue-500 text-white w-fit mt-4 px-4 py-2 rounded hover:bg-blue-600 transition"> Buscar </button>
      </div>
    </form>
  );
};

export default SearchBar;