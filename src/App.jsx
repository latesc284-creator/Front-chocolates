import AppRouter from "./Routes/Navigate"
import { AuthProvider } from "./Context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>

  )
}
