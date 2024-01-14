// TableContainer.tsx
import React from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface TableContainerProps {
    data: Record<string, any>[];
    entityPath: string;
    tableName: string;
    modelEntity: any;
}

export const TableContainer: React.FC<TableContainerProps> = ({ data, tableName, modelEntity }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="min-w-full divide-y divide-gray-200">
            <TableHeader modelProperties={Object.keys(modelEntity)}/>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {data.map((item) => (
                <TableRow
                    key={item.id}
                    item={item}
                    tableName={tableName}
                    modelProperties={Object.keys(modelEntity)}
                />
            ))}
            </tbody>
        </table>
    </div>
);
