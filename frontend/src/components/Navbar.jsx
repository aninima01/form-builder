import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";
import {
  LogOutIcon,
  MessageSquareText,
  Plus,
  Menu,
  UserCircle,
  Sparkles,
} from "lucide-react";
import useLogout from "../hooks/useLogout.js";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">FormCraft</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/forms/create">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/20 transition flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">New Form</span>
              </button>
            </Link>

            {authUser && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
                <UserCircle className="h-5 w-5 text-white/70" />
                <span className="text-sm text-white/80">
                  {authUser?.fullName}
                </span>
              </div>
            )}

            <button
              className="p-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/20 transition"
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-5 w-5 text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
