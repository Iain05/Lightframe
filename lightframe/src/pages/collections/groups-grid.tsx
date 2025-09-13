import GroupCard from './groups-card';
import type { Group } from './groups-card';

const GroupsGrid = ({ groups }: { groups: Group[] }) => {
    return (
        <div className="grid grid-cols-1 gap-4 p-4 max-w-screen-xl mx-auto">
            {groups.map((group, index) => (
                <GroupCard
                    key={group.collectionId}
                    name={group.name}
                    coverImage={group.coverImage}
                    collectionId={group.collectionId}
                    index={index}
                    fadeIn={true}
                />
            ))}
        </div>
    );
}

export default GroupsGrid;