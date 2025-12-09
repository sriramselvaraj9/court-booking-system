import api from './api';

export const courtService = {
  getAll: (params) => api.get('/courts', { params }),
  getById: (id) => api.get(`/courts/${id}`),
  create: (data) => api.post('/admin/courts', data),
  update: (id, data) => api.put(`/admin/courts/${id}`, data),
  delete: (id) => api.delete(`/admin/courts/${id}`),
  toggle: (id) => api.patch(`/admin/courts/${id}/toggle`)
};

export const coachService = {
  getAll: (params) => api.get('/coaches', { params }),
  getById: (id) => api.get(`/coaches/${id}`),
  create: (data) => api.post('/admin/coaches', data),
  update: (id, data) => api.put(`/admin/coaches/${id}`, data),
  delete: (id) => api.delete(`/admin/coaches/${id}`),
  toggle: (id) => api.patch(`/admin/coaches/${id}/toggle`),
  updateAvailability: (id, availability) => 
    api.put(`/admin/coaches/${id}/availability`, { availability })
};

export const equipmentService = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/admin/equipment', data),
  update: (id, data) => api.put(`/admin/equipment/${id}`, data),
  delete: (id) => api.delete(`/admin/equipment/${id}`),
  toggle: (id) => api.patch(`/admin/equipment/${id}/toggle`)
};

export const pricingRuleService = {
  getAll: (params) => api.get('/pricing-rules', { params }),
  getById: (id) => api.get(`/pricing-rules/${id}`),
  create: (data) => api.post('/admin/pricing-rules', data),
  update: (id, data) => api.put(`/admin/pricing-rules/${id}`, data),
  delete: (id) => api.delete(`/admin/pricing-rules/${id}`),
  toggle: (id) => api.patch(`/admin/pricing-rules/${id}/toggle`)
};

export const bookingService = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getAvailableSlots: (courtId, date) => api.get(`/bookings/slots/${courtId}/${date}`),
  checkAvailability: (data) => api.post('/bookings/check-availability', data),
  calculatePrice: (data) => api.post('/bookings/calculate-price', data),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  joinWaitlist: (data) => api.post('/bookings/waitlist', data)
};
