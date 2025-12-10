import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Arena from "./pages/Problems";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import ProtectedRoute from "./router/ProtectedRoute";
import Profile from "./pages/Profile";
import ProblemDetail from "./pages/ProblemDetail";
import Problems from "./pages/Problems";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route index element={<Home />} />
          <Route path="kurslar" element={<Courses />} />
          <Route path="arena" element={<Arena />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:slug" element={<ProblemDetail />} />

          <Route path="faq" element={<Faq />} />
          <Route path="profile" element={
            // <ProtectedRoute>
              <Profile />
            // </ProtectedRoute>
            } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}
