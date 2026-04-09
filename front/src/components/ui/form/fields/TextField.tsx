import * as React from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.ComponentProps<typeof Input> {
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
}

export function TextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  required,
  ...props
}: TextFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      rules={{
        required: required ? "Este campo é obrigatório" : false,
      }}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
