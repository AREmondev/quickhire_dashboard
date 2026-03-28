"use client";
import { useFormContext, Controller } from "react-hook-form";
import { clsx } from "clsx";

interface FieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  hint?: string;
}

const getNestedError = (errors: any, name: string) => {
  return name.split(".").reduce((acc, part) => acc?.[part], errors);
};

export function TextField({
  name,
  label,
  placeholder,
  type = "text",
  required,
  className,
  hint,
  ...props
}: FieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = getNestedError(errors, name);

  const { onChange, ...registerProps } = register(name);

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-100">
        {label}
        {required && <span className="text-accent-red ml-0.5">*</span>}
      </label>
      <input
        {...registerProps}
        onChange={(e) => {
          onChange(e);
          props.onChange?.(e as any);
        }}
        type={type}
        placeholder={placeholder}
        className={clsx(
          "px-3 py-2.5 text-sm rounded-lg border bg-white outline-none transition-all",
          "placeholder:text-neutral-60 text-neutral-100",
          error
            ? "border-accent-red focus:ring-2 focus:ring-accent-red/20"
            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
        )}
        {...(props as any)}
      />
      {hint && !error && <p className="text-xs text-neutral-60">{hint}</p>}
      {error && (
        <p className="text-xs text-accent-red">{String(error.message)}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends FieldProps {
  rows?: number;
}

export function TextAreaField({
  name,
  label,
  placeholder,
  rows = 4,
  required,
  className,
  hint,
}: TextAreaProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = getNestedError(errors, name);

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-100">
        {label}
        {required && <span className="text-accent-red ml-0.5">*</span>}
      </label>
      <textarea
        {...register(name)}
        rows={rows}
        placeholder={placeholder}
        className={clsx(
          "px-3 py-2.5 text-sm rounded-lg border bg-white outline-none transition-all resize-vertical",
          "placeholder:text-neutral-60 text-neutral-100",
          error
            ? "border-accent-red focus:ring-2 focus:ring-accent-red/20"
            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
        )}
      />
      {hint && !error && <p className="text-xs text-neutral-60">{hint}</p>}
      {error && (
        <p className="text-xs text-accent-red">{String(error.message)}</p>
      )}
    </div>
  );
}

interface SelectFieldProps extends FieldProps {
  options: { value: string; label: string }[];
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  required,
  className,
}: SelectFieldProps) {
  const {
    register,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const error = getNestedError(errors, name);
  console.log("getValues", options);
  console.log("watch", watch(name));
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-100">
        {label}
        {required && <span className="text-accent-red ml-0.5">*</span>}
      </label>
      <select
        {...register(name)}
        className={clsx(
          "px-3 py-2.5 text-sm rounded-lg border bg-white outline-none transition-all cursor-pointer",
          "text-neutral-100",
          error
            ? "border-accent-red focus:ring-2 focus:ring-accent-red/20"
            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-accent-red">{String(error.message)}</p>
      )}
    </div>
  );
}

interface MultiSelectFieldProps extends FieldProps {
  options: { value: string; label: string }[];
}

export function MultiSelectField({
  name,
  label,
  options,
  className,
}: MultiSelectFieldProps) {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const selected: string[] = (getValues(name) as string[]) || [];
  const error = getNestedError(errors, name);

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    setValue(name, next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-100">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isActive = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={clsx(
                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                isActive
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-white border-border text-neutral-80 hover:border-primary hover:text-primary",
              )}
              title={o.label}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-accent-red">{String(error.message)}</p>
      )}
    </div>
  );
}

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  className?: string;
}

export function CheckboxField({
  name,
  label,
  className,
  ...props
}: CheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label
          className={clsx(
            "flex items-center gap-2.5 cursor-pointer select-none",
            className,
          )}
        >
          <input
            {...field}
            type="checkbox"
            checked={!!field.value}
            onChange={(e) => {
              field.onChange(e.target.checked);
              props.onChange?.(e);
            }}
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <span className="text-sm text-neutral-80">{label}</span>
        </label>
      )}
    />
  );
}
