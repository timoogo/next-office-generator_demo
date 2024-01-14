import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';

import {
  getModelDefinition,
  capitalizeAndRemoveLast,
} from '../../../utils';

import {GenericInputNumber} from "../../../components/Form/GenericInputNumber";
import {GenericInputText} from "../../../components/Form/GenericInputText";

type GenericFormProps = {
  entityName: string;
  tableName: string;
  formFields: string[];
  formFieldsTypes: Record<string, string>;
};

type GenericEntityFormData = {
  [key: string]: string | number | boolean;
};

const GenericFormPage: React.FC<GenericFormProps> = ({ entityName, tableName, formFields, formFieldsTypes }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<GenericEntityFormData>({});
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const initialFormData = formFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    setFormData(initialFormData);
  }, [formFields]);

  useEffect(() => {
    checkFormCompleteness();
  }, [formData]);

  const checkFormCompleteness = () => {
    const isComplete = formFields.every((field) => {
      if (formFieldsTypes[field] === 'boolean') {
        return formData[field] !== undefined;
      }
      return formData[field] && formData[field].toString().trim() !== '';
    });
    setIsFormComplete(isComplete);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    let updatedValue: string | number | boolean;

    if (formFieldsTypes[name] === 'integer') {
      updatedValue = value !== '' ? parseInt(value, 10) : '';
    } else {
      updatedValue = value;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(formData) // formData est l'état local avec les données du formulaire
    });

    // TODO: redirect here to the index
    // TODO: remove the router.back() on the submit button
    console.log('response', response);
  };

  return (
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-semibold mb-4">Create {entityName}</h1>
        <pre className="bg-gray-800 text-white overflow-x-auto p-4 rounded-lg">
          <code className="language-json">{JSON.stringify(formFieldsTypes, null, 2)}</code>
        </pre>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {formFields.filter(field => formFieldsTypes[field] === 'integer' || formFieldsTypes[field] === 'string').map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {formFieldsTypes[field] === 'integer' && (
                    <GenericInputNumber
                        field={field}
                        value={String(formData[field])}
                        handleChange={handleChange}
                    />
                )}
                {formFieldsTypes[field] === 'string' && (
                    <GenericInputText
                        field={field}
                        value={formData[field] as string  }
                        handleChange={handleChange}

                    />
                )}
              </div>
          ))}
          <div className="flex items-center justify-between">
            <button
                onClick={() => router.back()}
                type="submit"
                disabled={!isFormComplete}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
  );
};

type ServerSideProps = {
  params: {
    entity: string;
  }
}

// TODO: Set this a config (default)
const excludedFields = ['id', 'created_at', 'updated_at'];

export async function getServerSideProps(params: ServerSideProps) {
  const { entity } = params.params;
  const modelName = capitalizeAndRemoveLast(entity);
  // @ts-ignore
  const arrEntity = [...entity];
  arrEntity.pop();
  const tableName = arrEntity.join('');

  // Schema
  const modelEntity = await getModelDefinition(fs, modelName);

  let formFields: string[] = [];
  let formFieldsTypes: Record<string, string> = {};

  if (modelEntity) {
    formFields = Object.keys(modelEntity).filter((field) => !excludedFields.includes(field));
    formFieldsTypes = formFields.reduce((acc, field) => {
      let fieldType = '';

      if (modelEntity[field].type.includes('string')) {
        fieldType = 'string';
      } else if (modelEntity[field].type.includes('integer')) {
        fieldType = 'integer';
      } else if (modelEntity[field].type.includes('boolean')) {
        fieldType = 'boolean';
      }

      return { ...acc, [field]: fieldType };
    }, {});
  }

  return {
    props: {
      entityName: entity,
      tableName,
      formFields,
      formFieldsTypes,
    },
  };
};


export default GenericFormPage;
