'use client';

import axios from "axios";
import { useEffect, useState } from 'react';

export default function GetToken() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("https://desafio-iall.azurewebsites.net/api/login", {
                    userName: 'gabriel@teste.com',
                    password: process.env.PASSWORD,
                });

                if (response.status === 200) {
                    const accessTokenPassive = response.data.token;
                    setAccessToken(accessTokenPassive);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        if(accessToken == null) {
            fetchData();
        }

    }, []);

    useEffect(() => {
        sessionStorage.setItem('token', accessToken);
    }, [accessToken]);
    return (
        <>
            Token 1: {accessToken}
            <br />
            Token 2: {sessionStorage.getItem('token')}
        </>
    )
}
