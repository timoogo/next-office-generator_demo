import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: Add GET method to read a ressource
    if (req.method === 'POST') {
        try {
            const { entity } = req.query;

            // @ts-ignore
            const result = await prisma[entity].create({
                data: {
                    ...JSON.parse(req.body),
                    // TODO: Add created_at & updated_at (mendartory in model)
                },
            });

            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la communication avec l\'API externe' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { entity } = req.query;
            const { id, ...data } = JSON.parse(req.body);
            // @ts-ignore
            const result = await prisma[entity].update({
                where: { id },
                data,
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { entity } = req.query;
            const { id } = JSON.parse(req.body);
            // @ts-ignore
            const result = await prisma[entity].delete({
                where: { id },
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
