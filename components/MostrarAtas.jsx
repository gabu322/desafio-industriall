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

            console.log(sortedAtas);
            setAtas(sortedAtas);
        });
    }, [session, timestamp]);

    const handleDelete = (id) => {
        axios.delete("https://desafio-iall.azurewebsites.net/api/Atas/" + id, {
            headers: {
                Authorization: "Bearer " + session?.infos?.token
            }
        }).then(res => {
            console.log(res.data);
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
                                    <Image
                                        src="/images/eye.png"
                                        alt="Picture of the author"
                                        width={34}
                                        height={20}
                                    />
                                </Link>

                                <div
                                    onClick={() => {
                                        const shouldDelete = window.confirm("Tem certeza que deseja deletar essa Ata? (id:" + ata.id + ")");
                                        if (shouldDelete) {
                                            handleDelete(ata.id); // Call the delete function
                                        }
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Image
                                        src="/images/thrashCan.png"
                                        alt="Picture of the author"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
