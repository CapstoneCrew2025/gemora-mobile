import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  textClassName,
  className,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  // Base styles
  const baseClasses = 'flex-row items-center justify-center rounded-lg';
  
  // Variant styles
  const variantClasses = {
    primary: isDisabled 
      ? 'bg-gray-300' 
      : 'bg-green-600 active:bg-green-700',
    secondary: isDisabled 
      ? 'bg-gray-200' 
      : 'bg-green-100 active:bg-green-200',
    outline: isDisabled 
      ? 'border border-gray-300 bg-transparent' 
      : 'border border-green-600 bg-transparent active:bg-green-50',
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // Text styles
  const textBaseClasses = 'font-semibold text-center';
  const textVariantClasses = {
    primary: isDisabled ? 'text-gray-500' : 'text-white',
    secondary: isDisabled ? 'text-gray-400' : 'text-green-700',
    outline: isDisabled ? 'text-gray-400' : 'text-green-600',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;
  const textClasses = `${textBaseClasses} ${textVariantClasses[variant]} ${textSizeClasses[size]} ${textClassName || ''}`;

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : '#16a34a'} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text className={textClasses}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};
