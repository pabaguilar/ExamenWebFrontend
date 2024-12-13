// HomePage/Components/HomePage.js
import React from 'react';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import {useEffect,useState} from 'react';

import Cookies from 'universal-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from '../SessionProvider';
import MapComponent from '../maps/MapComponent'
import apiEndpoint from '../../apiEndpoint.json'
import LogViewer from './Log/LogViewer';

const cookies = new Cookies();
const now = new Date(); 

const Busqueda = () => {

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const { isLoggedIn, emailVisitante, token } = useSession();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get('email');


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const postLog = async() => {
    const payload = {
        timestamp: new Date(now.getTime()),
        email: emailVisitante,
        token: token,
    };

    try {
        const response = await axios.post(apiEndpoint.api+'logs/', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error("Error posting data:", error);
      }
}


  const fetchData = async () => {
    try {
      // Base URL
      let URL = `${apiEndpoint.api}eventos/`;

  
      // Añadir los parámetros si existen
      const params = new URLSearchParams();
  
      if (email) {
        params.append('email', email);
      }

  
      // Si hay parámetros, los añades a la URL
      if (params.toString()) {
        URL += `?${params.toString()}`;
      }
  
      console.log(URL);
  
      // Realizar la solicitud con la URL final
      const response = await axios.get(URL);
      setData(response.data);

      postLog()
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

  const coordinates = data ? data.map(d => ({ lat: d.lat, lon: d.lon , nombre: d.lugar, imagen: d.imagen})) : [];

  return (
    <div className='h-min-screen p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white'>
      <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
      <h1 className="pt-4 text-3xl font-bold mb-2">Marcadores</h1>
        {data && data.map((d, index) => (
          <div key={index}>
            <div className='p-4 border-2 my-2 rounded border-gray-200'>
              <div className='flex flex-col w-full w-1/2 m-2'>
                <span><strong>Timestamp:</strong> {d.timestamp}</span>
                <span><strong>Email:</strong> {d.email}</span>
                <span><strong>Latitud:</strong> {d.lat}</span>
                <span><strong>Longitud:</strong> {d.lon}</span>
                <span><strong>Lugar:</strong> {d.lugar}</span>
                <span className='break-words' ><strong>Imagen:</strong> {d.imagen}</span>
              </div>
            </div>
          </div>
        ))}
      <h2 className="text-lg font-bold mb-4">Observa la localización de los marcadores:</h2>
      <MapComponent coordinates={coordinates}/>
      <h2 className='text-lg font-bold mt-4'>Observa imágenes de los marcadores:</h2>
      <div className="image-gallery flex flex-wrap justify-center gap-4 mt-8">
            {coordinates.map((d, index) => (
              <a
                key={index}
                href={d.imagen}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={d.imagen}
                  alt={`Imagen de ${d.nombre}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
          <h2 className='text-lg font-bold mt-4'>Historial de visitas:</h2>
          <LogViewer email={cookies.get("email")} />
    </div>
  );
};

export default Busqueda;
