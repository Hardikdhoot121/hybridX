import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Must contain lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Must contain uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Must contain a number');
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push('Must contain special character');
    }
    
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    } else if (formData.currentPassword === 'wrong') {
      // Simulate wrong password check (in real app, this would be an API call)
      newErrors.currentPassword = 'Incorrect current password';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors.join(', ');
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to update password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isFormValid = formData.currentPassword && 
                     formData.newPassword && 
                     formData.confirmPassword &&
                     formData.newPassword === formData.confirmPassword &&
                     validatePassword(formData.newPassword).length === 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <span className="text-sm font-medium">Password updated successfully!</span>
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-6 shadow-lg border border-white/5 relative overflow-hidden w-[450px]">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-xl blur opacity-20"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full bg-[#1E293B] text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${
                      errors.currentPassword ? 'ring-2 ring-red-400/50' : ''
                    }`}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full bg-[#1E293B] text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${
                      errors.newPassword ? 'ring-2 ring-red-400/50' : ''
                    }`}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full bg-[#1E293B] text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${
                      errors.confirmPassword ? 'ring-2 ring-red-400/50' : ''
                    }`}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#1E293B] text-gray-400 hover:text-white hover:bg-[#2D3748] transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 pill-button"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
