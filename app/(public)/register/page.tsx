"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/auth";
import { signIn } from "next-auth/react";
import { Form } from "@/components/admin/forms/Form";
import { TextField, SelectField } from "@/components/admin/forms/Fields";
import { AdminButton } from "@/components/admin/AdminButton";
import { RegisterSchema, type RegisterInput } from "@/lib/validators/auth";
import { ErrorBanner } from "@/components/admin/Feedback";
import Image from "next/image";
import { IMAGES } from "@/lib/constants";
import Link from "next/link";

const ROLE_OPTIONS = [
  { value: "employer", label: "Employer" },
  { value: "admin", label: "Admin" },
  { value: "candidate", label: "Candidate" },
];

export default function AdminRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: RegisterInput) => {
    setLoading(true);
    setServerError("");
    try {
      await register(
        data.email,
        data.password,
        data.name,
        data.role as "candidate" | "employer" | "admin",
        data.companyId,
      );

      // After successful registration, sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/admin");
      }
    } catch (e) {
      setServerError((e as Error).message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-light-gray">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-[#3730c4] flex-col items-center justify-center p-12 relative overflow-hidden">
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
          Join QuickHire
        </h1>
        <p className="text-white/70 text-sm text-center max-w-xs leading-relaxed">
          Create your admin account to start managing your job board, posting
          jobs, and reviewing candidates.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src={IMAGES.LOGO} alt="QuickHire" width={32} height={32} />
            <span className="font-bold text-neutral-100 font-clash text-lg">
              QuickHire Admin
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-100 font-clash mb-1">
            Create Account
          </h2>
          <p className="text-sm text-neutral-60 mb-6">
            Register for the admin dashboard
          </p>

          {serverError && (
            <div className="mb-4">
              <ErrorBanner message={serverError} />
            </div>
          )}

          <Form<RegisterInput>
            schema={RegisterSchema}
            defaultValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              role: "employer",
              companyId: "",
            }}
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <TextField
              name="name"
              label="Full Name"
              placeholder="Maria Johnson"
              required
            />
            <TextField
              name="email"
              label="Email Address"
              type="email"
              placeholder="admin@quickhire.com"
              required
            />
            <SelectField name="role" label="Role" options={ROLE_OPTIONS} />
            <TextField
              name="companyId"
              label="Company ID"
              placeholder="Leave blank if none"
              hint="Required for employer role"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <AdminButton
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Create Account
            </AdminButton>
          </Form>

          <p className="text-xs text-neutral-60 text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
