import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const employeeId = localStorage.getItem("employeeId");

      if (!employeeId) {
        setError("Employee ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/employee/dashboard/profile/${employeeId}`
        );
        setProfile(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile information:", error);
        setError("Error fetching profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const employeeId = localStorage.getItem("employeeId");

    if (!employeeId) {
      setError("Employee ID not found. Please log in again.");
      return;
    }

    try {
      await axios.put(`/employee/${employeeId}`, profile);
      setSuccess("Profile updated successfully");
      setError(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile");
      setSuccess(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  if (loading)
    return (
      <Spinner
        animation="border"
        role="status"
        className="d-block mx-auto mt-5"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1 className="text-center mb-4">Employee Profile</h1>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={profile.role || ""}
                onChange={handleChange}
                placeholder="Enter your role"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Update Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeProfile;
