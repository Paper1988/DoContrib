import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/supabaseClient";

async function getUserSession() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return null;
    }
    return session.user;
}

// 取得單一文件
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    void _req;
    const user = await getUserSession();
    if (!user) {
        return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", (await params).id)
        .eq("owner_id", user.id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ document: data }, { status: 200 });
}

// 更新文件
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserSession();
    if (!user) {
        return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    const supabase = await getSupabaseServerClient();
    const body = await req.json();
    const { title, content } = body;

    const { data, error } = await supabase
        .from("documents")
        .update({
            title: title || undefined,
            content: content || undefined
        })
        .eq("id", (await params).id)
        .eq("owner_id", user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ document: data }, { status: 200 });
}

// 刪除文件
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    void _req;
    const user = await getUserSession();
    if (!user) {
        return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", (await params).id)
        .eq("owner_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "文件已刪除" }, { status: 200 });
}
