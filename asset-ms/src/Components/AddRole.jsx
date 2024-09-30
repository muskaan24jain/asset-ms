import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/add_role', { role })
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/role');
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-3 rounded w-25 border'>
        <h2>Add Role</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="role"><strong>Role:</strong></label>
            <input
              type="text"
              name="role"
              placeholder="Enter Role"
              onChange={(e) => setRole(e.target.value)}
              className='form-control rounded-0'
            />
          </div>
          
          <button type="submit" className='btn btn-success w-100 rounded-0 mb-2'>Add Role</button>
        </form>
      </div>
    </div>
  );
}

export default AddRole;
