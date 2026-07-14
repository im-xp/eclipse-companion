import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getContacts } from "@/lib/contacts";
import { authMode, getProfileForEmail, isDemoMode } from "@/lib/profile";
import { LoginForm } from "@/components/LoginForm";
import { ProfileView } from "@/components/ProfileView";

export const metadata: Metadata = {
  title: "My Profile — Iceland Eclipse",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>;
}) {
  const { login } = await searchParams;
  const session = await getSession();

  if (!session) {
    const notice =
      login === "expired"
        ? "That sign-in link expired or was already used. Enter your email to get a new one."
        : undefined;
    return <LoginForm mode={authMode()} notice={notice} />;
  }

  const profile = await getProfileForEmail(session.email);

  if (!profile) {
    return <LoginForm mode={authMode()} notFoundEmail={session.email} />;
  }

  const contacts = await getContacts(session.email);

  return (
    <ProfileView
      profile={profile}
      contacts={contacts}
      sessionEmail={session.email}
      demo={isDemoMode()}
    />
  );
}
