import { cn } from "@/utils/utils"

type ErrorAlertParams = {
  isVisible?: boolean
  text?: string
  onClick?: any
  className?: string
}

const ErrorAlert = ({
  isVisible,
  text,
  onClick,
  className
}: ErrorAlertParams) => (
  <div
    className={cn(
      "bg-danger py-5 text-center rounded-lg cursor-pointer transition duration-300 ease-in-out", !isVisible && "hidden", className)
    }
    onClick={onClick}
  >
    <p className="text-white font-medium">{text}</p>
  </div>
)

export default ErrorAlert