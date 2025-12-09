import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiPackage, FiDollarSign, FiArrowRight, FiCheck } from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: <FiCalendar className="w-8 h-8" />,
      title: 'Easy Booking',
      description: 'Book courts online in just a few clicks. Select your preferred time slot and court type.'
    },
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: 'Equipment Rental',
      description: 'Rent professional rackets, shoes, and shuttlecocks. No need to bring your own gear.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Expert Coaches',
      description: 'Learn from experienced coaches. Book private sessions to improve your game.'
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: 'Dynamic Pricing',
      description: 'Transparent pricing with discounts for off-peak hours. See real-time price breakdowns.'
    }
  ];

  const stats = [
    { value: '4', label: 'Courts Available' },
    { value: '3', label: 'Expert Coaches' },
    { value: '100+', label: 'Happy Players' },
    { value: '16', label: 'Hours Daily' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Book Your Perfect
                <span className="block text-primary-200">Badminton Court</span>
              </h1>
              <p className="mt-6 text-lg text-primary-100 max-w-lg">
                Reserve courts, rent equipment, and book coaching sessions all in one place. 
                Experience seamless booking with transparent pricing.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center"
                >
                  Book Now <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/register"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-primary-500 rounded-full opacity-20 absolute -top-10 -right-10"></div>
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <p className="text-4xl font-bold">{stat.value}</p>
                        <p className="text-primary-200 text-sm mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides a complete solution for badminton enthusiasts, 
              from court booking to professional coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Transparent Dynamic Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Our pricing adapts based on demand and time, ensuring fair rates for everyone. 
                You always see the full breakdown before confirming your booking.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Base rates starting from $20/hour',
                  'Early bird discounts (6 AM - 9 AM)',
                  'Premium rates for peak hours (6 PM - 9 PM)',
                  'Weekend surcharges apply',
                  'Indoor courts at premium pricing'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <FiCheck className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/booking"
                className="mt-8 btn btn-primary inline-flex items-center"
              >
                Check Availability <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <h3 className="font-semibold text-xl text-gray-900 mb-6">Sample Pricing</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Outdoor Court (Off-Peak)</span>
                    <span className="font-bold text-primary-600">$20/hr</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Indoor Court (Peak Hour)</span>
                    <span className="font-bold text-primary-600">$45/hr</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Coach Session</span>
                    <span className="font-bold text-secondary-600">$35-50/hr</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Equipment Rental</span>
                    <span className="font-bold text-gray-700">$2-5/hr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Play?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join our community of badminton enthusiasts. Book your first court today 
            and experience the convenience of online booking.
          </p>
          <Link
            to="/booking"
            className="btn bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 text-lg font-semibold inline-flex items-center"
          >
            Book Your Court <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
