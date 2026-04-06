"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/admin/forms/Form";
import { TextField } from "@/components/admin/forms/Fields";
import { AdminButton } from "@/components/admin/AdminButton";
import { LoginSchema, type LoginInput } from "@/lib/validators/auth";
import { ErrorBanner } from "@/components/admin/Feedback";
import Image from "next/image";
import { IMAGES } from "@/lib/constants";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginInput) => {
    setLoading(true);
    setServerError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid credentials or unauthorized role.");
      } else {
        router.push("/admin");
      }
    } catch (e) {
      setServerError(
        (e as Error).message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-light-gray">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5" />
        <Image
          src={IMAGES.LOGO}
          alt="QuickHire"
          width={56}
          height={56}
          className="mb-6"
        />
        <h1 className="text-4xl font-black text-white font-clash mb-3 text-center">
          QuickHire Admin
        </h1>
        <p className="text-white/70 text-sm text-center max-w-xs leading-relaxed">
          Manage your job board — post jobs, review applications, and control
          your hiring pipeline from one place.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs">
          {[
            { label: "Jobs", value: "∞" },
            { label: "Companies", value: "∞" },
            { label: "Categories", value: "∞" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/10 rounded-xl p-3 text-center"
            >
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src={IMAGES.LOGO} alt="QuickHire" width={32} height={32} />
            <span className="font-bold text-neutral-100 font-clash text-lg">
              QuickHire Admin
            </span>
          </div>

          <h2 className="text-2xl font-black text-neutral-100 font-clash mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-neutral-60 mb-6">
            Sign in to your admin account
          </p>

          {serverError && (
            <div className="mb-4">
              <ErrorBanner message={serverError} />
            </div>
          )}

          <Form<LoginInput>
            schema={LoginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <TextField
              name="email"
              label="Email Address"
              type="email"
              placeholder="admin@quickhire.com"
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <AdminButton
              type="submit"
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              Sign In
            </AdminButton>
          </Form>

          <p className="text-xs text-neutral-60 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
