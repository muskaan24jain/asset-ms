import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the admin data when the component loads
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get("/admin/profile");
        setAdmin(res.data);
        setPreviewImage(res.data.photo ? `/uploads/${res.data.photo}` : null);
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };
    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAdmin((prev) => ({ ...prev, photo: e.target.files[0] }));
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("email", admin.email);
    formData.append("password", admin.password);
    if (admin.photo) formData.append("photo", admin.photo);

    try {
      const res = await axios.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={admin.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={admin.password}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label>Profile Photo:</label>
          {previewImage ? (
            <img src={previewImage} alt="Profile" width="100" />
          ) : (
            <p>No photo uploaded</p>
          )}
          {isEditing && <input type="file" onChange={handleFileChange} />}
        </div>
        <div>
          {isEditing ? (
            <button type="submit">Save</button>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
