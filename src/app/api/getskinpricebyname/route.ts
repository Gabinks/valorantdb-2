import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
    const res = NextResponse
    try {
        const { searchParams } = new URL(req.url)
        const skinReq = searchParams.get('skinReq')!;
        const apiKey = searchParams.get('apiKey')!;
        const compare = bcrypt.compare(process.env.API_KEY!, apiKey);
        if (!compare) {
            return res.json({ success: false, message: 'Forbidden' }, {
                status: 401
            })
        }
        const response = await axios.get('https://valorant.fandom.com/wiki/Weapon_Skins');
        const data = await response.data;
        const $ = cheerio.load(data);
        const $tables = $('table')
        let toReturn: string | null = null;
        let skinFound = false; // Variable pour vérifier si la skin est trouvée
        $tables.eq(2).find('tr').each((i, el) => {
            const img = $(el).find('img');
            const td = $(el).find('td[data-sort-value]');
            const skinName = $(img).prop('alt');
            const skinPrice = $(td).find('span').text(); // Utilisez .text() au lieu de .prop('innerText')
            if (skinName === skinReq) {
                toReturn = skinPrice;
                skinFound = true; // Marquez que la skin est trouvée
                // Arrêtez la boucle car la skin est trouvée
                return false;
            }
        })
        // Vérifiez si la skin est trouvée ou non
        if (!skinFound) {
            toReturn = "0";
        }
        return res.json({ success: true, skinPrice: toReturn }, {
            status: 200
        })
    }
    catch (error) {
        console.log('Erreur de la réponse API :', error)
        return res.json({ success: false }, {
            status: 500
        })
    }
}