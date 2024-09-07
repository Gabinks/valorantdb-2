import { NextRequest, NextResponse } from "next/server";
import { getSkinByName } from "../../../../api/valorantSkins";
import * as bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
    const res = NextResponse
    try {
        const { searchParams } = new URL(req.url)
        const skinName = searchParams.get('skinName')!;
        const apiKey = searchParams.get('apiKey')!;
        const compare = bcrypt.compare(process.env.API_KEY!, apiKey);
        if (!compare) {
            return res.json({ success: false, message: 'Forbidden' }, {
                status: 401
            })
        }
        const skin = await getSkinByName(skinName);
        return res.json({ skin, loaded: true }, {
            status: 200
        })
    }
    catch (error) {
        console.error('Erreur lors de la requete API :', error)
        return res.json({ success: false }, {
            status: 500
        })
    }
}