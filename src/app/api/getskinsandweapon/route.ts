import { NextRequest, NextResponse } from "next/server";
import valorantSkins from "../../../../api/valorantSkins";
import getWeapon from "../../../../api/valorantWeapons";
import * as bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
    const res = NextResponse
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get('apiKey')!;
        const compare = bcrypt.compare(process.env.API_KEY!, apiKey);
        if (!compare) {
            return res.json({ success: false, message: 'Forbidden' }, {
                status: 401
            })
        }
        const skins = await valorantSkins({ page: parseInt(searchParams.get('page')!), filter: searchParams.get('filter')!, sort: searchParams.get('sort')!, search: searchParams.get('search')! })
        const weapon = await getWeapon()
        return res.json({ skins, weapon }, {
            status: 200
        })
    }
    catch (error) {
        console.error('Internal Server Error :', error)
        return res.json({ success: false, message: "Internal Server Error." }, {
            status: 500
        })
    }
}