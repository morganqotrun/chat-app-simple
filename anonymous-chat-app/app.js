// Global variables
let currentUser = null;
let userColor = null;

// DOM Elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const onlineCountSpan = document.getElementById('online-count');

// Initialize app ketika halaman load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize aplikasi
async function initializeApp() {
    try {
        // Generate user ID random untuk anonymous user
        currentUser = generateUserId();
        
        // Generate warna unik untuk user
        userColor = generateUserColor();
        
        // Load pesan yang sudah ada
        loadMessages();
        
        // Update online count
        updateOnlineCount();
        
        console.log('App initialized dengan user:', currentUser);
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showSystemMessage('Error memuat chat. Refresh halaman.');
    }
}

// Generate random user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Generate warna unik berdasarkan user ID
function generateUserColor() {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c', 
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#fa709a', '#fee140', '#a8edea', '#fed6e3'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Generate nama random untuk user
function generateUserName() {
    const names = [
        'Pengguna Biru', 'Teman Hijau', 'Sobat Ungu', 'Kawan Merah',
        'Teman Online', 'Anonymous', 'Mystery User', 'Chat Buddy',
        'Digital Friend', 'Virtual Pal', 'Cyber Mate', 'Netizen'
    ];
    const adjectives = ['Ceria', 'Ramah', 'Santai', 'Asik', 'Keren', 'Hebat'];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    return `${name} ${adjective}`;
}

// Kirim pesan
async function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText) {
        return; // Jangan kirim pesan kosong
    }
    
    if (!currentUser) {
        showSystemMessage('Error: User tidak terdeteksi. Refresh halaman.');
        return;
    }
    
    try {
        // Kirim ke Firebase
        await db.collection('messages').add({
            text: messageText,
            userId: currentUser,
            userName: generateUserName(),
            userColor: userColor,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'user'
        });
        
        // Clear input
        messageInput.value = '';
        
    } catch (error) {
        console.error('Error sending message:', error);
        showSystemMessage('Error mengirim pesan. Coba lagi.');
    }
}

// Load pesan dari Firebase
function loadMessages() {
    db.collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            // Hapus pesan duplikat
            const existingMessages = new Set();
            
            // Clear messages yang bukan system message
            const systemMessage = messagesDiv.querySelector('.system-message');
            messagesDiv.innerHTML = '';
            if (systemMessage) {
                messagesDiv.appendChild(systemMessage);
            }
            
            // Add semua pesan
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageId = doc.id;
                
                if (!existingMessages.has(messageId)) {
                    existingMessages.add(messageId);
                    displayMessage(message, messageId);
                }
            });
            
            // Scroll ke bawah
            scrollToBottom();
        }, error => {
            console.error('Error loading messages:', error);
            showSystemMessage('Error memuat pesan. Refresh halaman.');
        });
}

// Tampilkan pesan di UI
function displayMessage(message, messageId) {
    // Skip jika bukan user message
    if (message.type !== 'user') return;
    
    const messageDiv = document.createElement('div');
    const isMyMessage = message.userId === currentUser;
    
    messageDiv.className = `message ${isMyMessage ? 'my-message' : 'other-message'}`;
    messageDiv.id = messageId;
    
    // Format waktu
    const time = message.timestamp ? 
        new Date(message.timestamp.toDate()).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Baru saja';
    
    // Style untuk pesan orang lain
    if (!isMyMessage) {
        messageDiv.style.borderLeft = `3px solid ${message.userColor}`;
    }
    
    messageDiv.innerHTML = `
        ${!isMyMessage ? 
            `<div class="message-sender" style="color: ${message.userColor}">
                ${message.userName}
            </div>` 
            : ''
        }
        <div class="message-text">${escapeHtml(message.text)}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesDiv.appendChild(messageDiv);
}

// Tampilkan system message
function showSystemMessage(text) {
    const systemDiv = document.createElement('div');
    systemDiv.className = 'system-message';
    systemDiv.textContent = text;
    messagesDiv.appendChild(systemDiv);
    scrollToBottom();
}

// Scroll ke bawah
function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Update online count (simulasi)
function updateOnlineCount() {
    // Untuk demo, kita generate random number
    const randomCount = Math.floor(Math.random() * 10) + 1;
    onlineCountSpan.textContent = randomCount;
    
    // Update setiap 30 detik
    setInterval(() => {
        const newCount = Math.floor(Math.random() * 10) + 1;
        onlineCountSpan.textContent = newCount;
    }, 30000);
}

// Security: Escape HTML untuk prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Kirim pesan dengan Enter key
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Auto focus ke input message
messageInput.focus();