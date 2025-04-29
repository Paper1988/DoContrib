import { authOptions } from "@/lib/auth";
import { Avatar, Button } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <main className="p-6">
            <div className="w-full h-full flex flex-col items-center justify-center gap-8 relative">
                <h1 className="top-4 left-4 text-4xl font-bold">Dashboard</h1>
                <p>歡迎, {session.user?.name}！</p>
                <p>Email: {session.user?.email}</p>
                <Avatar sx={{ width: 56, height: 56 }} src={session.user?.image ?? ""} />
                <Button variant="contained" color="info" href="/documents">
                    文件管理
                </Button>
                <Button variant="outlined" color="error" href="/">
                    返回主頁
                </Button>
            </div>
        </main>
    );
}
