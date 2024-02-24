import { cn } from "@/utils/utils"

type ButtonParams = {
  text?: string
  onClick?: () => Promise<any>,
  isLoading?: boolean
}

const Button = ({
  text,
  onClick,
  isLoading = false,
}: ButtonParams) => {
  return (
    <div
      className={cn("text-center w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90", isLoading ? "bg-gray text-primary" : "" )}
      onClick={onClick}
    >
      {isLoading ? "Loading..." : text}
    </div>
  )
}

export default Button