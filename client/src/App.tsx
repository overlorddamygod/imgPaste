import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages";
import './App.css'
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CreatePost from "./pages/CreatePost";
import { useAuth } from "./state";
import PostPage from "./pages/PostPage";
import PostItemPage from "./pages/PostItemPage";

function App() {
  const {isLoggedIn} = useAuth();
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/create-post" element={<CreatePost/>} />
          <Route path="/p/:id" element={<PostPage/>} />
          <Route path="/p/:postId/i/:postItemId" element={<PostItemPage/>} />
          {!isLoggedIn() && <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
