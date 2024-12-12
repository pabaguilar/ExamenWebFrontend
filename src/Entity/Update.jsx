import axios from 'axios'
import Navbar from '../Common/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import {useEffect,useState} from 'react';
import MapComponent from '../maps/MapComponent';
import apiEndpoint from '../../apiEndpoint.json'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import UploadFile from '../Common/UploadFile'
import {fetchCoordinates} from '../maps/CoordSearch'
import { FormatShapes } from '@mui/icons-material';

function Update(){

    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data;

    const handleBack = () => {
        navigate(-1);
    };

    const [formState, setFormState] = useState({
        nombre: data?.nombre || "",
        lat: data?.lat || 0.0,
        lon: data?.lon || 0.0,
        organizador: data?.organizador || "",
        imagen: data?.imagen || "",
        lugar: data?.lugar || "",
        timestamp: data?.timestamp || ""
    });

    
    const handleEventSubmit = async (e) => {
    e.preventDefault();

    const coords = await fetchCoordinates(formState.lugar);
      if (coords) {
        formState.lat = coords.lat;
        formState.lon = coords.lon;
    }

    const updatedVersion = {
        nombre: formState.nombre,
        lat: parseFloat(formState.lat),
        lon: parseFloat(formState.lon),
        timestamp: new Date().toISOString(),
        organizador: "",
        imagen: formState.imagen,
        lugar: formState.lugar,
    };

    try {
        const response = await axios.put(
        apiEndpoint.api+"eventos/" + data._id, updatedVersion, {
        headers: { "Content-Type": "application/json" },
        });
        setFormState((prevState) => ({
        ...prevState,
        nombre: "",
        lat: "",
        lon: "",
        }));
        setSubmitSuccess(true);
        } catch (err) {
        setSubmitSuccess(false);
        setSubmitError("Ocurrió un error al editar el evento.");
        }
    }

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleNuevaCoordenada = async(e) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${e.lat}&lon=${e.lon}&format=json`
        
        try{
          const response = await axios.get(url)
          const place = response.data.display_name
          console.log(place)
          setFormState((prevState) => ({
            ...prevState,
            lat: parseFloat(e.lat),
            lon: parseFloat(e.lon),
            lugar: place
          }))
        }catch (error){
          console.error("No se pudo obtener el nombre del lugar")
        }
  
      };

    const classnameboton = "bg-green-500 text-white mt-2 w-fit mx-auto px-4 py-2 rounded hover:bg-green-600 transition duration-200";

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    return (
        <>

            <div className='min-h-screen bg-gray-100 text-black p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white'>
                    <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
                    <h2 className='pt-4 text-3xl font-bold mb-2' >Editar Evento</h2>
                        <form onSubmit={handleEventSubmit} className='flex flex-col'>
                            <label className="font-bold">Nombre</label>
                            <input
                            type="text"
                            name="nombre"
                            value={formState.nombre}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2  mr-3 bg-gray-300'
                            />
                            <label className="font-bold">Imagen</label>
                            <input
                            type="text"
                            name="imagen"
                            value={formState.imagen}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2  mr-3 bg-gray-300'
                            />
                            <UploadFile setFormState={setFormState}/>
                            <label className="font-bold">Dirección</label>
                            <input
                            type="text"
                            name="lugar"
                            value={formState.lugar}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2 mr-3 bg-gray-300'
                            />
                            <label className="font-bold">Latitud</label>
                            <input
                            type="text"
                            name="latitud"
                            value={formState.lat}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2 mr-3 bg-gray-300'
                            />
                            <label className="font-bold">Longitud</label>
                            <input
                            type="text"
                            name="latitud"
                            value={formState.lat}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2 mr-3 bg-gray-300'
                            />
                            <label className="text-lg font-bold py-2 mb-4">En caso de no tener las coordenadas para el evento, señala aquí:</label>
                            <MapComponent coordinates={[{lat: formState.lat, lon: formState.lon, nombre: formState.nombre}]} setCoordinates={handleNuevaCoordenada}/>
                            <button type='submit' className={classnameboton}>Editar Evento</button>
                        </form>
                    {submitError && <p className="text-red-500">{submitError}</p>}
                    {submitSuccess && <p className="text-green-500">Entrada editada con éxito.</p>}
            </div>
        </>
    );
}

export default Update;