import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

export default async function Layout({
  children,
  profilUsernamePostIdModal,
}: {
  children: React.ReactNode;
  profilUsernamePostIdModal: React.ReactNode;
}) {
  return (
    <div className="flex max-md:flex-col min-h-dvh">
      <Sidebar />
      <main className="flex-1">{children}</main>
      <Navbar />
      {profilUsernamePostIdModal}
    </div>
  );
}
