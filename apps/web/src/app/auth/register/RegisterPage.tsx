import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { ArrowRightIcon, AtIcon, EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from "@phosphor-icons/react";
import { RegisterUserSchema, type RegisterUserPayload } from "@rh/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerUser } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const navigate = useNavigate();

  const form = useForm<RegisterUserPayload>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/auth/login");
    },
    onError: (error: { response?: { status?: number } }) => {
      if (error.response?.status === 409) {
        toast.error("An account with this email already exists");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values);
  });

  const togglePasswordHidden = () => setIsPasswordHidden((prev) => !prev);

  return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <Field>
        <InputGroup>
          <Input size="lg" placeholder="Enter your name" type="text" {...form.register("name")} />
          <InputGroupAddon>
            <UserIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
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
      <Button loading={registerMutation.isPending} size="lg" className="w-full" type="submit">
        Register
        <ArrowRightIcon />
      </Button>
    </Form>
  );
};

export default RegisterPage;
