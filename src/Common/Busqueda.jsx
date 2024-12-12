// HomePage/Components/HomePage.js
import React from 'react';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import {useEffect,useState} from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from '../SessionProvider';
import MapComponent from '../maps/MapComponent'
import apiEndpoint from '../../apiEndpoint.json'

const Busqueda = () => {

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const { isLoggedIn } = useSession();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const nombre = queryParams.get('nombre');
  const organizador = queryParams.get('organizador');
  const lat = queryParams.get('lat');
  const lon = queryParams.get('lon');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classnameEditar = "bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600 transition duration-200";
  const classnameBorrar = "bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 transition duration-200";

  const handleDeleteEvent = async(id) =>{    
    try {
      let URL = `${apiEndpoint.api}/eventos/` + id;
      const response = await axios.delete(URL);
      await fetchData();
    } catch (err) {
      setError("Error al borrar los datos.");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateEvent = (data) => {
    navigate('/update', { state: { data } });
  };

  const fetchData = async () => {
    try {
      // Base URL
      let URL = `${apiEndpoint.api}/eventos`;
  
      // Añadir los parámetros si existen
      const params = new URLSearchParams();
  
      if (nombre) {
        params.append('nombre', nombre);
      }
      if (lat) {
        params.append('lat', lat);
      }
      if (lon) {
        params.append('lon', lon);
      }
  
      // Si hay parámetros, los añades a la URL
      if (params.toString()) {
        URL += `?${params.toString()}`;
      }
  
      console.log(URL);
  
      // Realizar la solicitud con la URL final
      const response = await axios.get(URL);
      setData(response.data);
    } catch (err) {
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
  if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

  const coordinates = data ? data.map(d => ({ lat: d.lat, lon: d.lon , nombre: d.nombre})) : [];

  return (
    <div className='h-min-screen p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white'>
        <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
        <h1 className="pt-4 text-3xl font-bold mb-2">Eventos</h1>
        {data && data.map((d, index) => (
          <div key={index}>
            <div className='p-4 border-2 my-2 rounded border-gray-200'>
              <div className='flex flex-col w-full w-1/2 m-2'>
                <span><strong>Nombre:</strong> {d.nombre}</span>
                <span><strong>Timestamp:</strong> {d.timestamp}</span>
                <span><strong>Organizador:</strong> {d.organizador}</span>
                <span><strong>Latitud:</strong> {d.lat}</span>
                <span><strong>Longitud:</strong> {d.lon}</span>
                <span><strong>Lugar:</strong> {d.lugar}</span>
                <span className='break-words' ><strong>Imagen:</strong> {d.imagen}</span>
                <div>
                  {isLoggedIn &&
                    (
                      <div className='flex gap-2 mt-2'>
                          <button className={classnameEditar} onClick={() => handleUpdateEvent(d)} >Editar</button>
                          <button className={classnameBorrar} onClick={() => handleDeleteEvent(d._id)}>Borrar</button>
                      </div>
                    )
                  }
                </div> 
              </div>
            </div>
          </div>
        ))}
        <MapComponent coordinates={coordinates}/>
    </div>
  );
};

export default Busqueda;
