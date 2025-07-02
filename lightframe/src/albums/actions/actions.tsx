import DeleteButton from './delete-button';
import { getValidToken } from '../../utils/auth';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface ActionsProps {
  selectedCount: number;
  totalCount: number;
  onDeleteSelected: () => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  albumId: string;
}

const Actions = ({ selectedCount, totalCount, onDeleteSelected, onSelectAll, onUnselectAll }: ActionsProps) => {
  const isLoggedIn = getValidToken() !== null;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const handleSelectAllToggle = () => {
    if (allSelected) {
      onUnselectAll();
    } else {
      onSelectAll();
    }
  };

  if (!isLoggedIn) {
    return null; // Don't render actions if not logged in
  }

  return (
    <div className="flex justify-between items-center py-4 mb-2">
      <div className="flex items-center gap-4">
      </div>
      
      <div className="flex items-center gap-4">
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} photo{selectedCount > 1 ? 's' : ''} selected
          </span>
        )}
        <button
          onClick={handleSelectAllToggle}
          className="flex items-center gap-2 cursor-pointer"
          title={allSelected ? 'Unselect All' : 'Select All'}
        >
          {allSelected ? (
            <CheckBoxIcon style={{ fontSize: 24, fontWeight: 'bold' }} />
          ) : (
            <CheckBoxOutlineBlankIcon style={{ fontSize: 24, fontWeight: 'bold' }} />
          )}
        </button>
        <DeleteButton
          selectedCount={selectedCount}
          onClick={onDeleteSelected}
        />
      </div>
    </div>
  );
};

export default Actions;
