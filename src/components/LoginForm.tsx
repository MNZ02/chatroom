import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { login } from "@/hooks/useLogin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: { username: string; password: string }) => {
    setIsPending(true);
    try {
      // Add login logic here (e.g., API call)
      const response = await login(data);
      console.log({ response });
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/home");
      }
      console.log("Form Submitted", data);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
