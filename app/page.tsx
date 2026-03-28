import { redirect } from "next/navigation";

export default function RootPage() {
  // The root URL redirects to the admin dashboard
  redirect("/admin");
}
