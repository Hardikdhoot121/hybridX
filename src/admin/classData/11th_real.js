import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://hybridx-uhj9.onrender.com/api";

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const use11thStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE}/admin/students`, {
          headers: getAuthHeaders()
        });
        
        console.log('✅ Fetched all students:', response.data);
        const filteredStudents = response.data.filter(student => student.classLevel === '11th');
        console.log('✅ Filtered 11th students:', filteredStudents);
        setStudents(filteredStudents);
      } catch (err) {
        console.error('❌ Error fetching 11th students:', err);
        setError(err.response?.data?.message || 'Failed to fetch 11th students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading, error };
};

export const use12thStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE}/admin/students`, {
          headers: getAuthHeaders()
        });
        
        console.log('✅ Fetched all students:', response.data);
        const filteredStudents = response.data.filter(student => student.classLevel === '12th');
        console.log('✅ Filtered 12th students:', filteredStudents);
        setStudents(filteredStudents);
      } catch (err) {
        console.error('❌ Error fetching 12th students:', err);
        setError(err.response?.data?.message || 'Failed to fetch 12th students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading, error };
};
