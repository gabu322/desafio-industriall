'use client';

import { useSession } from 'next-auth/react';

import Button from '@components/Button';
import MostrarAtas from '@components/MostrarAtas';


export default function Home() {
    return (
        <main>
            <div className='flex justify-between w-3/5 m-auto p-4 items-center flex-wrap'>
                <div className='flex justify-between flex-col'>
                    <div className='text-2xl font-bold' style={{ color: "#003A64" }}>Atas da Reunião</div>
                    <div className='text-xl' style={{ color: 'var(--gray-darkest, #5C5958)' }}>Essas são as atas das últimas reuniões</div>
                </div>

                <Button href="/novaAta" color="red">+ NOVA ATA</Button>
            </div>
            
            <MostrarAtas />
        </main>
    )
}
