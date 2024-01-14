import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import fs from 'fs';

import prisma from "@/prisma/prisma";

import { GenericPageProps } from "../../../../types/GenericProp";
import {
    capitalizeAndRemoveLast,
    getModelDefinition,
} from "../../../../utils";

const excludedFields = ['id', 'created_at', 'updated_at'];

const GenericEditPage: NextPage<GenericPageProps> = ({ item, entityName, tableName }) => {
    const [formData, setFormData] = useState(item);
    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${tableName}`, {
                method: 'PUT',
                body: JSON.stringify(formData) // formData est l'état local avec les données du formulaire
            });

            if (response.ok) {
                router.push(`/admin/${entityName}`);
            } else {
                console.error('Failed to update the entity:', response.statusText);
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    return (
        <>
            <h1>Edit {entityName}</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).filter(key => !excludedFields.includes(key)).map(key => {
                    return (
                        <div key={key}>
                            <label htmlFor={key}>{key}</label>
                            <input
                                id={key}
                                name={key}
                                type="text"
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        </div>
                    );
                })}
                <button type="submit">Mettre à jour</button>
            </form>
        </>
    );
};

export default GenericEditPage;

type ServerSideProps = {
  params: {
    id: string;
    entity: string;    
  }
}

export async function getServerSideProps(params: ServerSideProps) {
    const { id, entity } = params.params;
    // @ts-ignore
    const arrEntity = [...entity];
    arrEntity.pop()
    const tableName = arrEntity.join('')
    const displayName = capitalizeAndRemoveLast(entity);
    const modelEntity = await getModelDefinition(fs, displayName);

    let formFields: string[] = [];
    let formFieldsTypes: Record<string, string> = {};

    formFields = Object.keys(modelEntity).filter((field) => !excludedFields.includes(field));
    formFieldsTypes = formFields.reduce((acc, field) => {
        let fieldType = '';

        if (modelEntity[field].type.includes('string')) {
            fieldType = 'string';
        } else if (modelEntity[field].type.includes('integer')) {
            fieldType = 'integer';
        }

        return { ...acc, [field]: fieldType };
    }, {});

    // @ts-ignore
    const item = await prisma[tableName].findUnique({
        where: {
        id: Number(id),
        },
    });

    return {
        props: {
            item,
            entityName: entity,
            tableName,
            formFields,
            formFieldsTypes,
        },
    };
};