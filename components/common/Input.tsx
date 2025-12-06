import React, { forwardRef, useMemo } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

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
    const { theme } = useTheme();
    const colors = theme.colors;

    const inputColors = useMemo(() => ({
      backgroundColor: colors.input,
      color: colors.text,
      borderColor: colors.border,
      placeholder: colors.subtext,
      label: colors.subtext,
      error: '#f87171',
    }), [colors]);

    const containerClasses = `w-full ${containerClassName || ''}`;
    const labelClasses = `text-sm font-medium mb-2 ${labelClassName || ''}`;
    const inputClasses = `w-full px-4 py-3 border rounded-lg ${
      error ? 'border-red-500' : 'border-gray-300'
    } ${inputClassName || ''} ${className || ''}`;
    const errorClasses = `text-sm mt-1 ${errorClassName || ''}`;

    return (
      <View className={containerClasses}>
        {label && (
          <Text className={labelClasses} style={{ color: inputColors.label }}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={inputClasses}
          placeholderTextColor={inputColors.placeholder}
          style={{
            backgroundColor: inputColors.backgroundColor,
            color: inputColors.color,
            borderColor: inputColors.borderColor,
          }}
          {...props}
        />
        {error && (
          <Text className={errorClasses} style={{ color: inputColors.error }}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
