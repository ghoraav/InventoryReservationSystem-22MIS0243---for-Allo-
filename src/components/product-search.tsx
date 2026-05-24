"use client";

interface Props {
  search: string;

  setSearch: (
    value: string
  ) => void;

  showAvailableOnly: boolean;

  setShowAvailableOnly: (
    value: boolean
  ) => void;

  showLowStockOnly: boolean;

  setShowLowStockOnly: (
    value: boolean
  ) => void;
}

export default function ProductSearch({
  search,
  setSearch,
  showAvailableOnly,
  setShowAvailableOnly,
  showLowStockOnly,
  setShowLowStockOnly,
}: Props) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-5">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-white"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) =>
              setShowAvailableOnly(
                e.target.checked
              )
            }
          />

          Available Only
        </label>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) =>
              setShowLowStockOnly(
                e.target.checked
              )
            }
          />

          Low Stock Only
        </label>
      </div>
    </div>
  );
}