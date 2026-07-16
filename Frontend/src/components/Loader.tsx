import { cn } from "@/lib/cn"

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader = ({ className, size = 'md' }: LoaderProps) => {
  
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4"
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div 
        className={cn(
          "rounded-full border-gray-100 border-t-[#D1F53B] animate-spin",
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export default Loader