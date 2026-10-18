import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function FolderIcon(e: P) {
  return (
    <svg viewBox="0 0 128 128" aria-hidden {...e}>
      <path
        d="M10 32c0-7 4-11 11-11h27c3.4 0 5.5 1 7.6 3.3l4.3 4.7H107c7 0 11 4 11 11v57c0 7-4 11-11 11H21c-7 0-11-4-11-11z"
        fill="#2d8ce6"
      />
      <path
        d="M10 45c0-6 3.6-9.5 9.5-9.5h89c5.9 0 9.5 3.5 9.5 9.5v51c0 7-4 11-11 11H21c-7 0-11-4-11-11z"
        fill="#5eb4fa"
      />
      <path
        d="M10 45c0-6 3.6-9.5 9.5-9.5h89c5.9 0 9.5 3.5 9.5 9.5v51c0 7-4 11-11 11H21c-7 0-11-4-11-11z"
        fill="url(#mac-folder-shade)"
      />
      <path
        d="M19.5 36.25h89"
        stroke="#b9e1ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".9"
      />
    </svg>
  );
}

function DocIcon(e: P) {
  return (
    <svg viewBox="0 0 128 128" aria-hidden {...e}>
      <path
        d="M27 8h52l26 26v80a6 6 0 0 1-6 6H27a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z"
        fill="#fbfbfb"
      />
      <path d="M79 8v20a6 6 0 0 0 6 6h20z" fill="#dcdcdc" />
      <path
        d="M21 14a6 6 0 0 1 6-6h52l26 26v80a6 6 0 0 1-6 6H27a6 6 0 0 1-6-6z"
        fill="none"
        stroke="#000"
        strokeOpacity=".12"
      />
      <g transform="translate(40 50)">
        <rect
          width="46"
          height="46"
          rx="10.5"
          fill="#fff"
          stroke="#000"
          strokeOpacity=".08"
        />
        <path
          d="M0 10.5A10.5 10.5 0 0 1 10.5 0h25A10.5 10.5 0 0 1 46 10.5V13H0z"
          fill="#fcd24a"
        />
        <path
          d="M6 18h34M6 25h34M6 32h34M6 39h22"
          stroke="#d0d0d0"
          strokeWidth="1.4"
        />
        <path
          d="M2 14.5h42"
          stroke="#9c9c9c"
          strokeWidth="1"
          strokeDasharray="1.2 1.8"
        />
      </g>
    </svg>
  );
}

function IconDefs() {
  return (
    <svg
      width="0"
      height="0"
      className="absolute"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="mac-folder-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec8ff" stopOpacity=".55" />
          <stop offset=".55" stopColor="#5eb4fa" stopOpacity="0" />
          <stop offset="1" stopColor="#3796ef" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="mac-notes-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe070" />
          <stop offset="1" stopColor="#fcc933" />
        </linearGradient>
        <linearGradient id="mac-mail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fbaff" />
          <stop offset="1" stopColor="#1467ef" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NotesIcon(e: P) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden {...e}>
      <rect width="100" height="100" fill="#fbfbfb" />
      <rect width="100" height="27" fill="url(#mac-notes-top)" />
      <path
        d="M4 29.5h92"
        stroke="#8d8d8d"
        strokeWidth="1.6"
        strokeDasharray="1.6 2.6"
      />
      <path
        d="M0 48h100M0 64h100M0 80h100"
        stroke="#dadada"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function MailIcon(e: P) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden {...e}>
      <rect width="100" height="100" fill="url(#mac-mail)" />
      <rect x="16" y="28" width="68" height="46" rx="5" fill="#fff" />
      <path
        d="M18 31l32 25 32-25"
        stroke="#1e7cf2"
        strokeOpacity=".35"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon(e: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...e}>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z"
      />
    </svg>
  );
}

