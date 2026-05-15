import { Route, Routes } from "react-router-dom";
import { CreateScreen } from "./screens/CreateScreen";
import { ViewScreen } from "./screens/ViewScreen";
import { ListScreen } from "./screens/ListScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { useLang } from "./i18n";

export function App() {
  // useLang triggers re-renders on language change and applies html dir/lang on mount.
  useLang();

  return (
    <Routes>
      <Route path="/" element={<CreateScreen />} />
      <Route path="/list" element={<ListScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/p/:slug" element={<ViewScreen />} />
      <Route path="*" element={<CreateScreen />} />
    </Routes>
  );
}
