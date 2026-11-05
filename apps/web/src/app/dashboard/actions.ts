"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitPowerReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("campus_id").eq("id", user.id).single();
  if (!profile?.campus_id) redirect("/dashboard?error=campus");
  const hostel = String(formData.get("hostel_name") || "").trim();
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "").trim();
  if (!hostel || !["electricity_available","no_light","power_restored","power_interrupted"].includes(status)) redirect("/dashboard?error=power");
  const { error } = await supabase.from("hostel_power_reports").insert({ campus_id: profile.campus_id, hostel_name: hostel, status, note: note || null, contributor_id: user.id });
  if (error) redirect("/dashboard?error=power");
  revalidatePath("/dashboard");
  redirect("/dashboard?power=sent");
}

export async function submitNewsTip(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("campus_id").eq("id", user.id).single();
  if (!profile?.campus_id) redirect("/dashboard?error=campus");
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (title.length < 5 || body.length < 10) redirect("/dashboard?error=tip");
  const { error } = await supabase.from("news_tips").insert({ campus_id: profile.campus_id, submitted_by: user.id, title, body });
  if (error) redirect("/dashboard?error=tip");
  revalidatePath("/dashboard");
  redirect("/dashboard?tip=sent");
}
