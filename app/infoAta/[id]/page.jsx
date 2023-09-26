"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Input from "@components/Input";
import Button from "@components/Button";


export default function InfosAta({ params }) {
    const { data: session, status } = useSession();
    const [ata, setAta] = useState({});

    useEffect(() => {
        if (!session?.infos.token) return;
        axios.get("https://desafio-iall.azurewebsites.net/api/Atas/" + params?.id,
            {
                headers: {
                    Authorization: "Bearer " + session?.infos?.token
                }
            }).then(res => {
                setAta(res.data);
            });
    }, [session])

    return (<>
        <div className='flex justify-between w-3/5 m-auto p-4 items-center flex-wrap'>
            <div className='flex justify-between flex-col'>
                <div style={{
                    color: "#003A64",
                    fontSize: "24px",
                    fontWeight: 700,
                }}>Informações sobre a Ata nº {ata.id}:</div>

            </div>


        </div>
        <div className="w-3/5 m-auto bg-white rounded drop-shadow-lg p-10 pt-8 flex flex-col gap-8"
            style={{ zIndex: 0 }}>
            <div className="text-gray-500 text-lg font-bold">Identificação: </div>
            <Input label="Título" name="titulo" initialValue={ata.titulo} disabled />
            <Input label="Local" name="localId" initialValue={ata.local} disabled />
            <div className='flex flex-row gap-8 justify-between '>
                <Input label={"Data e horário de início"} type="datetime-local" name="dataInicio" initialValue={ata.dataInicio} disabled />
                <Input label={"Data e horário de fim"} type={"datetime-local"} name="dataFim" initialValue={ata.dataFim} disabled />
            </div>
            <Input label="Tipo de Reunião" name="tipoReuniaoId" initialValue={ata.tipoReuniao} disabled />
            {ata?.camposAtaReuniao?.map((campo) => (
                <Input
                    key={campo.campoId}
                    label={campo.nome}
                    name={campo.nome}
                    type={campo.tipo}
                    initialValue={campo.valor}
                    disabled
                />
            ))}

            <div className='flex flex-row gap-8 justify-end'>
                <Button color="gray" href="/">Voltar</Button>
            </div>
        </div>
    </>
    );
};
