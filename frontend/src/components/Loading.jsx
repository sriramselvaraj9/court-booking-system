import { FiLoader } from 'react-icons/fi';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};

export default Loading;
