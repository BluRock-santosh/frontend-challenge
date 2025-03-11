import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues } from "../types/certificate.type";

interface InputProps {
  name: string;
  type: string;
  register: UseFormRegister<any>;
  placeholder?: string;
  label: string;
  errors: FieldErrors<FormValues>;
  customClass?: string;
}

export const CustomInput: React.FC<InputProps> = ({
  name,
  type,
  register,
  placeholder,
  label,
  errors,
  customClass,
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="block font-semibold text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type={type}
      {...register(name)}
      placeholder={placeholder}
      className={`border p-2 w-full rounded-md ${customClass}`}
    />
    {errors[name as keyof FormValues]?.message && (
      <p className="text-red-500 mt-1">
        {errors[name as keyof FormValues]?.message}
      </p>
    )}
  </div>
);
