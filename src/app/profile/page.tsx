import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getContacts } from "@/lib/contacts";
import { authMode, getProfileForEmail, isDemoMode } from "@/lib/profile";
import { LoginForm } from "@/components/LoginForm";
import { ProfileView } from "@/components/ProfileView";

export const metadata: Metadata = {
  title: "My Profile — Iceland Eclipse",
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return <LoginForm mode={authMode()} />;
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
