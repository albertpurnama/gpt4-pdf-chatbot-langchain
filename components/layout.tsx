import { useUser } from "@auth0/nextjs-auth0/client";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="px-4 bg-white">
        <div className="border-b border-b-slate-200 py-4">
          <nav className="flex items-stretch justify-between items-stretch">
            <a href="#" className="hover:text-slate-600 cursor-pointer align-middle">
              Home
            </a>
            
            {!user && <a href="/api/auth/login">Log In</a>}
            {user && (<div className="flex flex-col text-xs">
              <p>{user.email}</p>
              <a href="/api/auth/logout">Logout</a>
            </div>)}
          </nav>
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
