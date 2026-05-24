export default function PageLoader() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        <div className="skeleton h-24 md:col-span-4" />
        <div className="skeleton h-96 md:col-span-2" />
        <div className="skeleton h-96 md:col-span-2" />
      </div>
    </main>
  );
}
