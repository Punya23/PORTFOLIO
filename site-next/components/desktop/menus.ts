import { person } from "@/content/punya";
import { FOLDERS, type WinState } from "./data";
import type { Menu, MenuItem } from "./views";

type Args = {
  appName: string;
  top: WinState | null;
  wins: WinState[];
  launch: (app: WinState["app"], target?: string) => void;
  close: (id: number) => void;
  focus: (id: number) => void;
  patch: (id: number, patch: Partial<WinState>) => void;
  closeApp: (app: WinState["app"]) => void;
};

/** Menu-bar menus for the frontmost app (Finder or Notes). Entries with `off` render greyed out and inert. */
export function buildMenus({ appName, top, wins, launch, close, focus, patch, closeApp }: Args): Menu[] {
  const isNotes = appName === "Notes";
  const finder = top?.app === "finder" ? top : null;
  return [
    {
      id: "app",
      title: appName,
      items: [
        { label: `About ${appName}` },
        "-",
        { label: "Settings…", keys: "⌘," },
        "-",
        ...(isNotes ? [] : [{ label: "Empty Bin…", keys: "⇧⌘⌫", off: true }, "-" as const]),
        { label: "Services", sub: true },
        "-",
        { label: `Hide ${appName}`, keys: "⌘H" },
        { label: "Hide Others", keys: "⌥⌘H" },
        { label: "Show All", off: true },
        ...(isNotes ? ["-" as const, { label: "Quit Notes", keys: "⌘Q", run: () => closeApp("notes") }] : []),
      ],
    },
    {
      id: "file",
      title: "File",
      items: [
        isNotes
          ? { label: "New Note", keys: "⌘N", off: true }
          : { label: "New Finder Window", keys: "⌘N", run: () => launch("finder", FOLDERS[0].id) },
        { label: "New Folder", keys: "⇧⌘N", off: true },
        "-",
        { label: "Close Window", keys: "⌘W", off: !top, run: () => top && close(top.id) },
      ],
    },
    {
      id: "edit",
      title: "Edit",
      items: [
        { label: "Undo", keys: "⌘Z", off: true },
        { label: "Redo", keys: "⇧⌘Z", off: true },
        "-",
        { label: "Cut", keys: "⌘X", off: true },
        { label: "Copy", keys: "⌘C", off: true },
        { label: "Paste", keys: "⌘V", off: true },
        { label: "Select All", keys: "⌘A", off: true },
      ],
    },
    ...(isNotes
      ? [
          {
            id: "format",
            title: "Format",
            items: [
              { label: "Title", keys: "⇧⌘T", off: true },
              { label: "Heading", keys: "⇧⌘H", off: true },
              { label: "Body", keys: "⇧⌘B", off: true },
              "-" as const,
              { label: "Checklist", keys: "⇧⌘L", off: true },
            ],
          },
        ]
      : []),
    {
      id: "view",
      title: "View",
      items: [
        { label: "as Icons", keys: "⌘1", check: true },
        { label: "as List", keys: "⌘2", off: true },
        { label: "as Columns", keys: "⌘3", off: true },
        { label: "as Gallery", keys: "⌘4", off: true },
        "-",
        { label: "Show Preview", keys: "⇧⌘P", check: true },
      ],
    },
    ...(isNotes
      ? []
      : [
          {
            id: "go",
            title: "Go",
            items: [
              {
                label: "Back",
                keys: "⌘[",
                off: !finder || finder.hi === 0,
                run: () => finder && patch(finder.id, { hi: finder.hi - 1 }),
              },
              {
                label: "Forward",
                keys: "⌘]",
                off: !finder || finder.hi >= finder.hist.length - 1,
                run: () => finder && patch(finder.id, { hi: finder.hi + 1 }),
              },
              "-" as const,
              ...FOLDERS.map((f) => ({ label: f.name, run: () => launch("finder", f.id) })),
              "-" as const,
              { label: "Experience", run: () => launch("notes", "experience") },
              { label: "Highlights", run: () => launch("notes", "highlights") },
            ],
          },
        ]),
    {
      id: "window",
      title: "Window",
      items: [
        {
          label: "Minimise",
          keys: "⌘M",
          off: !top || top.app === "about",
          run: () => top && patch(top.id, { min: true }),
        },
        {
          label: "Zoom",
          off: !top || top.app === "about",
          run: () => top && patch(top.id, { max: !top.max }),
        },
        "-",
        { label: "Bring All to Front" },
        ...(wins.length ? ["-" as const] : []),
        ...[...wins]
          .sort((a, b) => a.id - b.id)
          .map((w) => ({
            label:
              w.app === "about"
                ? "About This Mac"
                : w.app === "notes"
                  ? "Notes"
                  : (FOLDERS.find((f) => f.id === w.hist[w.hi])?.name ?? "Finder"),
            check: w.id === top?.id,
            run: () => focus(w.id),
          })),
      ],
    },
    { id: "help", title: "Help", items: [{ label: `${appName} Help` }, { label: "Tips for Your Mac" }] },
  ];
}

/** The Apple-logo menu. Only "About This Mac" does anything. */
export const appleMenu = (launch: Args["launch"]): MenuItem[] => [
  { label: "About This Mac", run: () => launch("about") },
  "-",
  { label: "System Settings…" },
  { label: "App Store…" },
  "-",
  { label: "Recent Items", sub: true },
  "-",
  { label: "Force Quit…", keys: "⌥⌘⎋" },
  "-",
  { label: "Sleep" },
  { label: "Restart…" },
  { label: "Shut Down…" },
  "-",
  { label: "Lock Screen", keys: "⌃⌘Q" },
  { label: `Log Out ${person.first}…`, keys: "⇧⌘Q" },
];
