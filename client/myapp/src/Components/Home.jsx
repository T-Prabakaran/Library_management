import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allbooks');
        setBooks(response.data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchData();
  }, []); 

  const handleCountSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/bookcount/${author}/${name}/${subject}/${date}`);
      setCount(response.data);
    } catch (error) {
      console.error('Error fetching book count:', error);
    }
  };

  const handleSearch = () => {
    const filtered = books.filter(book =>
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setBooks(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <label>Author:</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <label>Date:</label>
        <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="button" onClick={handleCountSubmit}>
          Get Book Count
        </button>
      </div>
      <div>
        <label>Search:</label>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <h2>Book List</h2>
      <div>
        {currentBooks.map((book) => (
          <div key={book.id}>
            <h1>{book.name} by {book.author}</h1>
            <h2>{book.description}</h2>
            <h3>{book.subject}</h3>
            <h3>{book.price}</h3>
            <h4>{book.category}</h4>
            <h4>{book.publishedDate}</h4>
            <hr />
          </div>
        ))}
      </div>
      {count !== null && (
        <div>
          <h2>Book Count</h2>
          <p>Author: {count.author}</p>
          <p>Name: {count.title}</p>
          <p>Subject: {count.subject}</p>
          <p>Date: {count.date}</p>
        </div>
      )}
      <div>
        <ul>
          {Array.from({ length: Math.ceil(books.length / itemsPerPage) }, (_, index) => (
            <li key={index + 1}>
              <button type="button" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
