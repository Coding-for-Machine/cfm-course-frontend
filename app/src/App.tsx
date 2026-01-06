import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProblemDetail from "./pages/ProblemDetail";
import Problems from "./pages/Problems";
import Contests from "./pages/Contests";
import PostDetail from "./pages/PostDetail";
import Posts from "./pages/Posts";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:slug" element={<ProblemDetail />} />

          {/* post */}
          <Route path="/posts" element={<Posts />} />
          <Route path="/post:slug" element={<PostDetail />} />

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
