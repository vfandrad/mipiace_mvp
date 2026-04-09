import * as React from "react";
import { UseFormReturn, FieldValues, SubmitHandler } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface RootFormProps<
  TFieldValues extends FieldValues = FieldValues,
> extends UseFormReturn<TFieldValues> {
  onSubmit: SubmitHandler<TFieldValues>;
  children: React.ReactNode;
  className?: string;
}

export function RootForm<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  children,
  className,
  ...props
}: RootFormProps<TFieldValues>) {
  return (
    <Form {...props}>
      <form onSubmit={props.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  );
}
