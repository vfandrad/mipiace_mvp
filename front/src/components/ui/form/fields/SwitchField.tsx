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
import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.ComponentPropsWithoutRef<typeof Switch> {
  name: TName;
  label: string;
  description?: string;
  required?: boolean;
}

export function SwitchField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  required,
  ...props
}: SwitchFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      rules={{
        required: required ? "Este campo é obrigatório" : false,
      }}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
