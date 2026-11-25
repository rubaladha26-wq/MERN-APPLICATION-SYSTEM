
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load students. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData);
      } else {
        await axios.post(API, formData);
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      setEditId(null);

      await fetchStudents();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    }
  };

  // Edit
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
    });

    setEditId(student._id);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel edit
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setEditId(null);
    setError("");
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);
      await fetchStudents();
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err.response?.data?.message || "Unable to delete student."
      );
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Student Management System</h1>

        <form onSubmit={handleSubmit} className="student-form">
          <h2>{editId ? "Edit Student" : "Add Student"}</h2>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Enter Phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {editId ? "Update Student" : "Add Student"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="error">{error}</p>}

        <h2>Student List</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
