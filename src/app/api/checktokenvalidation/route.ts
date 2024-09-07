import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
    const res = NextResponse;
    let expired = false
    let { user_token } = await req.json()
    if (!user_token) {
        return res.json({ expired: expired }, {
            status: 200
        })
    }
    let { exp } = jwt.decode(user_token);
    if (!exp) {
        return res.json({ expired: expired }, {
            status: 200
        })
    }
    let now = Date.now() / 1000
    if (now > exp) {
        expired = true;
    }
    return res.json({ expired: expired }, {
        status: 200
    })
}