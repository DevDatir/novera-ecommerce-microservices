export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
      <div className="h-64 skeleton w-full" />
      <div className="p-5 space-y-3">
        <div className="h-3 skeleton w-1/3" />
        <div className="h-5 skeleton w-3/4" />
        <div className="h-4 skeleton w-full" />
        <div className="pt-2 flex justify-between items-center">
          <div className="h-6 skeleton w-1/4" />
          <div className="h-8 skeleton w-1/3 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="h-5 skeleton w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="h-[450px] skeleton rounded-3xl" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 skeleton rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-4 skeleton w-24" />
          <div className="h-10 skeleton w-3/4" />
          <div className="h-6 skeleton w-1/3" />
          <div className="h-8 skeleton w-28" />
          <div className="h-24 skeleton w-full rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 skeleton w-1/4" />
            <div className="h-10 skeleton w-full rounded-xl" />
          </div>
          <div className="h-14 skeleton w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 skeleton w-3/4" />
        </td>
      ))}
    </tr>
  );
};