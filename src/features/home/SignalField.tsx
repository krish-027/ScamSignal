/** Pure decorative, CSS-animated SVG. No canvas, WebGL, timers or network requests. */
export function SignalField() {
  return (
    <div className="signal-field" aria-hidden="true">
      <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="field-trace" x1="20" y1="20" x2="490" y2="460" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F7B390" stopOpacity=".7" />
            <stop offset=".55" stopColor="#EAC6A5" stopOpacity=".22" />
            <stop offset="1" stopColor="#9CBDE7" stopOpacity=".54" />
          </linearGradient>
          <radialGradient id="field-core">
            <stop stopColor="#FC9871" stopOpacity=".2" />
            <stop offset="1" stopColor="#FC9871" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="260" r="214" fill="url(#field-core)" />
        <g className="signal-field-orbit" stroke="url(#field-trace)" strokeWidth="1">
          <circle cx="260" cy="260" r="216" strokeDasharray="2 13" />
          <circle cx="260" cy="260" r="172" strokeDasharray="53 14 4 14" />
          <circle cx="260" cy="260" r="120" strokeDasharray="1 11" />
          <circle cx="260" cy="260" r="72" strokeDasharray="5 13" />
        </g>
        <g opacity=".35" stroke="#DAC6B3" strokeWidth=".7">
          <path d="M260 14V506 M14 260H506" />
          <path d="M87 87L433 433 M433 87L87 433" strokeDasharray="2 10" />
          <path d="M26 26h55M26 26v55M494 26h-55M494 26v55M26 494h55M26 494v-55M494 494h-55M494 494v-55" />
        </g>
        <g className="signal-field-sweep" stroke="#FA916D" strokeWidth="1.5" strokeLinecap="round">
          <path d="M260 260L410 88" opacity=".6" />
          <circle cx="410" cy="88" r="5" fill="#FA916D" stroke="none" />
        </g>
        <g stroke="#F4B894" strokeWidth="2" opacity=".85">
          <path d="M193 260h35l12-27 20 54 18-40 12 13h37" strokeLinejoin="round" />
        </g>
        <circle cx="260" cy="260" r="9" stroke="#F3C7A6" strokeWidth="1" />
        <circle cx="260" cy="260" r="2.5" fill="#F3C7A6" />
        <g fill="#DAC7B6" fontFamily="monospace" fontSize="9" letterSpacing="2">
          <text x="276" y="48">SIGNAL  /  001</text>
          <text x="33" y="246">SCAN</text>
          <text x="367" y="482">NOISE / 000</text>
        </g>
      </svg>
    </div>
  );
}
