import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import GuestForm from "./pages/GuestForm";
import AdminDashboard from "./pages/AdminDashboard";
import CreateForm from "./pages/CreateForm";
import ResponsePage from "./pages/ResponsePage";
import ViewForm from "./pages/ViewForm";

import { axiosInstance } from "./lib/axios";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/form/:token" element={<GuestForm />} />

        {/* protected admin route */}

        <Route path="/dashboard" element={<AdminDashboard />}></Route>
        <Route path="/forms/create" element={<CreateForm />}></Route>
        <Route path="/forms/:id" element={<ViewForm />}></Route>
        <Route path="/forms/:id/responses" element={<ResponsePage />}></Route>

        {/* redirect */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
