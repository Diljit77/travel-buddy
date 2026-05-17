"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const { verifyEmail } = useUserStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      const success = await verifyEmail(token);

      if (success) {
        setStatus("success");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#08080c]">
      <div className="bg-white dark:bg-[#15151e] p-8 rounded-xl shadow-md text-center max-w-sm w-full">

        {status === "loading" && (
          <>
            <h2 className="text-xl font-bold mb-2">Verifying...</h2>
            <p className="text-sm text-[#64748b]">Please wait</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Email Verified 🎉
            </h2>
            <p className="text-sm text-[#64748b]">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-bold text-red-500 mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-sm text-[#64748b]">
              Please request a new verification email.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#08080c]"><div className="text-xl font-bold">Loading...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}