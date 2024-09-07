import { hashPassword } from "@/utils/bcrypt";
import * as bcrypt from 'bcryptjs'
import prisma from "@/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const res = NextResponse
    if (req.method !== 'POST') {
        res.json({ success: false, message: "Method GET is not allowed." }, {
            status: 401
        })
        return;
    }
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
        res.json({ success: false, message: "Account already exist." }, {
            status: 401
        })
        return;
    }
    const passwordHashed = await hashPassword(password)
    const createAccount = await prisma.users.create({
        data: {
            username: username,
            password: passwordHashed
        }
    })
    if (createAccount) {
        res.json({ success: true, message: "Account created." }, {
            status: 200
        })
    } else {
        res.json({ success: false, message: "Bad request." }, {
            status: 400
        })
        return;
    }
}