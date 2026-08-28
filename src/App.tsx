import {
  OSProvider,
} from "./core/OSContext";


import DesktopShell from "./shell/DesktopShell";


export default function App() {

  return (

    <OSProvider>

      <DesktopShell />

    </OSProvider>
  );
}