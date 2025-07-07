import AddAlbumModal from './add-album';
import EditAlbumModal from './edit-album';
import type { EditingAlbum } from '../hooks/use-modal-state';
import type { AlbumFormData } from './collection';


interface AlbumModalsProps {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingAlbum: EditingAlbum | null;
  onCloseAdd: () => void;
  onCloseEdit: () => void;
  onSubmitAdd: (albumData: AlbumFormData) => void;
  onSubmitEdit: (albumData: AlbumFormData) => void;
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
            isPublic: editingAlbum.isPublic,
            eventDate: editingAlbum.eventDate,
          }}
        />
      )}
    </>
  );
};

export default AlbumModals;
