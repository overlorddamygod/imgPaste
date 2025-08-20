import { FC, ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode,
    type?: "button" | "submit" | "reset",
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
}


export const PrimaryButton: FC<ButtonProps> = ({ children, type = "button", onClick, className }) => {
    return (
        <button type={type} onClick={onClick} className={`bg-primary px-4 py-2 rounded-md font-bold hover:scale-105 transition-all ${className}`}>{children}</button>
    )
}

export const SecondaryButton: FC<ButtonProps> = ({ children, type = "button", onClick, className }) => {
    return (
        <button type={type} onClick={onClick} className={`hover:bg-primary px-4 py-2 rounded-md font-bold${className}}`}>{children}</button>
    )
}