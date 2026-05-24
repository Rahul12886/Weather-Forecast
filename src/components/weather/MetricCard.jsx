export default function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="metric-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-2 text-2xl font-extrabold">{value}</p>
        </div>
        {Icon && (
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/12 text-sky-600 dark:bg-sky-300/15 dark:text-sky-200">
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      {detail && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{detail}</p>}
    </article>
  );
}
