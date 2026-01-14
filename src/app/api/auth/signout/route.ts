import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json({success: true})
        res.cookies.set('token', "", {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        })
        return res;
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, msg: 'Internal server error'}, {status: 500})
    }
}