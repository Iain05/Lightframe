import AddRounded from '@mui/icons-material/AddRounded';

interface AddAlbumCardProps {
  fadeIn: boolean;
  onClick: () => void;
}

const AddAlbumCard = ({ fadeIn, onClick }: AddAlbumCardProps) => {
  return (
    <div
      className={`relative cursor-pointer group overflow-hidden transform transition-opacity duration-500 ease-in-out rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 flex items-center justify-center aspect-[5/3] ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: '0ms' }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-600">
        <AddRounded style={{ fontSize: '48px' }} />
        <span className="mt-2 text-lg font-medium">Add New Album</span>
      </div>
    </div>
  );
};

export default AddAlbumCard;
