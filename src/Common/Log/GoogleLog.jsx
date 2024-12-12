import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useSession } from '../../SessionProvider'; // Usamos el contexto
import Cookies from 'universal-cookie';
import apiEnpoint from '../../../apiEndpoint.json'

const cookies = new Cookies();

function GoogleLog() {

    const { funLogin, funLogout } = useSession();

    let now = new Date();
    
    const [user, setUser] = useState(null);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => { setUser(codeResponse); seslogin(); },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        console.log(user);
                        console.log(profile);
                        funLogin(res.data.email);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user,login ]
    );

    useEffect (
        () => {
            if (profile) {
                postLog();
            }
        },
        [profile]
    );

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        cookies.remove('email', { path: '/' });
        funLogout();
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

    return (
        <div>
            {profile ? (
                <div className="flex flex-col text-center text-lg font-semibold text-black space-y-2 bg-white rounded-full px-5">
                    {/*<img src={profile.picture} alt="user image" />  SOLO POSIBLE BAJO HTTPS*/}
                    <p>Nombre: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <button onClick={logOut} className='hover:text-blue-400 transition'>Salir</button>
                </div>
                ) : (
                <div className='my-2'>
                    <button onClick={login} className='px-4 py-2 bg-white text-black text-lg font-semibold rounded hover:text-blue-500 transition'>Login con Google</button>
                </div>
                )
            }
        </div>
    )
}

export default GoogleLog