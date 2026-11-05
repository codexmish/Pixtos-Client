import {
  CheckSquareIcon,
  FolderPlusIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

// -----props the bulk bar needs from the page
type BulkSelectionBarProps = {
  count: number;
  onclear: () => void;
  onFavorite: () => void;
  onAddToAlbum: () => void;
  onTrash: () => void;
};

const BulkSelectionBar = ({
  count,
  onclear,
  onFavorite,
  onAddToAlbum,
  onTrash,
}: BulkSelectionBarProps) => {
  if (count === 0) return null;
  return (
    <div className="bulk-bar-container">
      <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
        <button
          onClick={onclear}
          type="button"
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"
          title="Clear Selection"
        >
          <XIcon className="size-3.5" />
        </button>
        <span className="text-sm font-medium text-red-600 flex items-center gap-1.5">
          <CheckSquareIcon className="size-3.5" />
          {count} Selected
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button onClick={onFavorite} type="button" className="bulk-bar-btn">
          <StarIcon className="size-3.5 text-slate-500" />
          <span className="hidden sm:inline">Favorite</span>
        </button>

        <button onClick={onAddToAlbum} type="button" className="bulk-bar-btn">
          <FolderPlusIcon className="size-3.5 text-slate-600" />
          <span className="hidden sm:inline">Add To Album</span>
        </button>

        <button onClick={onTrash} type="button" className="bulk-bar-btn">
          <Trash2Icon className="size-3.5 text-slate-600" />
          <span className="hidden sm:inline">Move To Trash</span>
        </button>
      </div>
    </div>
  );
};

export default BulkSelectionBar;
