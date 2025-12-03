import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      queryClient.setQueryData(["authUser"], data);

      toast.success("Account created successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  return { signupMutation, isPending };
};

export default useSignup;
