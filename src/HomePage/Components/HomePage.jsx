import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";
import SearchBar from '../../Common/SearchBar';
import LogViewer from '../../Common/Log/LogViewer';

import Cookies from 'universal-cookie';
import { useSession } from '../../SessionProvider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GoogleLog from '../../Common/Log/GoogleLog';
import MapComponent from '../../maps/MapComponent';
import axios from 'axios';
import apiEndpoint from '../../../apiEndpoint.json';

const cookies = new Cookies();

function HomePage() {
  const [showLogViewer, setShowLogViewer] = useState(false);
  const { isLoggedIn } = useSession();
  const [data, setData] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  const toggleLogViewer = () => {
    setShowLogViewer(prevState => !prevState);
  };

  const obtenerMarcadores = async (e) => {
    try {
      const response = await axios.get(e);
      console.log(e);
      setData(response.data);
      setCoordinates(response.data ? response.data.map(d => ({
        lat: d.lat, 
        lon: d.lon, 
        nombre: d.lugar, 
        imagen: d.imagen
      })) : []);
    } catch (error) {
      console.error("Error al obtener los marcadores:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const email = cookies.get('email');
      if (email) {
        const url = `${apiEndpoint.api}eventos/?email=${email}`;
        obtenerMarcadores(url);
      } else {
        console.error("No se encontró el email en las cookies");
      }
    }
  }, [isLoggedIn]);

  return (
    <div id='homeScreen' className='h-screen flex flex-col justify-between items-center'>
      <div className='flex flex-col justify-center items-center flex-grow gap-y-7'>
        <h1 id='titulo' className='text-center text-6xl font-sans font-bold italic tracking-wide'>
          MiMapa
        </h1>
        {!isLoggedIn && (
          <h2 className='text-center text-2xl max-w-2xl mx-auto font-medium'>
            Inicie sesión para continuar
          </h2>
        )}
        {isLoggedIn && (<div className='flex flex-row'> <SearchBar />     
        <Link
            className='flex flex-col text-center w-16 h-16 m-4 items-center justify-center'
            to={`/create`}
          >
            <h2>Nuevo marcador</h2>
            <AddCircleIcon style={{ width: '100%', height: '100%' }} fontSize="large" color='primary' />
          </Link></div>
        )}
      </div>

      {isLoggedIn && (
        <>
          <MapComponent coordinates={coordinates} />

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
        </>
      )}
    </div>
  );
}

export default HomePage;
