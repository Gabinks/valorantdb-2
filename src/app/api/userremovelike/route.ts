import prismadb from "@/libs/prismadb";
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
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
    // Utiliser la méthode findOne pour trouver l'enregistrement à supprimer
    const userLike = await prismadb.user_like.findFirst({
        where: {
            user_id: userId,
            skin_name: skinName
        }
    });
    // Vérifier si l'enregistrement existe
    if (!userLike) {
        return res.json({ success: false, message: "User like not found." }, {
            status: 404
        });
    }

    try {
        // Supprimer l'enregistrement trouvé
        await prismadb.user_like.delete({
            where: { id: userLike.id }
        });
        return res.json({ success: true, message: "Unliked" }, {
            status: 200
        });
    } catch (error) {
        console.error("Error deleting user like:", error);
        return res.json({ success: false, message: "Internal server error." }, {
            status: 500
        });
    }
}