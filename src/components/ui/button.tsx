import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  children,
                                                  className,
                                                  ...props
                                              }) => {
    const baseStyle =
        'px-5 py-2 rounded-xl font-medium transition duration-200 shadow-sm';

    const variants = {
        primary: 'bg-teal-500 text-white hover:bg-teal-600',
        secondary: 'bg-white text-teal-600 border border-teal-500 hover:bg-teal-50',
    };

    return (
        <button
            className={classNames(baseStyle, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
