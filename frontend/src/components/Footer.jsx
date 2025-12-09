import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CB</span>
              </div>
              <span className="font-bold text-xl text-white">CourtBook</span>
            </div>
            <p className="text-sm text-gray-400">
              Your premier destination for badminton court bookings, equipment rentals, and professional coaching sessions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/booking" className="hover:text-primary-400 transition-colors">Book a Court</Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-primary-400 transition-colors">Our Courts</Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-primary-400 transition-colors">Equipment Rental</Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-primary-400 transition-colors">Our Coaches</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Cancellation Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-primary-400" />
                <span className="text-sm">123 Sports Complex, City</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-primary-400" />
                <span className="text-sm">+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-primary-400" />
                <span className="text-sm">info@courtbook.com</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CourtBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
