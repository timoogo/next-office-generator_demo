import React from 'react';

interface TableHeaderProps {
    modelProperties: string[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ modelProperties }) => {
    const columnWidth = `calc(100% / ${modelProperties.length + 1})`;

    return (
        <thead className="bg-gray-50">
        <tr>
            {modelProperties.map(key => (
                <th
                    key={key}
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                    style={{ width: columnWidth }}
                >
                    {key}
                </th>
            ))}
            <th
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                style={{ width: columnWidth }}
            >
                Actions
            </th>
        </tr>
        </thead>
    );
};
