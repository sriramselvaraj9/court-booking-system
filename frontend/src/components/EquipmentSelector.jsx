import { FiMinus, FiPlus } from 'react-icons/fi';

const EquipmentSelector = ({ equipment, selectedEquipment, onUpdateQuantity }) => {
  const getQuantity = (equipmentId) => {
    const item = selectedEquipment.find((e) => e.equipmentId === equipmentId);
    return item?.quantity || 0;
  };

  const handleUpdate = (item, delta) => {
    const currentQty = getQuantity(item._id);
    const newQty = Math.max(0, Math.min(currentQty + delta, item.totalQuantity));
    onUpdateQuantity(item._id, newQty);
  };

  return (
    <div className="space-y-3">
      {equipment.map((item) => {
        const quantity = getQuantity(item._id);
        return (
          <div
            key={item._id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              quantity > 0
                ? 'border-primary-300 bg-primary-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm font-medium text-primary-600">
                    ${item.pricePerHour}/hr
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.totalQuantity} available
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdate(item, -1)}
                  disabled={quantity === 0}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleUpdate(item, 1)}
                  disabled={quantity >= item.totalQuantity}
                  className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentSelector;
