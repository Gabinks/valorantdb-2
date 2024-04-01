import {NextApiRequest, NextApiResponse} from "next";
import {hashPassword} from "@/utils/bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {username, password} = JSON.parse(req.body);
        const passwordHashed = await hashPassword(password)
        res.status(200).json({message: "Lourd"})
    } else {
        res.status(405).json({statusCode: res.statusCode, message: "Method GET is not allowed."})
    }
}