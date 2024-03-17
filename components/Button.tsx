import { cn } from "@/utils/utils"

type ButtonParams = {
  text?: string
  onClick?: () => Promise<any> | void,
  isLoading?: boolean
  className?: string
  loadingClassName?: string
}

const Button = ({
  text,
  onClick,
  isLoading = false,
  className,
  loadingClassName = "bg-gray text-primary"
}: ButtonParams) => {
  return (
    <div
      className={cn("text-center w-full cursor-pointer rounded-lg border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90", className,  isLoading ? loadingClassName : "")}
      onClick={onClick}
    >
      {isLoading ? "Loading..." : text}
    </div>
  )
}

export default Button