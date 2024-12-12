import { useState, useEffect } from 'react'
import axios from 'axios';
import SingleLog from './SingleLog';
import apiEnpoint from '../../../apiEndpoint.json'


function LogViewer({email}) { 


    const [reload, setReload] = useState(false);
    const [data, setData] = useState(null);
    const [logs, setLogs] = useState(null);

    const urlPeticion = `${apiEnpoint.api}logs/?filter_user=${email}`

    const reloadLogs = () => {
        setReload(!reload);
    }

    useEffect(() => {
        const fetchData = async() => {
            try {
                if(urlPeticion) {
                    const response = await axios.get(urlPeticion);
                    setData(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [reload]);

    useEffect(() => {
        if(data !== null) {
            const logsComponented = data.map((log) => <SingleLog key={log._id} data={log}/>);
            setLogs(logsComponented);
        }
    }, [data]);

    return (
        <div className='flex-col'>
            {logs}
        </div>
    )
}

export default LogViewer