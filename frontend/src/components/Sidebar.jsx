import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import {
  LayoutDashboard,
  ClipboardPlus,
  ClipboardList,
  MessageSquareText,
  UserCircle,
  Sparkles,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">FormCraft</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            currentPath === "/"
              ? "bg-white text-black"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          <LayoutDashboard className="size-5" />
          <span className="font-medium">Home</span>
        </Link>

        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            currentPath === "/dashboard"
              ? "bg-white text-black"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          <ClipboardList className="size-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/forms/create"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            currentPath === "/forms/create"
              ? "bg-white text-black"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          <ClipboardPlus className="size-5" />
          <span className="font-medium">Create Form</span>
        </Link>
      </nav>

      {authUser && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-white/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {authUser?.fullName}
              </p>
              <p className="text-xs text-white/60 truncate">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
