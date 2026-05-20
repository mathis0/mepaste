import { Route, Routes } from "react-router-dom";
import { CreateScreen } from "./screens/CreateScreen";
import { AboutScreen } from "./screens/AboutScreen";
import { PasteRoute } from "./screens/PasteRoute";
import { DesktopCreateScreen } from "./screens/desktop/DesktopCreateScreen";
import { useLang } from "./i18n";
import { useIsDesktop } from "./responsive";

function CreateRoute() {
  return useIsDesktop() ? <DesktopCreateScreen /> : <CreateScreen />;
}

export function App() {
  useLang();
  return (
    <Routes>
      <Route path="/" element={<CreateRoute />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/p/:slug" element={<PasteRoute />} />
      <Route path="*" element={<CreateRoute />} />
    </Routes>
  );
}
