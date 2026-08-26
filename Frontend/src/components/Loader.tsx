import { cn } from "@/lib/cn"

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const Loader = ({ className, size = 'md', text, fullScreen = false }: LoaderProps) => {
  
  const sizeClasses = {
    sm: "w-4 h-4 border-[2px]",
    md: "w-6 h-6 border-[2px]",
    lg: "w-9 h-9 border-[2.5px]",
    xl: "w-12 h-12 border-[3px]"
  }

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-2.5", className)}>
      <div 
        className={cn(
          "rounded-full border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 animate-spin",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return (
    <div className="flex-1 w-full h-full min-h-[220px] flex items-center justify-center p-6">
      {content}
    </div>
  )
}

export default Loader