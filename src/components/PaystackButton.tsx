// src/components/PaystackPayment.tsx
import { PaystackButton } from "react-paystack";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function PaystackPayment() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Get current user email from Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || "");
      }
    });
  }, []);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
  const amount = 2000 * 100; // 2000 pesewas = GHS 20
  const reference = `${Date.now()}`;

  const onSuccess = async (ref: any) => {
    try {
      // Call your backend to verify payment
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref.reference }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Payment successful! Premium access granted.");
        router.push("/dashboard");
      } else {
        alert("❌ Payment failed to verify.");
      }
    } catch (error) {
      console.error("Verification error", error);
      alert("❌ Something went wrong while verifying payment.");
    }
  };

  const onClose = () => {
    alert("❌ Payment popup closed.");
  };

  return (
    <div className="flex justify-center">
      {email ? (
        <PaystackButton
          email={email}
          amount={amount}
          publicKey={publicKey}
          text="Pay GHS 20 Now"
          onSuccess={onSuccess}
          onClose={onClose}
          reference={reference}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        />
      ) : (
        <p className="text-red-500">Please login to make payment.</p>
      )}
    </div>
  );
}
