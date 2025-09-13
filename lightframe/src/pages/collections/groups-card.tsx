import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Group {
  name: string;
  coverImage: string;
  collectionId: string;
  index: number;
  fadeIn: boolean;
}

const GroupsCard = ({ name, coverImage, collectionId, index, fadeIn }: Group) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (fadeIn) {
      const id = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(id);
    }

    setVisible(true);
  }, [fadeIn]);

  return (
    <div
      key={collectionId}
      className={`relative cursor-pointer group overflow-hidden transform transition-opacity duration-500 ease-in-out rounded-md aspect-[3/2] md:aspect-[3/1] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: `${(index + 1) * 150}ms` }}
      onClick={() => navigate(`${collectionId}`)}
    >
      <img
        src={coverImage}
        className="w-full h-full object-cover rounded-md transform transition-transform duration-800 group-hover:scale-103"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-4 flex items-center justify-center text-center text-white text-3xl md:text-5xl font-semibold leading-tight px-4">
        {name}
      </div>
    </div>
  );
}

export default GroupsCard;