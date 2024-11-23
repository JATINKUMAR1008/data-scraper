"use server";
import { redirect } from "next/navigation";

export const logout = async () => {
  redirect("/auth/logout");
};
