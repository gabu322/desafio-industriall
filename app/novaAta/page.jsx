"use client";

import Button from '@components/Button';
import Input from '@components/Input';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NovaAta() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        titulo: '',
        localId: '',
        dataInicio: '',
        dataFim: '',
        tipoReuniaoId: '',
        camposAtaReuniao: [],
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleCamposChange = (e, campo) => {
        const { name, value } = e.target;
        const updatedCampos = [...formValues.camposAtaReuniao];
        const campoIndex = updatedCampos.findIndex((item) => item.campoId == campo.id);
        if (campoIndex !== -1) {
            updatedCampos[campoIndex] = { ...updatedCampos[campoIndex], valor: value };
        } else {
            updatedCampos.push({ campoId: campo.id, valor: value });
        }

        setFormValues({
            ...formValues,
            camposAtaReuniao: updatedCampos,
        });
        console.log(formValues.camposAtaReuniao);
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formValues.titulo ||
            !formValues.localId ||
            !formValues.dataInicio ||
            !formValues.tipoReuniaoId ||
            formValues.camposAtaReuniao.some((campo) => campo.valor === undefined || campo.valor === null)
        ) {
            alert('Por favor, insira todos os campos faltantes'); // You can display a more user-friendly error message
            return;
        }

        formValues.localId = parseInt(formValues.localId);
        formValues.tipoReuniaoId = parseInt(formValues.tipoReuniaoId);

        axios
            .post("https://desafio-iall.azurewebsites.net/api/Atas", formValues, {
                headers: {
                    Authorization: "Bearer " + session?.infos?.token,
                },
            })
            .then((res) => {
                console.log(res.data);
                router.push('/'); // Navigate back to the main page
            })
            .catch((err) => {
                console.log("Erro ao criar ata");
                console.log(formValues);
                console.log(err);
            });
        // Perform your post request or other actions here
    };


    const [locaisOptions, setLocaisOptions] = useState([]);
    const [tiposOptions, setTiposOptions] = useState([]);
    useEffect(() => {
        if (!session?.infos.token) return;

        axios.get("https://desafio-iall.azurewebsites.net/api/Locais", {
            headers: {
                Authorization: "Bearer " + session?.infos?.token
            }
        }).then(res => {
            const modifiedOptions = res.data.map(option => ({
                id: option.id,
                name: option.nome,
            }));
            setLocaisOptions(modifiedOptions);
        });

        axios.get("https://desafio-iall.azurewebsites.net/api/TiposReuniao", {
            headers: {
                Authorization: "Bearer " + session?.infos?.token
            }
        }).then(res => {
            const modifiedOptions = res.data.map(option => ({
                id: option.id,
                name: option.nome,
                campos: option.campos
            }));
            setTiposOptions(modifiedOptions);
        });
    }, [session]);

    const [camposAdicionais, setCamposAdicionais] = useState([]);
    useEffect(() => {
        if (formValues.tipoReuniaoId == "") return;
        formValues.camposAtaReuniao = [];
        axios.get("https://desafio-iall.azurewebsites.net/api/TiposReuniao/" + formValues?.tipoReuniaoId, {
            headers: {
                Authorization: "Bearer " + session?.infos?.token
            }
        }).then(res => {
            setCamposAdicionais(res.data.campos);
            console.log(res.data.campos);
        });
    }, [formValues.tipoReuniaoId])

    return (<>
        <div className='flex justify-between w-3/5 m-auto p-4 items-center flex-wrap'>
            <div className='flex justify-between flex-col'>
                <div style={{
                    color: "#003A64",
                    fontSize: "24px",
                    fontWeight: 700,
                }}>Nova Ata de Reunião</div>
                <div style={{
                    color: 'var(--gray-darkest, #5C5958)',
                    fontSize: '20px',
                    fontStyle: 'normal',
                }}>Os campos obrigatórios estão marcados com um asterisco (*)</div>
            </div>

        </div>
        <div className="w-3/5 m-auto bg-white rounded drop-shadow-lg p-10 pt-8 flex flex-col gap-8"
            style={{ zIndex: 0 }}>
            <div className="text-gray-500 text-lg font-bold">Identificação</div>
            <form onSubmit={handleSubmit} className=" flex flex-col gap-8">
                <Input label="Título *" name="titulo" onChange={handleChange} />
                <Input
                    label="Local *"
                    name="localId"
                    onChange={handleChange}
                    options={locaisOptions} // Pass the options prop for the dropdown
                />
                <div className='flex flex-row gap-8 justify-between '>
                    <Input label={"Data e horário de início *"} type="datetime-local" name="dataInicio" value={formValues.data1} onChange={handleChange} />
                    <Input label={"Data e horário de fim"} type={"datetime-local"} name="dataFim" value={formValues.data2} onChange={handleChange} />
                </div>
                <Input label="Tipo de Reunião *" name="tipoReuniaoId" onChange={handleChange} options={tiposOptions} />
                <div className="text-gray-500 text-lg font-bold">Conteudo da reunião:</div>

                {camposAdicionais.length === 0 ? (
                    <div className='text-sm italic text-gray-400 m-auto'>Selecione o Tipo de Reunião</div>
                ) : (
                    camposAdicionais.map((option) => (
                        <Input
                            key={option.id}
                            label={option.nome + " *"}
                            name={option.nome}
                            type={option.tipo}
                            value={formValues.camposAtaReuniao.find((campo) => campo.nome === option.nome)?.[option.tipo] ?? ''}
                            onChange={(e) => handleCamposChange(e, option)}
                        />
                    ))
                )}

                <div className='flex flex-row gap-8 justify-end'>
                    <Button color="gray" href="/">Cancelar</Button>
                    <Button color="green" type="submit" >Salvar</Button>
                </div>
            </form>
        </div>
    </>
    )
};
