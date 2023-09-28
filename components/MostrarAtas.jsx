'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";


export default function MostrarAtas() {
    const { data: session, status } = useSession();
    const [atas, setAtas] = useState([]);
    const [timestamp, setTimestamp] = useState(Date.now()); // Step 1: Add timestamp state



    useEffect(() => {
        if (!session?.infos.token) return;

        axios.get("https://desafio-iall.azurewebsites.net/api/Atas", {
            headers: {
                Authorization: "Bearer " + session?.infos?.token
            }
        }).then(res => {
            // Step 1: Group the atas by tipoReuniao
            const groupedAtas = res.data.reduce((acc, ata) => {
                ata.dataInicio = new Date(ata.dataInicio);
                ata.dataFim = new Date(ata.dataFim);

                if (!acc[ata.tipoReuniao]) {
                    acc[ata.tipoReuniao] = [];
                }
                acc[ata.tipoReuniao].push(ata);
                return acc;
            }, {});

            // Step 2: Sort the tipoReuniao groups by name
            const sortedTipoReuniao = Object.keys(groupedAtas).sort();

            // Step 3: Sort the atas within each group by date (newer first)
            for (const tipoReuniao of sortedTipoReuniao) {
                groupedAtas[tipoReuniao].sort((a, b) => {
                    const dateA = new Date(a.dataInicio);
                    const dateB = new Date(b.dataInicio);
                    return dateB - dateA; // Sort by date, newer first
                });
            }

            // Step 4: Convert the object back into an array
            const sortedAtas = sortedTipoReuniao.map(tipoReuniao => groupedAtas[tipoReuniao]);

            setAtas(sortedAtas);
        });
    }, [session, timestamp]);

    const handleDelete = (id) => {
        axios.delete("https://desafio-iall.azurewebsites.net/api/Atas/" + id, {
            headers: {
                Authorization: "Bearer " + session?.infos?.token
            }
        }).then(res => {
            setTimestamp(Date.now());
        });
    };

    return (
        <div className="w-3/5 m-auto bg-white rounded drop-shadow-lg p-10 pt-8 "
            style={{ zIndex: 0 }}
        >
            {atas.map((grupoAtas, index) => (
                <div key={index} className="flex flex-col mb-5">
                    <div className="text-2xl font-bold">{grupoAtas[0].tipoReuniao}</div>
                    {grupoAtas.map((ata, index) => (
                        <div key={index} className={"w-full my-1 p-3 flex justify-between content-center" + ((grupoAtas.length - 1 == index) ? "" : " border-b-2")}>
                            <div className="flex flex-col gap-2">
                                <div className="font-bold">{ata.titulo}</div>

                                <div className=" text-slate-600">{ata.dataInicio.getDate() + "/" + (ata.dataInicio.getMonth() - 1) + "/" + ata.dataInicio.getFullYear() + " às " + ata.dataInicio.getHours() + "h" + ata.dataInicio.getMinutes() + ", na " + ata.local}</div>
                            </div>

                            <div className="flex flex-row justify-center content-center gap-5 h-full my-auto" style={{ height: "100%" }}>
                                <Link href={"/infoAta/" + ata.id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 6.5C13.8387 6.49389 15.6419 7.00678 17.2021 7.97973C18.7624 8.95267 20.0164 10.3462 20.82 12C19.17 15.37 15.8 17.5 12 17.5C8.2 17.5 4.83 15.37 3.18 12C3.98362 10.3462 5.23763 8.95267 6.79788 7.97973C8.35813 7.00678 10.1613 6.49389 12 6.5ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 9.5C12.663 9.5 13.2989 9.76339 13.7678 10.2322C14.2366 10.7011 14.5 11.337 14.5 12C14.5 12.663 14.2366 13.2989 13.7678 13.7678C13.2989 14.2366 12.663 14.5 12 14.5C11.337 14.5 10.7011 14.2366 10.2322 13.7678C9.76339 13.2989 9.5 12.663 9.5 12C9.5 11.337 9.76339 10.7011 10.2322 10.2322C10.7011 9.76339 11.337 9.5 12 9.5ZM12 7.5C9.52 7.5 7.5 9.52 7.5 12C7.5 14.48 9.52 16.5 12 16.5C14.48 16.5 16.5 14.48 16.5 12C16.5 9.52 14.48 7.5 12 7.5Z" fill="#5C5958" />
                                    </svg>
                                </Link>

                                <div className="cursor-pointer" onClick={() => { window.confirm("Tem certeza que deseja deletar essa Ata? (id:" + ata.id + ")") ? handleDelete(ata.id) : null }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 25 24" fill="none">
                                        <path d="M16.5 9V19H8.5V9H16.5ZM15 3H10L9 4H5.5V6H19.5V4H16L15 3ZM18.5 7H6.5V19C6.5 20.1 7.4 21 8.5 21H16.5C17.6 21 18.5 20.1 18.5 19V7Z" fill="#5C5958" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
