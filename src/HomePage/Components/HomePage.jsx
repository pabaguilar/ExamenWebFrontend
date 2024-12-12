import {useEffect,useState} from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";
import SearchBar from '../../Common/SearchBar';
import LogViewer from '../../Common/Log/LogViewer';

import Cookies from 'universal-cookie';
import { useSession } from '../../SessionProvider';
const cookies = new Cookies();

import AddCircleIcon from '@mui/icons-material/AddCircle';

function HomePage(){
  const [showLogViewer, setShowLogViewer] = useState(false);
  const { isLoggedIn } = useSession();

  const toggleLogViewer = () => {
    setShowLogViewer(prevState => !prevState);
  };

  return(
  <div id='homeScreen' className='h-screen flex flex-col justify-between items-center'>
    <div className='flex flex-col justify-center items-center flex-grow gap-y-7'>
      <h1 id='titulo' className='text-center text-6xl font-sans font-bold italic tracking-wide'>EVENTUAL</h1>
        <footer className='text-center text-2xl max-w-2xl mx-auto font-medium'>Bienvenido a Eventual</footer>
          <SearchBar/>
          {isLoggedIn && 
          (<>
            <Link className='w-16 h-16 m-16 fixed bottom-0 right-0' to={`/create`}>
              <AddCircleIcon style={{width:'100%', height:'100%'}} fontSize="large" color='primary'></AddCircleIcon>
            </Link>
            <button onClick={toggleLogViewer} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
              {showLogViewer ? 'Ocultar Historial de Logs' : 'Mostrar Historial de Logs'}
            </button>
            {showLogViewer && <LogViewer email={cookies.get("email")} />}
          </>)
          }
    </div>
  </div>
  );

}

export default HomePage;