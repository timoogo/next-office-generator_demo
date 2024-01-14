import React from 'react';

interface Props {
    field: string;
    value: string; // Accept both string and number
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
}
    export const GenericInputNumber = (props: Props) => (
    <input
        type="number"
        name={props.field}
        id={props.id}
        value={props.value || ''}
        onChange={props.handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
);
