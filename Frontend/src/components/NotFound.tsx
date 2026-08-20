interface HeadingType {
    heading: string
}

const NotFound = ({ heading }: HeadingType) => {
  return (
    <div className="flex min-h-[240px] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#1F2130] bg-[#12131C] px-6 py-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
          <span className="text-lg font-bold">!</span>
        </div>
        <h2 className="text-base font-bold text-white">{heading}</h2>
        <p className="mt-2 text-xs leading-relaxed text-gray-400">
          Nothing is available here right now. Please check back after data has been loaded or create a new entry.
        </p>
      </div>
    </div>
  )
}

export default NotFound