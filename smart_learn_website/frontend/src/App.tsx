import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context";
import AppRoutes from "./AppRoutes.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        {" "}
        {/* for Electron compatibility */}
        <AppRoutes />
      </HashRouter>
      <Toaster position="top-center" richColors expand={true} />
    </AuthProvider>
  );
}

export default App;
