import { useState, useEffect } from 'react';
import { FiGrid, FiUsers, FiPackage, FiDollarSign, FiCalendar, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { courtService, coachService, equipmentService, pricingRuleService, bookingService } from '../services/dataService';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courts');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'courts', label: 'Courts', icon: <FiGrid /> },
    { id: 'coaches', label: 'Coaches', icon: <FiUsers /> },
    { id: 'equipment', label: 'Equipment', icon: <FiPackage /> },
    { id: 'pricing', label: 'Pricing Rules', icon: <FiDollarSign /> },
    { id: 'bookings', label: 'All Bookings', icon: <FiCalendar /> }
  ];

  const getService = () => {
    switch (activeTab) {
      case 'courts': return courtService;
      case 'coaches': return coachService;
      case 'equipment': return equipmentService;
      case 'pricing': return pricingRuleService;
      case 'bookings': return bookingService;
      default: return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const service = getService();
      const response = await service.getAll();
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const service = getService();
      await service.toggle(id);
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const service = getService();
      await service.delete(id);
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(getDefaultFormData());
    setShowModal(true);
  };

  const getDefaultFormData = () => {
    switch (activeTab) {
      case 'courts':
        return { name: '', type: 'indoor', description: '', basePrice: 0, amenities: [], isActive: true };
      case 'coaches':
        return { name: '', email: '', phone: '', specialization: '', experience: 0, hourlyRate: 0, bio: '', isActive: true };
      case 'equipment':
        return { name: '', type: 'racket', description: '', totalQuantity: 0, pricePerHour: 0, isActive: true };
      case 'pricing':
        return { name: '', description: '', type: 'peak_hour', modifierType: 'multiplier', modifierValue: 1, appliesTo: 'all', priority: 0, isActive: true };
      default:
        return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = getService();
      if (editingItem) {
        await service.update(editingItem._id, formData);
        toast.success('Updated successfully');
      } else {
        await service.create(formData);
        toast.success('Created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'courts':
        return (
          <>
            <div>
              <label className="label">Court Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={formData.type || 'indoor'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
              />
            </div>
            <div>
              <label className="label">Base Price ($/hr)</label>
              <input
                type="number"
                value={formData.basePrice || 0}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                className="input"
                min="0"
                step="0.01"
                required
              />
            </div>
          </>
        );

      case 'coaches':
        return (
          <>
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Specialization</label>
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Experience (years)</label>
                <input
                  type="number"
                  value={formData.experience || 0}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                  className="input"
                  min="0"
                />
              </div>
              <div>
                <label className="label">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={formData.hourlyRate || 0}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                  className="input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input"
                rows={3}
              />
            </div>
          </>
        );

      case 'equipment':
        return (
          <>
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={formData.type || 'racket'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="racket">Racket</option>
                <option value="shoes">Shoes</option>
                <option value="shuttlecock">Shuttlecock</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Total Quantity</label>
                <input
                  type="number"
                  value={formData.totalQuantity || 0}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) })}
                  className="input"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="label">Price per Hour ($)</label>
                <input
                  type="number"
                  value={formData.pricePerHour || 0}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
                  className="input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </>
        );

      case 'pricing':
        return (
          <>
            <div>
              <label className="label">Rule Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={2}
              />
            </div>
            <div>
              <label className="label">Rule Type</label>
              <select
                value={formData.type || 'peak_hour'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="peak_hour">Peak Hour</option>
                <option value="weekend">Weekend</option>
                <option value="holiday">Holiday</option>
                <option value="indoor_premium">Indoor Premium</option>
                <option value="early_bird">Early Bird</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime || ''}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">End Time</label>
                <input
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Modifier Type</label>
                <select
                  value={formData.modifierType || 'multiplier'}
                  onChange={(e) => setFormData({ ...formData, modifierType: e.target.value })}
                  className="input"
                >
                  <option value="multiplier">Multiplier (e.g., 1.5x)</option>
                  <option value="fixed_addition">Fixed Addition ($)</option>
                  <option value="fixed_subtraction">Fixed Subtraction ($)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="label">Modifier Value</label>
                <input
                  type="number"
                  value={formData.modifierValue || 0}
                  onChange={(e) => setFormData({ ...formData, modifierValue: parseFloat(e.target.value) })}
                  className="input"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Applies To</label>
                <select
                  value={formData.appliesTo || 'all'}
                  onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                  className="input"
                >
                  <option value="all">All Courts</option>
                  <option value="indoor">Indoor Only</option>
                  <option value="outdoor">Outdoor Only</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <input
                  type="number"
                  value={formData.priority || 0}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="input"
                  min="0"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    if (loading) return <Loading />;
    if (data.length === 0) return <p className="text-center text-gray-500 py-8">No items found</p>;

    switch (activeTab) {
      case 'courts':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.type === 'indoor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.basePrice}/hr</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggle(item._id)} className="text-gray-500 hover:text-primary-600">
                      {item.isActive ? <FiToggleRight className="w-6 h-6 text-green-500" /> : <FiToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'coaches':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.hourlyRate}/hr</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggle(item._id)} className="text-gray-500 hover:text-primary-600">
                      {item.isActive ? <FiToggleRight className="w-6 h-6 text-green-500" /> : <FiToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'equipment':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.totalQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.pricePerHour}/hr</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggle(item._id)} className="text-gray-500 hover:text-primary-600">
                      {item.isActive ? <FiToggleRight className="w-6 h-6 text-green-500" /> : <FiToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'pricing':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modifier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{item.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.modifierType === 'multiplier' && `${item.modifierValue}x`}
                    {item.modifierType === 'fixed_addition' && `+$${item.modifierValue}`}
                    {item.modifierType === 'fixed_subtraction' && `-$${item.modifierValue}`}
                    {item.modifierType === 'percentage' && `${item.modifierValue}%`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggle(item._id)} className="text-gray-500 hover:text-primary-600">
                      {item.isActive ? <FiToggleRight className="w-6 h-6 text-green-500" /> : <FiToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'bookings':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.court?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(item.date).toLocaleDateString()}<br />
                    <span className="text-gray-500">{item.startTime} - {item.endTime}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">${item.pricingBreakdown?.total?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage courts, coaches, equipment, and pricing rules</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          {activeTab !== 'bookings' && (
            <button onClick={handleAdd} className="btn btn-primary flex items-center">
              <FiPlus className="mr-2" /> Add New
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {renderTable()}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderForm()}
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
