import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SANS, SURFACE, INK } from "../../theme";
import { Lang } from "../../i18n";

type Hint = [label: string, keys: string[]];

type Props = {
  lang: Lang;
  crumbs: string[];
  hints?: Hint[];
  topRight?: ReactNode;
  children: ReactNode;
};

export function DesktopFrame({ lang, crumbs, hints, topRight, children }: Props) {
  const isFa = lang === "fa";
  return (
    <div
      dir={isFa ? "rtl" : "ltr"}
      style={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        background: SURFACE,
        fontFamily: SANS,
        color: INK,
      }}
    >
      <Sidebar lang={lang} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
        }}
      >
        <TopBar crumbs={crumbs} hints={hints} right={topRight} />
        {children}
      </div>
    </div>
  );
}
