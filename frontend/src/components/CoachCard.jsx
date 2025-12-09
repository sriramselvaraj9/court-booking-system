import { FiUser, FiStar, FiClock } from 'react-icons/fi';

const CoachCard = ({ coach, selected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(coach)}
      className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected?._id === coach._id
          ? 'ring-2 ring-secondary-500 bg-secondary-50'
          : 'hover:border-secondary-200'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiUser className="w-8 h-8 text-secondary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">{coach.name}</h3>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-secondary-600">${coach.hourlyRate}</p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
            <span className="flex items-center">
              <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
              {coach.specialization}
            </span>
            <span className="flex items-center">
              <FiClock className="w-4 h-4 mr-1" />
              {coach.experience} years
            </span>
          </div>
          
          {coach.bio && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{coach.bio}</p>
          )}
        </div>
      </div>
      
      {selected?._id === coach._id && (
        <div className="mt-3 flex items-center justify-center text-sm text-secondary-600 font-medium">
          ✓ Selected
        </div>
      )}
    </div>
  );
};

export default CoachCard;
