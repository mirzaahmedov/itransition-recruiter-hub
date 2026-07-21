import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowRightIcon, AtIcon, EyeIcon, EyeSlashIcon, KeyIcon } from "@phosphor-icons/react";
import { LoginUserSchema, type LoginUserPayload } from "@rh/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const setUserProfile = useAuthStore((store) => store.setUserProfile);
  const navigate = useNavigate();

  const form = useForm<LoginUserPayload>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      setUserProfile(res.data.user);
      navigate("/");
    },
    onError: (error: { response?: { status?: number } }) => {
      if (error.response?.status === 404) {
        toast.error("No account found with this email");
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);
  });

  const togglePasswordHidden = () => setIsPasswordHidden((prev) => !prev);

  return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <Field>
        <InputGroup>
          <Input size="lg" placeholder="Enter your email" type="email" {...form.register("email")} />
          <InputGroupAddon>
            <AtIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
      <Field>
        <InputGroup>
          <Input size="lg" placeholder="Enter your password" type={isPasswordHidden ? "password" : "text"} {...form.register("password")} />
          <InputGroupAddon>
            <KeyIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Button size="icon" variant="ghost" onClick={togglePasswordHidden}>
              {isPasswordHidden ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
      <Button loading={loginMutation.isPending} size="lg" className="w-full" type="submit">
        Login
        <ArrowRightIcon />
      </Button>
    </Form>
  );
};

export default LoginPage;
