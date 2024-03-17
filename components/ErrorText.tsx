import { cn } from "@/utils/utils";

interface ErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
}

const ErrorText = ({ children, className, ...props }: ErrorTextProps) => {
    return (
        <p className={cn("text-sm text-danger", className)} {...props}>
            {children}
        </p>
    );
} 

export default ErrorText;