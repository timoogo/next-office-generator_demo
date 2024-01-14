import React from 'react';

interface Props {
    field: string;
    value: string ;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
}

export const GenericInputText = (props: Props) => (
    <input
        type="text"
        name={props.field}
        id={props.id}
        value={props.value as string || ''}
        onChange={props.handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
);