let STROKE = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const,
  AppleIcon = (e: P) => (
    <svg viewBox="0 0 814 1000" aria-hidden {...e}>
      <path
        fill="currentColor"
        d="M788 341c-6 5-110 63-110 192 0 150 132 203 136 204-1 3-21 72-70 143-44 62-90 124-160 124s-88-40-169-40c-79 0-107 41-171 41s-109-58-160-130C60 790 0 656 0 529c0-204 133-312 264-312 70 0 128 46 172 46 42 0 107-49 187-49 30 0 138 3 165 124zM557 160c32-38 55-91 55-144 0-7-1-15-2-21-52 2-114 35-151 78-29 33-57 86-57 140 0 8 1 16 2 19 3 1 9 1 13 1 47 0 106-31 140-73z"
      />
    </svg>
  ),
  BatteryIcon = (e: P) => (
    <svg viewBox="0 0 28 14" aria-hidden {...e}>
      <rect
        x=".75"
        y=".75"
        width="23.5"
        height="12.5"
        rx="3.6"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".45"
        strokeWidth="1.2"
      />
      <rect x="2.5" y="2.5" width="16" height="9" rx="2" fill="currentColor" />
      <path
        d="M26 5v4"
        stroke="currentColor"
        strokeOpacity=".45"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  WifiIcon = (e: P) => (
    <svg viewBox="0 0 18 14" aria-hidden {...e}>
      <path
        d="M9 13.2 6.3 10.1a3.9 3.9 0 0 1 5.4 0zM3.9 7.5a7.3 7.3 0 0 1 10.2 0l-1.5 1.7a5 5 0 0 0-7.2 0zM1.3 4.6a11 11 0 0 1 15.4 0l-1.5 1.7a8.7 8.7 0 0 0-12.4 0z"
        fill="currentColor"
      />
    </svg>
  ),
  SearchIcon = (e: P) => (
    <svg viewBox="0 0 16 16" aria-hidden {...e}>
      <circle cx="6.8" cy="6.8" r="5" {...STROKE} strokeWidth={1.7} />
      <path d="m10.5 10.5 4 4" {...STROKE} strokeWidth={1.9} />
    </svg>
  ),
  ControlIcon = (e: P) => (
    <svg viewBox="0 0 18 16" aria-hidden {...e}>
      <rect
        x="1"
        y="1.5"
        width="16"
        height="5.6"
        rx="2.8"
        {...STROKE}
        strokeWidth={1.3}
      />
      <circle cx="13.9" cy="4.3" r="1.7" fill="currentColor" />
      <rect
        x="1"
        y="8.9"
        width="16"
        height="5.6"
        rx="2.8"
        {...STROKE}
        strokeWidth={1.3}
      />
      <circle cx="4.1" cy="11.7" r="1.7" fill="currentColor" />
    </svg>
  ),
  ChevLeft = (e: P) => (
    <svg viewBox="0 0 16 16" aria-hidden {...e}>
      <path d="M10 2.5 4.5 8l5.5 5.5" {...STROKE} strokeWidth={1.9} />
    </svg>
  ),
  ChevRight = (e: P) => (
    <svg viewBox="0 0 16 16" aria-hidden {...e}>
      <path d="m6 2.5 5.5 5.5L6 13.5" {...STROKE} strokeWidth={1.9} />
    </svg>
  ),
  ChevDown = (e: P) => (
    <svg viewBox="0 0 16 16" aria-hidden {...e}>
      <path d="m4 6 4 4 4-4" {...STROKE} strokeWidth={1.6} />
    </svg>
  ),
  GridIcon = (e: P) => (
    <svg viewBox="0 0 18 18" aria-hidden {...e}>
      {[2, 10].map((e) =>
        [2, 10].map((t) => (
          <rect
            key={`${e}${t}`}
            x={e}
            y={t}
            width="6"
            height="6"
            rx="1.4"
            {...STROKE}
            strokeWidth={1.4}
          />
        )),
      )}
    </svg>
  ),
  ListIcon = (e: P) => (
    <svg viewBox="0 0 20 18" aria-hidden {...e}>
      <rect
        x="1.5"
        y="2"
        width="6"
        height="6"
        rx="1.3"
        {...STROKE}
        strokeWidth={1.4}
      />
      <rect
        x="1.5"
        y="10"
        width="6"
        height="6"
        rx="1.3"
        {...STROKE}
        strokeWidth={1.4}
      />
      <path
        d="M11 4h7.5M11 7h5M11 12h7.5M11 15h5"
        {...STROKE}
        strokeWidth={1.4}
      />
    </svg>
  ),
  ShareIcon = (e: P) => (
    <svg viewBox="0 0 16 20" aria-hidden {...e}>
      <path d="M8 1.5v11M4.5 5 8 1.5 11.5 5" {...STROKE} />
      <path
        d="M5 8H3.5A1.5 1.5 0 0 0 2 9.5v7A1.5 1.5 0 0 0 3.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12.5 8H11"
        {...STROKE}
      />
    </svg>
  ),
  TagIcon = (e: P) => (
    <svg viewBox="0 0 18 18" aria-hidden {...e}>
      <path
        d="M2 3.2V8a1.6 1.6 0 0 0 .5 1.1l6.4 6.4a1.6 1.6 0 0 0 2.2 0l4.4-4.4a1.6 1.6 0 0 0 0-2.2L9.1 2.5A1.6 1.6 0 0 0 8 2H3.2A1.2 1.2 0 0 0 2 3.2z"
        {...STROKE}
        strokeWidth={1.4}
      />
      <circle cx="5.6" cy="5.6" r="1.2" fill="currentColor" />
    </svg>
  ),
  ActionIcon = (e: P) => (
    <svg viewBox="0 0 20 20" aria-hidden {...e}>
      <circle cx="10" cy="10" r="8.2" {...STROKE} strokeWidth={1.4} />
      {[6, 10, 14].map((e) => (
        <circle key={e} cx={e} cy="10" r="1.15" fill="currentColor" />
      ))}
    </svg>
  ),
  SideFolderIcon = (e: P) => (
    <svg viewBox="0 0 18 16" aria-hidden {...e}>
      <path
        d="M1.8 3.4c0-.9.7-1.6 1.6-1.6h3.4c.5 0 .9.2 1.2.5l1 1.1h5.7c.9 0 1.6.7 1.6 1.6v7.6c0 .9-.7 1.6-1.6 1.6H3.4c-.9 0-1.6-.7-1.6-1.6z"
        {...STROKE}
        strokeWidth={1.4}
      />
      <path d="M1.8 6.3h14.4" {...STROKE} strokeWidth={1.4} />
    </svg>
  ),
  SideNoteIcon = (e: P) => (
    <svg viewBox="0 0 16 18" aria-hidden {...e}>
      <path
        d="M3.5 1.5h6l4 4v10a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1z"
        {...STROKE}
        strokeWidth={1.4}
      />
      <path d="M9.5 1.5v4h4M5 9.5h6M5 12.5h6" {...STROKE} strokeWidth={1.3} />
    </svg>
  ),
  BulletsIcon = (e: P) => (
    <svg viewBox="0 0 20 16" aria-hidden {...e}>
      <path d="M6.5 3h12M6.5 8h12M6.5 13h12" {...STROKE} strokeWidth={1.4} />
      {[3, 8, 13].map((e) => (
        <circle key={e} cx="2.4" cy={e} r="1.1" fill="currentColor" />
      ))}
    </svg>
  ),
  TrashIcon = (e: P) => (
    <svg viewBox="0 0 16 18" aria-hidden {...e}>
      <path
        d="M1.5 4h13M6 4V2.4c0-.5.4-.9.9-.9h2.2c.5 0 .9.4.9.9V4M3 4l.8 11.6c.1.8.7 1.4 1.5 1.4h5.4c.8 0 1.4-.6 1.5-1.4L13 4M6.5 7.5v6M9.5 7.5v6"
        {...STROKE}
        strokeWidth={1.4}
      />
    </svg>
  ),
  ComposeIcon = (e: P) => (
    <svg viewBox="0 0 20 20" aria-hidden {...e}>
      <path
        d="M9 3H4.5A2.5 2.5 0 0 0 2 5.5v10A2.5 2.5 0 0 0 4.5 18h10a2.5 2.5 0 0 0 2.5-2.5V11"
        {...STROKE}
        strokeWidth={1.4}
      />
      <path
        d="M15.6 2.2a1.5 1.5 0 0 1 2.1 2.1l-7.4 7.5-2.9.8.8-2.9z"
        {...STROKE}
        strokeWidth={1.4}
      />
    </svg>
  ),
  FontIcon = (e: P) => (
    <svg viewBox="0 0 22 16" aria-hidden {...e}>
      <path d="m1.5 14 5-12 5 12M3.4 10h6.2" {...STROKE} strokeWidth={1.5} />
      <path
        d="M19.6 14V9.4a2.6 2.6 0 0 0-5-1M19.6 11.2c-3.6-.3-5.6.4-5.6 1.7 0 1.1.9 1.6 2 1.6 2 0 3.6-1.3 3.6-3.3"
        {...STROKE}
        strokeWidth={1.4}
      />
    </svg>
  ),
  ChecklistIcon = (e: P) => (
    <svg viewBox="0 0 20 18" aria-hidden {...e}>
      <path
        d="m1.5 3.5 1.6 1.6L6 2M1.5 11.5l1.6 1.6L6 10M9 4h9.5M9 12h9.5"
        {...STROKE}
        strokeWidth={1.4}
      />
    </svg>
  ),
  TableIcon = (e: P) => (
    <svg viewBox="0 0 18 18" aria-hidden {...e}>
      <rect
        x="1.5"
        y="2"
        width="15"
        height="14"
        rx="2.4"
        {...STROKE}
        strokeWidth={1.4}
      />
      <path
        d="M1.5 7h15M1.5 11.5h15M7 7v9M12 7v9"
        {...STROKE}
        strokeWidth={1.3}
      />
    </svg>
  ),
  LockIcon = (e: P) => (
    <svg viewBox="0 0 16 18" aria-hidden {...e}>
      <rect
        x="2"
        y="8"
        width="12"
        height="8.5"
        rx="1.8"
        {...STROKE}
        strokeWidth={1.4}
      />
      <path
        d="M4.8 8V5.2a3.2 3.2 0 0 1 6.4 0V8"
        {...STROKE}
        strokeWidth={1.4}
      />
    </svg>
  );

export { FolderIcon, DocIcon, IconDefs, NotesIcon, MailIcon, XIcon, AppleIcon, BatteryIcon, WifiIcon, SearchIcon, ControlIcon, GridIcon, ListIcon, ShareIcon, TagIcon, ActionIcon, SideFolderIcon, SideNoteIcon, BulletsIcon, TrashIcon, ComposeIcon, FontIcon, ChecklistIcon, TableIcon, LockIcon, STROKE, ChevLeft, ChevRight, ChevDown };
