import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-md:flex-col min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
      <Navbar />
    </div>
  );
}
