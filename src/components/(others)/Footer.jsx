export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
        <p className="font-semibold text-slate-700">Doctor Tracker</p>
        <p>Healthcare records management - Admin workspace</p>
        <p>(c) {new Date().getFullYear()} Doctor Tracker</p>
      </div>
    </footer>
  );
}
