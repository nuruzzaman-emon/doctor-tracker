import Navbar from "@/components/Navbar";


export default function Homelayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      
    </div>
  );
}