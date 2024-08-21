import React from 'react';

function NotFound() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      color: '#333',
      textAlign: 'center',
    },
    title: {
      fontSize: '6rem',
      margin: '0',
      color: '#07a8b0',
    },
    subtitle: {
      fontSize: '2rem',
      margin: '0',
      color: '#555',
    },
    description: {
      marginTop: '20px',
      fontSize: '1.2rem',
      color: '#777',
    },
    homeLink: {
      marginTop: '30px',
      padding: '10px 20px',
      fontSize: '1rem',
      color: '#fff',
      backgroundColor: '#07a8b0',
      textDecoration: 'none',
      borderRadius: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Page Not Found</h2>
      <p style={styles.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <a href="/" style={styles.homeLink}>
        Go Back Home
      </a>
    </div>
  );
}

export default NotFound;