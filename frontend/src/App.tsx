import { Route, Routes } from "react-router-dom";
import { CreateScreen } from "./screens/CreateScreen";
import { ListScreen } from "./screens/ListScreen";
import { PasteRoute } from "./screens/PasteRoute";
import { SettingsScreen } from "./screens/SettingsScreen";
import { SignInScreen } from "./screens/SignInScreen";
import { SignUpScreen } from "./screens/SignUpScreen";
import { DesktopCreateScreen } from "./screens/desktop/DesktopCreateScreen";
import { DesktopListScreen } from "./screens/desktop/DesktopListScreen";
import { DesktopSignInScreen } from "./screens/desktop/DesktopSignInScreen";
import { DesktopSignUpScreen } from "./screens/desktop/DesktopSignUpScreen";
import { useLang } from "./i18n";
import { useIsDesktop } from "./responsive";

function CreateRoute() {
  return useIsDesktop() ? <DesktopCreateScreen /> : <CreateScreen />;
}
function ListRoute() {
  return useIsDesktop() ? <DesktopListScreen /> : <ListScreen />;
}
function SignUpRoute() {
  return useIsDesktop() ? <DesktopSignUpScreen /> : <SignUpScreen />;
}
function SignInRoute() {
  return useIsDesktop() ? <DesktopSignInScreen /> : <SignInScreen />;
}

export function App() {
  // useLang triggers re-renders on language change and applies html dir/lang on mount.
  useLang();

  return (
    <Routes>
      <Route path="/" element={<CreateRoute />} />
      <Route path="/list" element={<ListRoute />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/signin" element={<SignInRoute />} />
      <Route path="/signup" element={<SignUpRoute />} />
      <Route path="/p/:slug" element={<PasteRoute />} />
      <Route path="*" element={<CreateRoute />} />
    </Routes>
  );
}
