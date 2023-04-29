import { useUser } from "@auth0/nextjs-auth0/client";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="h-16 border-b border-b-slate-200 py-4">
          <nav className="ml-4 pl-6 flex items-stretch justify-between">
            <a href="#" className="hover:text-slate-600 cursor-pointer">
              Home
            </a>
            
            {!user && <a href="/api/auth/login">Log In</a>}
            {user && (<>
              <p>{user.email}</p>
              <a href="/api/auth/logout">Logout</a>
            </>)}
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
