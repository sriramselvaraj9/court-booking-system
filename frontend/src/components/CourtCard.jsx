const CourtCard = ({ court, selected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(court)}
      className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected?._id === court._id
          ? 'ring-2 ring-primary-500 bg-primary-50'
          : 'hover:border-primary-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{court.name}</h3>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
              court.type === 'indoor'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {court.type.charAt(0).toUpperCase() + court.type.slice(1)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600">${court.basePrice}</p>
          <p className="text-xs text-gray-500">per hour</p>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mt-3">{court.description}</p>
      
      {court.amenities && court.amenities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {court.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {amenity}
            </span>
          ))}
          {court.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{court.amenities.length - 3} more
            </span>
          )}
        </div>
      )}
      
      {!court.isActive && (
        <div className="mt-3 px-3 py-1 bg-red-100 text-red-600 text-sm rounded text-center">
          Currently Unavailable
        </div>
      )}
    </div>
  );
};

export default CourtCard;
