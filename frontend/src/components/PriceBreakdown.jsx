const PriceBreakdown = ({ pricing, loading }) => {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Price Breakdown</h3>
        <p className="text-gray-500 text-sm">
          Select a court, date, and time slot to see the price breakdown
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-white">
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Price Breakdown</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Court Fee</span>
          <span className="font-medium">${pricing.courtFee?.toFixed(2)}</span>
        </div>
        
        {pricing.equipmentFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Equipment Rental</span>
            <span className="font-medium">${pricing.equipmentFee?.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.coachFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Coach Fee</span>
            <span className="font-medium">${pricing.coachFee?.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.appliedRules && pricing.appliedRules.length > 0 && (
          <div className="border-t border-gray-200 pt-3 mt-3">
            <p className="text-xs text-gray-500 mb-2">Applied Pricing Rules:</p>
            {pricing.appliedRules.map((rule, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{rule.ruleName}</span>
                <span className={`font-medium ${rule.adjustment >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {rule.adjustment >= 0 ? '+' : ''}${rule.adjustment?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              ${pricing.total?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
