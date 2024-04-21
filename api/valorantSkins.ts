import { hashPassword } from "@/utils/bcrypt";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function valorantSkins({ page = 1, filter = '', sort = 'asc', search = '' }) {
    try {
        const response = await axios.get('https://valorant.fandom.com/wiki/Weapon_Skins');
        const data = await response.data;
        const $ = cheerio.load(data);
        const $tables = $('table')
        var toReturn: object[] = []
        $tables.eq(2).find('tr').each((i, el) => {
            const img = $(el).find('img');
            const td = $(el).find('td[data-sort-value]');
            const skinType = $(el).find('td a').filter((index, element) => {
                return $(element).attr('title') && $(element).attr('href') && !$(element).attr('href').includes("Collection");
            }).attr('href')?.replace('/wiki/', '');
            const skinName = $(img).prop('alt');
            const skinUrl = $(img).prop('data-src')
            const skinPrice = $(td).find('span').prop('innerText');
            if (skinName !== undefined && skinUrl !== undefined) {
                toReturn.push({
                    name: skinName,
                    skinType: skinType,
                    skinImgUrl: skinUrl.replace(/\/scale-to-width-down\/\d+\?cb=\d+/, ""),
                    cost: skinPrice!.trim()
                })
            }
        })
        if (filter != '') {
            toReturn = toReturn.filter(skin => {
                const weapon = skin.skinType === 'Tactical_Knife' ? 'Melee' : skin.skinType
                return weapon === filter
            })
        }
        if (search !== '') {
            toReturn = toReturn.filter(skin => {
                return skin.name.toLowerCase().includes(search.toLowerCase())
            })
        }
        toReturn = toReturn.map(skin => ({
            ...skin,
            cost: parseFloat(skin.cost.replace(/[^\d.]/g, '')) // Convertir la chaîne de coût en nombre
        }));
        if (sort === 'asc') {
            toReturn = toReturn.sort((a, b) => a.cost - b.cost);
        } else {
            toReturn = toReturn.sort((a, b) => b.cost - a.cost);
        }
        const itemsPerPage = 9;
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedData = toReturn.slice(startIndex, endIndex);
        return { data: paginatedData, actualPage: page, maxPage: Math.ceil(toReturn.length / itemsPerPage) };
    } catch (error) {
        console.error('Error fetching HTML:', error);
        return null;
    }
}
export async function getSkinByName(skinName: string) {
    const response = await fetch('https://valorant-api.com/v1/weapons/skins')
    let data = await response.json();
    data = data.data.filter((skin: { displayName: string; }) => skin.displayName.trim() === skinName)[0]
    const url = process.env.PUBLIC_NEXT_URL || 'localhost:3000'
    const apiKey = await hashPassword(process.env.NEXT_PUBLIC_API_KEY!)
    const getSkinPriceResponse = await fetch(`http://${url}/api/getskinpricebyname?skinReq=${skinName}&apiKey=${apiKey}`, {
        method: 'GET'
    })
    const getSkinPriceData = await getSkinPriceResponse.json();
    data['cost'] = getSkinPriceData.skinPrice;
    return data;
}
