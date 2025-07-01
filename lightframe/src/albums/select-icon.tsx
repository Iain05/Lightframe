import type { MouseEvent } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface SelectIconProps {
  selected?: boolean;
  onClick: (event: MouseEvent) => void;
}

const SelectIcon = ({ selected, onClick }: SelectIconProps) => {
  return (
    <div
      className="absolute top-2 right-2 cursor-pointer z-10"
      onClick={onClick}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
      }}
    >
      {selected ? (
        <CheckCircleIcon
          style={{
            fontSize: 28,
            color: 'white', 
          }}
        />
      ) : (
        <RadioButtonUncheckedIcon
          style={{
            fontSize: 28,
            color: 'white',
          }}
        />
      )}
    </div>
  );
};

export default SelectIcon;
