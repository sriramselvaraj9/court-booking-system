import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiPackage, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { bookingService } from '../services/dataService';
import Loading from '../components/Loading';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await bookingService.getMyBookings(params);
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(bookingId);
    try {
      await bookingService.cancel(bookingId);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'waitlist':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loading text="Loading your bookings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your court reservations</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {['all', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No bookings found</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'all' 
              ? "You haven't made any bookings yet"
              : `No ${filter} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {booking.court?.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                      {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {booking.court?.type === 'indoor' ? 'Indoor Court' : 'Outdoor Court'}
                    </div>
                    {booking.resources?.coach && (
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-gray-400" />
                        Coach: {booking.resources.coach.name}
                      </div>
                    )}
                  </div>

                  {booking.resources?.equipment?.length > 0 && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <FiPackage className="w-4 h-4 mr-2 text-gray-400" />
                      Equipment: {booking.resources.equipment.map(e => e.item?.name).join(', ')}
                    </div>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    ${booking.pricingBreakdown?.total?.toFixed(2)}
                  </p>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelling === booking._id}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center justify-end"
                    >
                      <FiX className="w-4 h-4 mr-1" />
                      {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>

              {/* Price Breakdown Accordion */}
              {booking.pricingBreakdown && (
                <details className="mt-4 pt-4 border-t border-gray-100">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    View price breakdown
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Court Fee</span>
                    <span className="text-right">${booking.pricingBreakdown.courtFee?.toFixed(2)}</span>
                    
                    {booking.pricingBreakdown.equipmentFee > 0 && (
                      <>
                        <span className="text-gray-500">Equipment</span>
                        <span className="text-right">${booking.pricingBreakdown.equipmentFee?.toFixed(2)}</span>
                      </>
                    )}
                    
                    {booking.pricingBreakdown.coachFee > 0 && (
                      <>
                        <span className="text-gray-500">Coach Fee</span>
                        <span className="text-right">${booking.pricingBreakdown.coachFee?.toFixed(2)}</span>
                      </>
                    )}

                    {booking.pricingBreakdown.appliedRules?.map((rule, index) => (
                      <div key={index} className="col-span-2 flex justify-between">
                        <span className="text-gray-500">{rule.ruleName}</span>
                        <span className={rule.adjustment >= 0 ? 'text-red-600' : 'text-green-600'}>
                          {rule.adjustment >= 0 ? '+' : ''}${rule.adjustment?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
