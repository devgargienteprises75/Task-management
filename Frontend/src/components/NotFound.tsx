import { SearchX } from "lucide-react";

interface HeadingType {
    heading: string
}

const NotFound = ({ heading }: HeadingType) => {
  return (
    <div className="flex min-h-[280px] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
          <SearchX size={18} strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-zinc-900">No {heading.toLowerCase()} found</h2>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Nothing matched your search criteria or no records are available right now.
        </p>
      </div>
    </div>
  )
}

export default NotFound