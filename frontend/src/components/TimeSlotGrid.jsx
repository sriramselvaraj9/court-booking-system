import { format } from 'date-fns';

const TimeSlotGrid = ({ slots, selectedSlot, onSelectSlot, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {Array(16).fill(0).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        Select a court and date to see available time slots
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
      {slots.map((slot, index) => (
        <button
          key={index}
          onClick={() => slot.available && onSelectSlot(slot)}
          disabled={!slot.available}
          className={`py-3 px-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            !slot.available
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : selectedSlot?.startTime === slot.startTime
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          {slot.startTime}
        </button>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
