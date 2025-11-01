import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login"
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage"
import LandingPage from "./pages/LandingPage";
import { checkAuth } from "./authSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload"
import AdminUpdate from "./components/AdminUpdate"
import AdminProblemListForUpdate from "./components/AdminProblemListForUpdate";
import Premium from "./pages/Premium";
import AdminVideoAction from "./components/AdminVideoAction";
function App() {
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

    if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  
  return(
    <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<LandingPage/>}></Route>
      <Route path="/premium" element={<Premium />} />
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminProblemListForUpdate /> : <Navigate to="/" />} />
      <Route path="/admin/update/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
      <Route path="/admin/video-action/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminVideoAction /> : <Navigate to="/" />} />
      <Route path="/problem/:id" element={isAuthenticated ?<ProblemPage></ProblemPage>:<Navigate to="/signup" />}></Route>
    </Routes>
    </>
  )
}

export default App
