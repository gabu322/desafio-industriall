'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { MDBBtn } from 'mdb-react-ui-kit';
import { useEffect } from 'react';
import Link from "next/link";

import { headers } from '@next.config';
import Button from '@components/Button';
import MostrarAtas from '@components/MostrarAtas';


export default function Home() {
    const { data: session, status } = useSession();
    return (
        <main>

            <div className='flex justify-between w-3/5 m-auto p-4 items-center flex-wrap'>
                <div className='flex justify-between flex-col'>
                    <div style={{
                        color: "#003A64",
                        fontSize: "24px",
                        fontWeight: 700,
                    }}>Atas da Reunião</div>
                    <div style={{
                        color: 'var(--gray-darkest, #5C5958)',
                        fontSize: '20px',
                        fontStyle: 'normal',
                    }}>Essas são as atas das últimas reuniões</div>
                </div>
                <Button href="/novaAta" color="red">+ NOVA ATA</Button>


            </div>
            <MostrarAtas />
        </main>
    )
}
