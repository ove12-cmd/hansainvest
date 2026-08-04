"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, verifyPassword } from "@/lib/session";

export type LoginState = {
  error?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Sisesta e-post ja parool." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    return { error: "Vale e-post või parool." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
