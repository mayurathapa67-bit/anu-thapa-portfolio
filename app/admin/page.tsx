import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Anu Thapa Portfolio",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return <AdminLogin />;
  }
  return <AdminDashboard />;
}
