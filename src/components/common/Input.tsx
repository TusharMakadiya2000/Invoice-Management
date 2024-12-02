import { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { UseFormRegister, UseFormTrigger } from "react-hook-form";
interface Props {
  name: string;
  label?: string;
  preIcon?: string;
  labelClass?: string;
  placeholder?: string;
  error?: string;
  errorIcon?: boolean;
  register?: UseFormRegister<any>;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  type?: string;
  defaultValue?: string | number;
  showErrorPlace?: boolean;
  disabled?: boolean;
  required?: boolean;
  trigger?: UseFormTrigger<any>;
  max?: any;
  setValue?: any;
  value?: any;
}

export function Input({
  name,
  label,
  preIcon,
  onClick,
  onChange,
  value,
  labelClass,
  error,
  errorIcon,
  register,
  required,
  placeholder,
  disabled,
  className,
  id,
  type = "text",
  defaultValue,
  showErrorPlace,
  trigger,
  setValue,
  ...rest
}: Props): JSX.Element {
  const inputType = type || "";
  const [showPassword, setShowPassword] = useState(false);

  const pathname = usePathname();

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center gap-x-2 font-semibold ">
        {label && (
          <label htmlFor={name} className={`capitalize mb-1 ${labelClass} `}>
            {label}
          </label>
        )}
      </div>

      {register ? (
        <input
          type={inputType === "password" && showPassword ? "text" : inputType}
          id={id || name}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onClick={() => {
            onClick && onClick();
          }}
          {...rest}
          className={` block w-full appearance-none rounded border border-border dark:border-border-dark dark:bg-fgc-dark px-2.5 py-2
                 text-textSecondary focus:z-10 focus:border-gray-400 focus:outline-none disabled:cursor-not-allowed dark:disabled:bg-disable-dark dark:text-text-dark ${className} ${
            inputType === "password" && "pr-10"
          } ${preIcon && "pl-12 flex"} ${preIcon === "phone" && "pl-16"}`}
          {...(register &&
            register(name, {
              onChange: (e) => {
                setValue && setValue(name, e.target.value);
                // setTimeout(() => {
                trigger && trigger(name);
                // });
              },
            }))}
        />
      ) : (
        <input
          className={`w-full block appearance-none border border-border dark:border-border-dark dark:bg-bgc-dark px-5 py-2 rounded-full
        text-text focus:z-10 focus:border-gray-400 focus:outline-none disabled:cursor-not-allowed dark:disabled:bg-disable-dark dark:text-text-dark ${
          preIcon && "pl-12 flex"
        } ${className}`}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e)}
          value={defaultValue}
        />
      )}

      {preIcon && (
        <>
          {preIcon === "phone" ? (
            <span className="w-5 absolute top-1/2 transform -translate-y-1/2 left-3 ">
              {/* SVG for phone icon */}
            </span>
          ) : (
            <Icon
              icon={preIcon}
              className="w-5 absolute -mt-5 sm:-mt-5 transform -translate-y-1/2 left-4"
            />
          )}
        </>
      )}

      {inputType === "password" && (
        <div className="absolute inset-y-0 right-0 md:top-8 top-6 flex items-center pr-3">
          <Icon
            icon={showPassword ? "eye" : "eye-off"}
            onClick={() => !disabled && setShowPassword(!showPassword)}
            className="h-5 w-5 cursor-pointer"
          />
        </div>
      )}

      {inputType === "message" && (
        <Icon
          icon="send"
          className="absolute top-5 lg:mt-1.5 right-3 z-10 h-5 w-5 -translate-y-1/2 cursor-pointer -rotate-45"
        />
      )}

      {(showErrorPlace || error) && (
        <span className="text-red-300 pl-3">
          {error && (
            <>
              {errorIcon && (
                <Icon
                  icon="exclamation-circle"
                  className="absolute top-6 right-2 z-10 h-6 w-6"
                />
              )}
              <span>{error}</span>
            </>
          )}
          &nbsp;
        </span>
      )}
    </div>
  );
}
