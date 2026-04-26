import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-transparent flex pb-16 md:pb-0">
            <Sidebar />
            <main className="flex-1 md:ml-56 min-h-screen overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
