import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, uploadProfilePicture, removeProfilePicture } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    fullName: '',
    age: '',
    weight: '',
    height: '',
    nationality: '',
    profileImage: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data);
      if (response.data.profileImage) {
        setImagePreview(`http://localhost:5000/${response.data.profileImage}`);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const response = await uploadProfilePicture(formData);
      setProfile(response.data.user);
      setImagePreview(`http://localhost:5000/${response.data.profileImage}`);
      setSelectedFile(null);
      setMessage('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await removeProfilePicture();
      setProfile(response.data.user);
      setImagePreview(null);
      setSelectedFile(null);
      setMessage('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      setMessage('Error removing image');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        fullName: profile.fullName,
        age: profile.age ? parseInt(profile.age) : undefined,
        weight: profile.weight ? parseFloat(profile.weight) : undefined,
        height: profile.height ? parseFloat(profile.height) : undefined,
        nationality: profile.nationality
      };

      const response = await updateUserProfile(updateData);
      setProfile(response.data.user);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfile();
    setIsEditing(false);
    setSelectedFile(null);
    if (profile.profileImage) {
      setImagePreview(`http://localhost:5000/${profile.profileImage}`);
    } else {
      setImagePreview(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-user me-2"></i>
                My Profile
              </h3>
            </div>
            
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`}>
                  {message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setMessage('')}
                  ></button>
                </div>
              )}

              {/* Profile Picture Section */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={imagePreview || 'https://via.placeholder.com/150x150?text=No+Image'}
                    alt="Profile"
                    className="rounded-circle border"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  {isEditing && (
                    <div className="position-absolute bottom-0 end-0">
                      <label className="btn btn-sm btn-primary rounded-circle">
                        <i className="fas fa-camera"></i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                {selectedFile && (
                  <div className="mt-2">
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={handleImageUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedFile(null);
                        if (profile.profileImage) {
                          setImagePreview(`http://localhost:5000/${profile.profileImage}`);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {profile.profileImage && isEditing && !selectedFile && (
                  <div className="mt-2">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.username}
                    disabled
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    disabled
                  />
                </div>
                
                <div className="col-md-12 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="col-md-4 mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={profile.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="13"
                    max="120"
                    placeholder="Age"
                  />
                </div>
                
                <div className="col-md-4 mb-3">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="weight"
                    value={profile.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="20"
                    max="500"
                    step="0.1"
                    placeholder="Weight"
                  />
                </div>
                
                <div className="col-md-4 mb-3">
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="height"
                    value={profile.height}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="100"
                    max="250"
                    placeholder="Height"
                  />
                </div>
                
                <div className="col-md-12 mb-3">
                  <label className="form-label">Nationality</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nationality"
                    value={profile.nationality}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your nationality"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between">
                {!isEditing ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div>
                    <button 
                      className="btn btn-success me-2"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => window.history.back()}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;