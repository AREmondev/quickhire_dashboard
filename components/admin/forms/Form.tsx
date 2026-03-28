"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import type { DefaultValues } from "react-hook-form";

interface FormProps<T extends Record<string, unknown>> {
    schema: ZodType<T>;
    defaultValues: DefaultValues<T>;
    onSubmit: (data: T) => Promise<void> | void;
    children: React.ReactNode;
    className?: string;
}

export function Form<T extends Record<string, unknown>>({
    schema,
    defaultValues,
    onSubmit,
    children,
    className,
}: FormProps<T>) {
    const methods = useForm<T>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema as any),
        defaultValues,
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className={className} noValidate>
                {children}
            </form>
        </FormProvider>
    );
}
