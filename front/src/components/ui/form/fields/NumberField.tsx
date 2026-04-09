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

interface NumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "type"> {
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
}

export function NumberField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  required,
  ...props
}: NumberFieldProps<TFieldValues, TName>) {
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
            <Input
              {...field}
              {...props}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? "" : Number(value));
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
