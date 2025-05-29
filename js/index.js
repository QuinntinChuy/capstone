// QuickClinique JavaScript Functions

// Global Variables
let currentUser = null;
let appointments = [];
let messages = [];
let queueData = {
    number: 'A-045',
    waitTime: 15,
    position: 12
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setMinDate();
    startQueueUpdater();
});

// Initialize application
function initializeApp() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .appointment-card, .prescription-card').forEach(el => {
        observer.observe(el);
    });
}

// Set minimum date for appointment booking
function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Tab Functions
function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Feature Functions
function showFeature(featureType) {
    let message = '';
    
    switch(featureType) {
        case 'appointments':
            message = 'Appointment booking feature activated! Book your appointments easily.';
            showTab('appointments-tab');
            break;
        case 'queue':
            message = 'Queue monitoring system activated! Check your position in real-time.';
            updateQueue();
            break;
        case 'messaging':
            message = 'Messaging system activated! Communicate with healthcare providers.';
            showTab('messages-tab');
            break;
        case 'pharmacy':
            message = 'Pharmacy ordering system activated! Order your medications online.';
            showTab('prescriptions-tab');
            break;
        case 'notifications':
            message = 'Smart notifications enabled! You\'ll receive timely reminders.';
            break;
        case 'security':
            message = 'Security features activated! Your data is protected with advanced encryption.';
            break;
    }
    
    showNotification(message, 'success');
    
    // Scroll to dashboard if feature requires it
    if (['appointments', 'queue', 'messaging', 'pharmacy'].includes(featureType)) {
        document.getElementById('dashboard').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showLoadingState(event.target.querySelector('button[type="submit"]'));
    
    setTimeout(() => {
        currentUser = {
            email: email,
            name: 'Juan Dela Cruz',
            id: 'user_001'
        };
        
        hideLoadingState(event.target.querySelector('button[type="submit"]'), 'Login');
        closeModal('loginModal');
        showNotification('Login successful! Welcome back.', 'success');
        updateAuthButtons();
        event.target.reset();
    }, 2000);
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Simulate registration process
    showLoadingState(event.target.querySelector('button[type="submit"]'));
    
    setTimeout(() => {
        currentUser = {
            name: name,
            email: email,
            phone: phone,
            id: 'user_' + Date.now()
        };
        
        hideLoadingState(event.target.querySelector('button[type="submit"]'), 'Register');
        closeModal('registerModal');
        showNotification('Registration successful! Welcome to QuickClinique.', 'success');
        updateAuthButtons();
        event.target.reset();
    }, 2000);
}

function updateAuthButtons() {
    const authButtons = document.querySelector('.auth-buttons');
    if (currentUser && authButtons) {
        authButtons.innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button class="btn btn-outline" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    currentUser = null;
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <button class="btn btn-outline" onclick="openModal('loginModal')">Login</button>
        <button class="btn btn-primary" onclick="openModal('registerModal')">Register</button>
    `;
    showNotification('You have been logged out successfully', 'success');
}

// Appointment Functions
function handleAppointment(event) {
    event.preventDefault();
    
    const clinic = document.getElementById('appointmentClinic').value;
    const doctor = document.getElementById('appointmentDoctor').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const notes = document.getElementById('appointmentNotes').value;
    
    if (!clinic || !doctor || !date || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate appointment booking
    showLoadingState(event.target.querySelector('button[type="submit"]'));
    
    setTimeout(() => {
        const newAppointment = {
            id: 'apt_' + Date.now(),
            clinic: clinic,
            doctor: doctor,
            date: date,
            time: time,
            notes: notes,
            status: 'pending'
        };
        
        appointments.push(newAppointment);
        hideLoadingState(event.target.querySelector('button[type="submit"]'), 'Book Appointment');
        closeModal('appointmentModal');
        showNotification('Appointment booked successfully! You will receive a confirmation shortly.', 'success');
        event.target.reset();
        
        // Update queue number
        queueData.number = generateQueueNumber();
        updateQueueDisplay();
    }, 2000);
}

function rescheduleAppointment(appointmentId) {
    showNotification('Rescheduling feature will be available soon. Please contact the clinic directly.', 'warning');
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        showNotification('Appointment cancelled successfully. A confirmation will be sent to your email.', 'success');
        
        // Here you would typically remove the appointment from the UI
        // For demo purposes, we'll just show the notification
    }
}

// Queue Functions
function updateQueue() {
    const queueNumber = document.getElementById('queueNumber');
    const waitTime = document.getElementById('waitTime');
    
    if (queueNumber && waitTime) {
        // Simulate queue advancement
        const currentNumber = parseInt(queueData.number.substring(2));
        const newNumber = Math.max(1, currentNumber - Math.floor(Math.random() * 3));
        
        queueData.number = queueData.number.charAt(0) + '-' + String(newNumber).padStart(3, '0');
        queueData.waitTime = Math.max(5, queueData.waitTime - Math.floor(Math.random() * 5));
        
        updateQueueDisplay();
        showNotification('Queue position updated!', 'success');
    }
}

function updateQueueDisplay() {
    const queueNumber = document.getElementById('queueNumber');
    const waitTime = document.getElementById('waitTime');
    
    if (queueNumber) {
        queueNumber.textContent = queueData.number;
        queueNumber.classList.add('pulse');
        setTimeout(() => queueNumber.classList.remove('pulse'), 2000);
    }
    
    if (waitTime) {
        waitTime.textContent = queueData.waitTime + ' minutes';
    }
}

function generateQueueNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = String(Math.floor(Math.random() * 100) + 1).padStart(3, '0');
    return letter + '-' + number;
}

function startQueueUpdater() {
    // Update queue every 30 seconds
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to update
            const waitTime = document.getElementById('waitTime');
            if (waitTime && queueData.waitTime > 0) {
                queueData.waitTime = Math.max(0, queueData.waitTime - 1);
                waitTime.textContent = queueData.waitTime + ' minutes';
            }
        }
    }, 30000);
}

// Messaging Functions
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageContainer = document.getElementById('messageContainer');
    
    if (!messageInput || !messageContainer) return;
    
    const messageText = messageInput.value.trim();
    if (!messageText) {
        showNotification('Please enter a message', 'error');
        return;
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `
        <div class="message-header">
            <strong>You</strong>
            <span class="message-time">${getCurrentTime()}</span>
        </div>
        <p>${messageText}</p>
    `;
    
    messageContainer.appendChild(messageDiv);
    messageInput.value = '';
    
    // Scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    // Simulate auto-reply after 2 seconds
    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message received';
        replyDiv.innerHTML = `
            <div class="message-header">
                <strong>Clinic Staff</strong>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <p>Thank you for your message. We'll get back to you shortly. If this is urgent, please call our hotline.</p>
        `;
        
        messageContainer.appendChild(replyDiv);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        
        showNotification('New message received', 'success');
    }, 2000);
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// Prescription Functions
function orderMedicine(medicineId) {
    const medicineNames = {
        'amoxicillin': 'Amoxicillin 500mg',
        'paracetamol': 'Paracetamol 500mg'
    };
    
    const medicineName = medicineNames[medicineId] || 'Selected medication';
    
    if (confirm(`Order ${medicineName}? This will be prepared for pickup at the clinic pharmacy.`)) {
        showLoadingState(event.target);
        
        setTimeout(() => {
            hideLoadingState(event.target, 'Order Now');
            showNotification(`${medicineName} ordered successfully! You'll receive pickup instructions via SMS.`, 'success');
            
            // Update button to show ordered status
            event.target.textContent = 'Ordered';
            event.target.classList.remove('btn-primary');
            event.target.classList.add('btn-outline');
            event.target.disabled = true;
        }, 2000);
    }
}

// Profile Functions
function updateProfile() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthDate = document.getElementById('birthDate').value;
    
    if (!fullName || !email || !phone) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    showLoadingState(event.target);
    
    setTimeout(() => {
        hideLoadingState(event.target, 'Update Profile');
        showNotification('Profile updated successfully!', 'success');
        
        // Update current user data
        if (currentUser) {
            currentUser.name = fullName;
            currentUser.email = email;
            currentUser.phone = phone;
            currentUser.birthDate = birthDate;
            updateAuthButtons();
        }
    }, 1500);
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function showLoadingState(button) {
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
    }
}

function hideLoadingState(button, originalText) {
    if (button) {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Keyboard event listeners
document.addEventListener('keydown', function(event) {
    // Close modal on Escape key
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Send message on Enter key
    if (event.key === 'Enter' && event.target.id === 'messageInput') {
        event.preventDefault();
        sendMessage();
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
}

// Call performance measurement after page load
window.addEventListener('load', measurePerformance);

// Add error handling for the entire app
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    showNotification('An error occurred. Please refresh the page and try again.', 'error');
});

// Add online/offline detection
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline. Some features may not work.', 'warning');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        validateEmail,
        validatePhone,
        getCurrentTime
    };
}