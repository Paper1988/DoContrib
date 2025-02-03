import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from 'next/image';
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // 如果沒有登入，導向到 /login
    if (!session) {
        redirect("/login");
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>歡迎, {session.user?.name}！</p>
            <p>Email: {session.user?.email}</p>
            <Image className="items-center" src={session.user?.image ?? ""} alt="User Avatar" width={50} height={50} />
        </main>
    );
}
