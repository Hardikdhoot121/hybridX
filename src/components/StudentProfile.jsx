import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X, Plus, X as XIcon } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const Field = ({ label, name, value, editing = false, onChange, type = 'text' }) => (
  <div className="flex flex-col py-3 border-b border-white/10">
    <span className="text-sm text-gray-400 mb-1">{label}</span>
    {editing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#1E293B] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
      />
    ) : (
      <span className="text-white">{value || 'Not set'}</span>
    )}
  </div>
);

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    class: '12th',
    batch: '1',
    targetYear: '2025'
  });
  const [editData, setEditData] = useState({ ...profile });

  const handleEdit = () => {
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const TagsInput = ({ label, name, values = [], onAddTag, onRemoveTag, editing = false }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
        e.preventDefault();
        onAddTag(name, inputValue.trim());
        setInputValue('');
      } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
        onRemoveTag(name, values[values.length - 1]);
      }
    };

    return (
      <div className="flex flex-col py-3 border-b border-white/10">
        <span className="text-sm text-gray-400 mb-1">{label}</span>
        {editing ? (
          <div className="flex flex-wrap gap-2 items-center bg-[#1E293B] rounded px-3 py-2 min-h-[42px]">
            {values.map((tag, index) => (
              <div key={index} className="flex items-center bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(name, tag)}
                  className="ml-1 text-blue-300 hover:text-white"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) {
                  onAddTag(name, inputValue.trim());
                  setInputValue('');
                }
              }}
              placeholder="Type and press Enter"
              className="flex-1 bg-transparent border-none outline-none text-white min-w-[120px]"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {values.length > 0 ? (
              values.map((tag, index) => (
                <span key={index} className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-white/60">Not set</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-6 shadow-lg border border-white/5 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-xl blur opacity-20"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Student Profile</h2>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <button 
                  onClick={handleEdit}
                  className="pill-button flex items-center"
                >
                  <Edit2 size={14} className="mr-2" />
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors font-medium"
                >
                  Change Password
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  aria-label="Save changes"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  aria-label="Cancel editing"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-xl font-bold mr-4">
            {((isEditing ? editData.fullName : profile.fullName) ?? '')
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{isEditing ? editData.fullName : profile.fullName}</h3>
            <p className="text-sm text-gray-400">JEE Aspirant</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1: Full Name | Email */}
          <Field 
            label="Full Name" 
            name="fullName" 
            value={isEditing ? editData.fullName : profile.fullName} 
            editing={isEditing}
            onChange={handleChange}
          />
          <Field 
            label="Email ID" 
            name="email" 
            type="email"
            value={isEditing ? editData.email : profile.email} 
            editing={isEditing}
            onChange={handleChange}
          />
          
          {/* Row 2: Phone Number | Class */}
          <Field 
            label="Phone Number" 
            name="phone" 
            type="tel"
            value={isEditing ? editData.phone : profile.phone} 
            editing={isEditing}
            onChange={handleChange}
          />
          <Field 
            label="Class" 
            name="class" 
            value={isEditing ? editData.class : profile.class} 
            editing={isEditing}
            onChange={handleChange}
          />
          
          {/* Row 3: Batch | Target Year */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Batch</label>
            <div className="flex space-x-4 mt-1">
              {[1, 2].map(num => (
                <label key={num} className="flex items-center">
                  <input
                    type="radio"
                    name="batch"
                    value={num}
                    checked={(isEditing ? editData.batch : profile.batch) === String(num)}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-[#26c1ff] focus:ring-[#26c1ff] accent-[#26c1ff]"
                    disabled={!isEditing}
                  />
                  <span className="text-white">Batch {num}</span>
                </label>
              ))}
            </div>
          </div>
          <Field 
            label="Target Year" 
            name="targetYear" 
            type="number"
            min="2023"
            max="2030"
            value={isEditing ? editData.targetYear : profile.targetYear} 
            editing={isEditing}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default StudentProfile;
