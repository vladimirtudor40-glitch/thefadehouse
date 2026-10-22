/** Payment marks drawn inline, so nothing loads from a third party. */
export function PaymentBadges() {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Metode de plată acceptate">
      <li className="flex h-9 items-center rounded-lg border border-line bg-white/[0.03] px-3" title="Visa">
        <span className="font-sans text-[15px] font-extrabold tracking-tight text-alabaster italic">VISA</span>
      </li>
      <li className="flex h-9 items-center rounded-lg border border-line bg-white/[0.03] px-3" title="Mastercard">
        <svg width="26" height="16" viewBox="0 0 26 16" aria-hidden="true">
          <circle cx="9" cy="8" r="7" fill="#EB001B" opacity="0.85" />
          <circle cx="17" cy="8" r="7" fill="#F79E1B" opacity="0.85" />
        </svg>
        <span className="sr-only">Mastercard</span>
      </li>
      <li className="flex h-9 items-center gap-1 rounded-lg border border-line bg-white/[0.03] px-3" title="Apple Pay">
        <svg width="13" height="15" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true" className="text-alabaster">
          <path d="M11.6 9c0-2 1.7-3 1.8-3-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.8-2.7-.7C3.2 4.5 1.9 5.3 1.2 6.6c-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2.1 1-.1 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0 0-2.2-.8-2.2-3.7ZM9.6 3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
        </svg>
        <span className="text-[13px] font-semibold text-alabaster">Pay</span>
      </li>
      <li className="flex h-9 items-center gap-1 rounded-lg border border-line bg-white/[0.03] px-3" title="Google Pay">
        <span className="text-[14px] font-bold text-[#4285F4]">G</span>
        <span className="text-[13px] font-semibold text-alabaster">Pay</span>
      </li>
    </ul>
  );
}
