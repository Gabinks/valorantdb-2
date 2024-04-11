import {NextApiRequest, NextApiResponse} from "next";
import {getSkinByName} from "../../../api/valorantSkins";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const skinName = JSON.parse(req.body).skinName;
    const skin = await getSkinByName(skinName);
    res.status(200).json({skin, loaded: true})
}