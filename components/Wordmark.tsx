/** Text wordmark only. Swap for KGL Kicks' real logo file when they share it. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wide inline-flex items-baseline text-2xl leading-none ${className}`}>
      KGL<span className="mx-[0.12em] inline-block size-[0.32em] translate-y-[-0.08em] rounded-full bg-sky" aria-hidden="true" />KICKS
    </span>
  );
}
