import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="glass-panel mx-auto max-w-xl p-8 text-center">
      <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-300">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Forecast not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">That route drifted out of range.</p>
      <Link className="primary-button mt-6" to="/">
        <FiArrowLeft /> Back to dashboard
      </Link>
    </section>
  );
}
