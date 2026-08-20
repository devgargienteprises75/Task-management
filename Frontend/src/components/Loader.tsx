import { cn } from "@/lib/cn"

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const Loader = ({ className, size = 'md', text, fullScreen = false }: LoaderProps) => {
  
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4"
  }

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div 
        className={cn(
          "rounded-full border-gray-200 border-t-[#D1F53B] dark:border-gray-700 dark:border-t-blue-500 animate-spin",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#0A0A0F]/80 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return (
    <div className="flex-1 w-full h-full min-h-[250px] flex items-center justify-center p-6">
      {content}
    </div>
  )
}

export default Loader