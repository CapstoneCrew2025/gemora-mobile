import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      className,
      ...props
    },
    ref
  ) => {
    const containerClasses = `w-full ${containerClassName || ''}`;
    const labelClasses = `text-sm font-medium text-gray-700 mb-2 ${labelClassName || ''}`;
    const inputClasses = `w-full px-4 py-3 border rounded-lg bg-white text-gray-900 ${
      error ? 'border-red-500' : 'border-gray-300'
    } ${inputClassName || ''} ${className || ''}`;
    const errorClasses = `text-sm text-red-600 mt-1 ${errorClassName || ''}`;

    return (
      <View className={containerClasses}>
        {label && (
          <Text className={labelClasses}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={inputClasses}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {error && (
          <Text className={errorClasses}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
