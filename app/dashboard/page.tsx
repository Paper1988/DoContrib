import { authOptions } from "@/lib/auth";
import { Avatar } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>歡迎, {session.user?.name}！</p>
            <p>Email: {session.user?.email}</p>
            <Avatar src={session.user?.image ?? ""} />
        </main>
    );
}
