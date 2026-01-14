import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from "@/lib/prisma";

type SigninBody = {    
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as SigninBody;
        const { email, password } = body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!user) {
            return NextResponse.json({msg: "Incorrect email or password"}, {status: 403});
        }
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return NextResponse.json({msg: "Incorrect email or password"}, {status: 402});
        }
        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email },"james",{ expiresIn: "7d" });

        const res = NextResponse.json({ msg: "Signed in successfully", success: true, role: user.role });

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
        return NextResponse.json({ msg: "Internal server error", success: true }, { status: 500 });
    }
}