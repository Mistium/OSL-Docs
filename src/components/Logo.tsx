/* The OSL mark: an O with a moon. Drawn here rather than loaded, so it is
   crisp at any size and takes the accent colour. */
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg class="logo" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="osl-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#e5c6ef" />
          <stop offset="1" stop-color="#9f6fb2" />
        </linearGradient>
      </defs>
      <circle cx="15" cy="17" r="10" fill="none" stroke="url(#osl-logo-g)" stroke-width="4.2" />
      <circle cx="25.5" cy="6.5" r="3.4" fill="#c299cf" />
    </svg>
  );
}
