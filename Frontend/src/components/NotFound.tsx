interface HeadingType {
    heading: string
}

const NotFound = ({ heading }: HeadingType) => {
  return (
    <div className="flex min-h-[240px] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7E5] text-[#9DBA1F]">
          <span className="text-lg font-semibold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Nothing is available here right now. Please check back after the user or workspace data has been loaded.
        </p>
      </div>
    </div>
  )
}

export default NotFound