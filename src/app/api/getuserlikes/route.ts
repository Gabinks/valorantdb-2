import { NextRequest, NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken'
import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
    const res = NextResponse
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get('token');
        if (!token) {
            return res.json({ success: false, message: 'Not logged in.' }, {
                status: 401
            })
        }
        const { userId } = jwt.decode(token);
        if (!userId) {
            return res.json({ success: false, message: 'Not logged in.' }, {
                status: 401
            })
        }
        let data = await prisma.user_like.findMany({
            where: {
                user_id: userId
            }
        })
        const skinsLiked: (string | null)[] = []
        data.map((value, index) => {
            skinsLiked.push(value.skin_name)
        })
        return res.json({ success: true, skinsLiked }, {
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