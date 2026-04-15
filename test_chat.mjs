// Test script
fetch('http://localhost:3001/api/chat', { // Port 3001 because port 3000 was in use
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        messages: [{ sender: 'user', text: 'Salom' }]
    })
}).then(res => res.json()).then(console.log).catch(console.error);
