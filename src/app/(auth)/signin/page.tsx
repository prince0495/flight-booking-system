"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninValues = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(data: SigninValues) {
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.msg || "Authentication failed");
      }
      const result = await res.json();
      console.log(result);
      console.log(result.role);
      if(result?.role === "ADMIN") {
        console.log('yes');
        
        router.push("/admin");
        router.refresh();
      }
      else {
        router.push("/");
        router.refresh();
      }
      
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h1>
        <p className="text-slate-500 text-sm">Welcome back. Let's get you to your next destination.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

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
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase text-slate-500">Password</label>
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl mt-4"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        New to SkyBound?{" "}
        <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}