

import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export type SignupBody = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as SignupBody;
        console.log(body);
        const { name, email, password } = body;
    
        const alreadyExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(alreadyExist) {
            return NextResponse.json({msg: "Incorrect email or password"}, { status: 403 });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email: email,
                password: hashedPassword
            }
        });
        const token = jwt.sign({userId: user.id, role: user.role, email: user.email}, "james", {
            expiresIn: '7d'
        });

        await prisma.wallet.create({
            data: {
                user_id: user.id,
                amount: 50000
            }
        })

        const res = NextResponse.json({ msg: "User successfully created"});
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            });

        return res;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Internal server error", success: false }, { status: 500 });
    }
}