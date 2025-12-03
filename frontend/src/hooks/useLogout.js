import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api.js";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
      toast.success("Logged out successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to logout");
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
