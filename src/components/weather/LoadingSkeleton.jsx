export default function LoadingSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="skeleton h-80 lg:col-span-2" />
      <div className="skeleton h-80 lg:col-span-2" />
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="skeleton h-32" key={index} />
      ))}
    </div>
  );
}
