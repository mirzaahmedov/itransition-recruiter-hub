import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { ArrowRightIcon, AtIcon, EyeIcon, EyeSlashIcon, KeyIcon } from "@phosphor-icons/react";
import type { UserLoginPayload } from "@rh/shared/schemas";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const AuthLoginForm = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordHidden = () => setIsPasswordHidden((prev) => !prev);

  const form = useForm<UserLoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form className="flex w-full flex-col gap-4">
      <Field>
        <InputGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Input size="lg" placeholder="Enter your email" type="email" onBlur={field.onBlur} value={field.value} onValueChange={field.onChange} />
            )}
          />
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
