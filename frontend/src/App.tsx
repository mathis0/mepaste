import { Route, Routes } from "react-router-dom";
import { CreateScreen } from "./screens/CreateScreen";
import { ViewScreen } from "./screens/ViewScreen";
import { ListScreen } from "./screens/ListScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { DesktopCreateScreen } from "./screens/desktop/DesktopCreateScreen";
import { DesktopViewScreen } from "./screens/desktop/DesktopViewScreen";
import { DesktopListScreen } from "./screens/desktop/DesktopListScreen";
import { useLang } from "./i18n";
import { useIsDesktop } from "./responsive";

function CreateRoute() {
  return useIsDesktop() ? <DesktopCreateScreen /> : <CreateScreen />;
}
function ListRoute() {
  return useIsDesktop() ? <DesktopListScreen /> : <ListScreen />;
}
function ViewRoute() {
  return useIsDesktop() ? <DesktopViewScreen /> : <ViewScreen />;
}

export function App() {
  // useLang triggers re-renders on language change and applies html dir/lang on mount.
  useLang();

  return (
    <Routes>
      <Route path="/" element={<CreateRoute />} />
      <Route path="/list" element={<ListRoute />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/p/:slug" element={<ViewRoute />} />
      <Route path="*" element={<CreateRoute />} />
    </Routes>
  );
}
