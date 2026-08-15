const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Icons = {
  camera: (
    <>
      <path d="M21 27v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" {...strokeProps} />
      <rect x="13" y="27" width="28" height="15" rx="2" {...strokeProps} />
      <circle cx="33" cy="34" r="5" {...strokeProps} />
      <circle cx="20" cy="31" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  gimbal: (
    <>
      <rect x="26" y="10" width="14" height="9" rx="1" {...strokeProps} />
      <circle cx="33" cy="14.5" r="2" {...strokeProps} />
      <path d="M32 19v7" {...strokeProps} />
      <path d="M18 26h28" {...strokeProps} />
      <circle cx="22" cy="26" r="2" {...strokeProps} />
      <circle cx="42" cy="26" r="2" {...strokeProps} />
      <path d="M32 33v13" {...strokeProps} />
      <path d="M23 46h18" {...strokeProps} />
    </>
  ),
  slider: (
    <>
      <rect x="12" y="42" width="40" height="5" rx="2" {...strokeProps} />
      <path d="M12 34h40" {...strokeProps} />
      <rect x="25" y="20" width="14" height="14" rx="2" {...strokeProps} />
      <circle cx="32" cy="27" r="2.5" {...strokeProps} />
    </>
  ),
  light: (
    <>
      <rect x="14" y="16" width="36" height="26" rx="2" {...strokeProps} />
      <path d="M20 22h24M20 29h24M20 36h24" {...strokeProps} />
      <path d="M32 42v10" {...strokeProps} />
      <path d="M21 52h22" {...strokeProps} />
    </>
  ),
  projector: (
    <>
      <rect x="12" y="24" width="34" height="16" rx="2" {...strokeProps} />
      <circle cx="19" cy="32" r="4" {...strokeProps} />
      <rect x="40" y="28" width="3" height="3" rx="1" {...strokeProps} />
      <rect x="40" y="33" width="3" height="3" rx="1" {...strokeProps} />
      <path d="M29 40v8M20 48h18" {...strokeProps} />
    </>
  ),
};

function EquipmentIcon({ type }) {
  const icon = Icons[type] ?? Icons.camera;
  return (
    <svg
      className="equipmentIcon"
      viewBox="0 0 64 64"
      width="76"
      height="76"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

export default EquipmentIcon;
