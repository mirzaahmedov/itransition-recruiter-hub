import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { ArrowRightIcon, AtIcon, EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from "@phosphor-icons/react";
import type { UserRegisterPayload } from "@rh/shared/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const AuthRegisterForm = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const form = useForm<UserRegisterPayload>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const togglePasswordHidden = () => setIsPasswordHidden((prev) => !prev);

  return (
    <Form className="flex w-full flex-col gap-4">
      <Field>
        <InputGroup>
          <Input size="lg" placeholder="Enter your name" type="text" />
          <InputGroupAddon>
            <UserIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
      <Field>
        <InputGroup>
          <Input size="lg" placeholder="Enter your email" type="email" />
          <InputGroupAddon>
            <AtIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
      <Field>
        <InputGroup>
          <Input size="lg" placeholder="Enter your password" type={isPasswordHidden ? "password" : "text"} />
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
      <Button size="lg" className="w-full" type="submit">
        Login
        <ArrowRightIcon />
      </Button>
    </Form>
  );
};
