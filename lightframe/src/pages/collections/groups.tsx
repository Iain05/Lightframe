import GroupsGrid from "./groups-grid";

const groups = [
  {
    name: "Robotics",
    coverImage: "/events-robotics.webp",
    collectionId: "robotics",
    index: 0,
    fadeIn: true
  },
  {
    name: "Thunderbird Marching Band",
    coverImage: "/events-tmb.webp",
    collectionId: "tmb",
    index: 1,
    fadeIn: true
  }
];

const Groups: React.FC = () => {
  return (
    <>
      <GroupsGrid groups={groups} />
    </>
  );
}


export default Groups;