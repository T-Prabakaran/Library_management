import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [count, setCount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    price: '',
    description: '',
    category: '',
    subject: '',
    publishedDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/allbooks');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleCountSubmit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/bookcount/${author}/${name}/${subject}/${date}`
      );
      setCount(response.data);
    } catch (error) {
      console.error('Error fetching book count:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/searchbooks/${searchTerm}`
      );
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deletebook/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/insertbook', formData);
      fetchData(); // Refresh data after insertion
      setFormData({
        name: '',
        author: '',
        price: '',
        description: '',
        category: '',
        subject: '',
        publishedDate: ''
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CSS styles
  const styles = {
    container: {
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    form: {
      margin: '0 auto',
      maxWidth: '500px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
    },
    label: {
      display: 'inline-block',
      width: '120px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    input: {
      width: 'calc(100% - 140px)',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#4CAF50',
      color: 'white',
      marginBottom: '10px',
    },
    buttonDanger: {
      backgroundColor: '#f44336',
    },
    table: {
      width: '80%',
      margin: '20px auto',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    actionButton: {
      backgroundColor: '#f44336',
      color: '#fff',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    actionButtonHover: {
      backgroundColor: '#d32f2f',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#4CAF50' }}>Home Page</h1>
      {/* Your filter and search components */}
      <h2 style={{ color: '#4CAF50' }}>Add New Book</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
        <br />
        <label style={styles.label}>Author:</label>
        <input type="text" name="author" value={formData.author} onChange={handleChange} style={styles.input} />
        <br />
        <label style={styles.label}>Price:</label>
        <input type="text" name="price" value={formData.price} onChange={handleChange} style={styles.input} />
        <br />
        <label style={styles.label}>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} style={styles.input} />
        <br />
        <label style={styles.label}>Category:</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} style={styles.input} />
        <br />
        <label style={styles.label}>Subject:</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} style={styles.input} />
        <br />
        <label style={styles.label}>Published Date:</label>
        <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} style={styles.input} />
        <br />
        <button type="submit" style={styles.button}>Add Book</button>
      </form>
      <h2 style={{ color: '#4CAF50' }}>Book List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Author</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Subject</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Published Date</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.id}>
              <td style={styles.td}>{book.name}</td>
              <td style={styles.td}>{book.author}</td>
              <td style={styles.td}>{book.description}</td>
              <td style={styles.td}>{book.subject}</td>
              <td style={styles.td}>{book.price}</td>
              <td style={styles.td}>{book.category}</td>
              <td style={styles.td}>{book.publishedDate}</td>
              <td style={styles.td}>
                <button onClick={() => handleDelete(book.id)} style={{ ...styles.actionButton, ...styles.buttonDanger }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination component */}
    </div>
  );
}

export default Home;
