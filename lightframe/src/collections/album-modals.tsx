import AddAlbumModal from './add-album';
import EditAlbumModal from './edit-album';
import type { EditingAlbum } from '../hooks/use-modal-state';

interface AlbumModalsProps {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingAlbum: EditingAlbum | null;
  onCloseAdd: () => void;
  onCloseEdit: () => void;
  onSubmitAdd: (albumData: { name: string; description?: string; isPublic: boolean }) => void;
  onSubmitEdit: (albumData: { name: string; description?: string; isPublic: boolean }) => void;
  onDelete: (albumId: string) => void;
}

const AlbumModals = ({
  isAddModalOpen,
  isEditModalOpen,
  editingAlbum,
  onCloseAdd,
  onCloseEdit,
  onSubmitAdd,
  onSubmitEdit,
  onDelete,
}: AlbumModalsProps) => {
  return (
    <>
      <AddAlbumModal 
        isOpen={isAddModalOpen}
        onClose={onCloseAdd}
        onSubmit={onSubmitAdd}
      />
      
      {editingAlbum && (
        <EditAlbumModal 
          isOpen={isEditModalOpen}
          onClose={onCloseEdit}
          onSubmit={onSubmitEdit}
          onDelete={onDelete}
          initialData={{
            id: editingAlbum.id,
            name: editingAlbum.name,
            description: editingAlbum.description,
            isPublic: editingAlbum.isPublic
          }}
        />
      )}
    </>
  );
};

export default AlbumModals;
