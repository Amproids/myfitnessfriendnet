fetch('http://localhost:3001/api/test')
  .then(res => res.json())
  .then(data => {
    document.getElementById('server-message').textContent = data.message;
  })
  .catch(console.error);