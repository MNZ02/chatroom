import LoginForm from "@/components/LoginForm";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link to="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <img src="/logo.jpeg" alt="Logo" width={40} height={40} />
        <span className="sr-only">Home</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
