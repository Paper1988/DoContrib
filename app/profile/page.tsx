"use client";

import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileRedirect() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.id) {
            router.replace(`/profile/${session.user.id}`);
        }
    }, [session, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen relative overflow-auto">
			<CircularProgress size={70} />
		</div>
    );
}