"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, User, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupValues) {
    setError(null);
    try {
      console.log('trying...');
      
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.msg || "Something went wrong");
      }
      const d = await res.json();
      console.log(d);
      

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h1>
        <p className="text-slate-500 text-sm">Join SkyBound to earn points and manage your trips.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-slate-500">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              {...register("name")}
              placeholder="John Doe"
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-slate-500">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="name@company.com"
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-slate-500">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="flex items-center gap-2"><Github className="h-4 w-4" /> Github</Button>
        <Button variant="outline" className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline-offset-4 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}