import { Button } from "@/components/ui/Button";
import useAuthMutation from "@/hooks/mutation/useAuthMutation";
import { useGoogleLogin } from "@react-oauth/google";

export default function PageLogin() {
  const { loginWithGoogleMutation } = useAuthMutation();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (data) => {
      loginWithGoogleMutation.mutate(data.access_token);
    },
  });

  return (
    <div>
      <Button onClick={() => loginWithGoogle()}>Login With Google</Button>
    </div>
  );
}
