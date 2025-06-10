import { useGoogleLogin } from "@react-oauth/google";

export default function App() {
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (token) => {
      console.log(token);
    },
  });

  return (
    <div>
      <button
        onClick={() => {
          loginWithGoogle();
        }}
      >
        Login with google
      </button>
    </div>
  );
}
