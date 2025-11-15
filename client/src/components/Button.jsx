import React from 'react';

/**
 * Simple Button component with multiple variants and sizes
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
  ...props
}, ref) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? 'btn-disabled' : '';

  const allClasses = [baseClass, variantClass, sizeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      className={allClasses}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * Input component with label and error support
 */
export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        ref={ref}
        className={`input ${error ? 'input-error' : ''}`}
        aria-describedby={error ? 'error-message' : undefined}
        {...props}
      />
      {(error || helperText) && (
        <span
          id={error ? 'error-message' : undefined}
          className={`helper-text ${error ? 'error' : ''}`}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Card component for displaying content
 */
export const Card = ({ children, className, title, ...props }) => {
  return (
    <div className={`card ${className || ''}`} {...props}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};
