import prismadb from "@/libs/prismadb";
import * as jwt from 'jsonwebtoken'
import * as bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const res = NextResponse
    if (req.method !== 'POST') {
        return res.json({ success: false, message: 'Method GET not allowed.' }, {
            status: 401
        })
    }
    const { token, skinName } = await req.json();
    const apiKey = req.headers.get('api-key')!;
    const compare = bcrypt.compare(process.env.API_KEY!, apiKey)
    if (!compare) {
        return res.json({ success: false, message: "Unauthorized." }, {
            status: 401
        })
    }
    if (!token) {
        return res.json({ success: false, message: "Not logged in." }, {
            status: 401
        })
    }
    const { userId } = jwt.decode(token);
    if (!userId) {
        return res.json({ success: false, message: "Not logged in." }, {
            status: 401
        })
    }
    const add = await prismadb.user_like.create({
        data: {
            user_id: userId,
            skin_name: skinName
        }
    })
    if (!add) {
        return res.json({ success: false, message: "Internal server error." }, {
            status: 500
        })
    }
    return res.json({ success: true, message: "Liked" }, {
        status: 200
    })
}