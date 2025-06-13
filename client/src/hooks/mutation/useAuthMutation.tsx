import { API } from "@/lib/API";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useAuthMutation() {
  const navigate = useNavigate();
  const loginWithGoogleMutation = useMutation({
    mutationFn: (googleAccessToken: string) =>
      API.post("/auth/login/google", {
        googleToken: googleAccessToken,
      }),
    onSuccess: () => navigate("/dashboard"),
    onError: () => toast.error("Failed to Login to Your Account"),
  });

  return { loginWithGoogleMutation };
}
