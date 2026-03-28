// Login and Register do not use the admin sidebar layout.
// They are outside the /admin/(protected) group.
// This file is intentionally minimal — pages manage their own full-screen layouts.
export default function AuthPagesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
