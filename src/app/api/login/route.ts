import { NextRequest, NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import prisma from "@/libs/prismadb";

export async function POST(req: NextRequest) {
    const res = NextResponse
    if (req.method === 'POST') {
        const apiKey = req.headers.get('api-key');
        bcrypt.compare(process.env.API_KEY!, apiKey!, function (err) {
            if (err) {
                return res.json({ success: false, message: "Forbidden." }, {
                    status: 401
                })
            }
        })
        const { username, password } = await req.json();
        const accountExist = await prisma.users.findFirst({
            where: {
                username: username
            }
        })
        if (accountExist) {
            if (await bcrypt.compare(password, accountExist.password!)) {
                const token = jwt.sign({ userId: parseInt(accountExist.id) }, process.env.SECRET_JWT!, { expiresIn: '1h' });
                return res.json({ success: true, message: "Successfully logged in.", usertoken: token }, {
                    status: 200
                });
            }
            else {
                return res.json({ statusCode: 400, message: "Username or password is incorrect." }, {
                    status: 401
                })
            }
        }
        else {
            return res.json({ success: true, message: "Username or password is incorrect." }, {
                status: 401
            })
            return;
        }

    } else {
        res.json({ message: "Method GET is not allowed." }, {
            status: 405
        })
    }
}