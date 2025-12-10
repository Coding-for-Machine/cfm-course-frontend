import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <- domdan
import './index.css'
import App from "./App";
import { AuthProvider } from "./context/AuthContex";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
