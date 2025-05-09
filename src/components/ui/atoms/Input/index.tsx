'use client';

// Libraries
import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

// Utils
import { handleError } from '@/utils/handleError';

// Constants
import { REGEX } from '@/constants/regex';

const PATH = 'src/components/ui/atoms/Input/index.tsx';

interface InputProps extends AntdInputProps {
  onKeyEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  noBorder?: 'true' | 'false' | boolean;
  debounce?: number;
  label?: ReactNode;
  onAfterChange?: (value: any) => void;
  errorArchive?: string;
  required?: boolean;
  focused?: boolean;
  errorMsg?: string;
  disableUndo?: boolean;
  isPositiveNumber?: boolean;
}

const DefaultInput: React.FC<InputProps> = (props) => {
  const {
    className,
    debounce = 400,
    onKeyEnter,
    onAfterChange,
    onChange,
    onBlur,
    ...restProps
  } = props;

  const [value, setValue] = useState<any>(props.value || props.defaultValue);
  const timeoutAfterChange = useRef<any>(null);

  useEffect(() => {
    setValue(props.value || props.defaultValue);
  }, [props.value, props.defaultValue]);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const { value } = event.target;

      if (props.isPositiveNumber) {
        REGEX.POSITIVE_NUMBER.test(value) ? setValue(value) : setValue(value.slice(0, -1));
      } else {
        setValue(value);
      }
      if (props.required && !value) {
        return;
      }
      onChange?.(event);
      if (timeoutAfterChange) {
        clearTimeout(timeoutAfterChange.current);
      }

      timeoutAfterChange.current = setTimeout(() => {
        onAfterChange?.(value);
      }, debounce);
    } catch (error) {
      handleError(error, {
        path: PATH,
        name: onChangeInput.name,
        args: { event },
      });
    }
  };

  const onBlurInput: React.FocusEventHandler<HTMLInputElement> = (e) => {
    try {
      if (props.required) {
        setValue(props.value || props.defaultValue);
      }
      onBlur?.(e);
    } catch (error) {
      handleError(error, {
        path: PATH,
        name: onBlurInput.name,
        args: { e },
      });
    }
  };

  return (
    <AntdInput
      {...restProps}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onKeyEnter) {
          onKeyEnter(e);
        }
      }}
      value={value}
      onChange={onChangeInput}
      onBlur={onBlurInput}
      className={props.size ? `${className}` : `py-2 px-3 ${className || ''}`}
    />
  );
};

export const Input = DefaultInput as typeof AntdInput & React.FC<InputProps>;

Input.Password = AntdInput.Password;
