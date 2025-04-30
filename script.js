let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let currentAudio = null;
let isFirstInteraction = true;

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('close-btn');
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-input-btn');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const recordingAnimation = document.getElementById('recordingAnimation');
    const chatbotIcon = document.getElementById('chatbot-icon');

    // Explicitly log elements to verify they exist
    console.log("Chatbot icon found:", chatbotIcon !== null);
    console.log("Chatbot window found:", chatbotWindow !== null);

    // ALWAYS clear localStorage on page load
    clearChatMemory();

    const isFirstLogin = () => {
        const firstLogin = localStorage.getItem('firstLogin') === null;
        if (firstLogin) {
            localStorage.setItem('firstLogin', 'false');
            localStorage.removeItem('chatMessages');
        }
        return firstLogin;
    };

    // Function to clear chat memory - more aggressive approach
    function clearChatMemory() {
        // Clear all chat-related localStorage items
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('firstLogin');
        
        // Force clear session storage too
        sessionStorage.clear();
        
        // Clear chat box display
        if (chatBox) {
            chatBox.innerHTML = '';
        }
        
        console.log("Chat memory cleared completely");
    }

    const loadMessages = () => {
        if (!chatBox) return;
        chatBox.innerHTML = '';
        if (!isFirstLogin()) {
            const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
            messages.forEach(msg => {
                if (msg.type === 'text') {
                    appendMessage(msg.sender, msg.text, msg.timestamp);
                }
            });
        }
    };

    const saveMessage = (sender, text, timestamp, type = 'text') => {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push({ sender, text, timestamp, type });
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        }).toUpperCase();
    };

    async function initializeVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const timestamp = formatTime(new Date());

                try {
                    showLoading();
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recording.webm');

                    const response = await fetch('https://voice-proxy.onrender.com/upload-audio', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const recognizedText = result.recognizedText || "Could not recognize speech";

                        appendMessage('user', recognizedText, timestamp);
                        saveMessage('user', recognizedText, timestamp);

                        stopCurrentAudio();
                        await getBotResponse(recognizedText);
                    }
                } catch (error) {
                    console.error('Upload failed:', error);
                    appendMessage('bot', "Sorry, I encountered an error processing your voice message.", formatTime(new Date()));
                } finally {
                    hideLoading();
                    audioChunks = [];
                }
            };
        } catch (error) {
            console.error('Microphone access error:', error);
            appendMessage('bot', "Please enable microphone access to use voice commands.", formatTime(new Date()));
        }
    }

    function appendMessage(sender, message, timestamp) {
        if (!chatBox) return;
        
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;

        const initial = sender === 'user' ? 'YOU' : 'BOT';
        const isBot = sender === 'bot';

        messageDiv.innerHTML = `
            <div class="message-avatar">${initial}</div>
            <div class="message-content ${isBot ? 'message-bot' : ''}">
                <div class="message-text">${message}</div>
                <div class="message-timestamp">${timestamp}</div>
            </div>
        `;

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        if (isFirstInteraction) {
            isFirstInteraction = false;
        }
    }

    function stopCurrentAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
    }

    async function playAudio() {
        try {
            stopCurrentAudio();
            
            const response = await fetch('https://voice-proxy.onrender.com/audio');
            if (!response.ok) throw new Error('Audio fetch failed');
            
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            currentAudio = new Audio(audioUrl);
            currentAudio.autoplay = true;
            
            currentAudio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                currentAudio = null;
                hideLoading();
            };
        } catch (error) {
            console.error('Error playing audio:', error);
            hideLoading();
        }
    }

    async function getBotResponse(message) {
        try {
            showLoading();
            const response = await fetch(`https://voice-proxy.onrender.com/get_next_question/${encodeURIComponent(message)}`);
            const botReply = await response.text();
            
            const timestamp = formatTime(new Date());
            hideLoading();
            appendMessage('bot', botReply, timestamp);
            saveMessage('bot', botReply, timestamp);
           
            await playAudio();
        } catch (error) {
            console.error('Error getting bot response:', error);
            appendMessage('bot', "Sorry, I'm having trouble connecting to the server.", formatTime(new Date()));
        } finally {
            hideLoading();
        }
    }

    async function startChat() {
        try {
            const response = await fetch('https://voice-proxy.onrender.com/first_question');
            const firstQuestion = await response.text();
            
            const timestamp = formatTime(new Date());
            appendMessage('bot', firstQuestion, timestamp);
            saveMessage('bot', firstQuestion, timestamp);
            
            await playAudio();
        } catch (error) {
            console.error('Error starting chat:', error);
            appendMessage('bot', "Welcome to KSFE Assistant! How can I help you today?", formatTime(new Date()));
        }
    }

    async function sendMessage() {
        if (!userInput || !userInput.value) return;
        
        const message = userInput.value.trim();
        if (message) {
            const timestamp = formatTime(new Date());
            appendMessage('user', message, timestamp);
            saveMessage('user', message, timestamp);
            
            userInput.value = '';
            stopCurrentAudio();
            await getBotResponse(message);
        }
    }

    // Recording functions with direct style manipulation
    function startRecording() {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            stopCurrentAudio();
            audioChunks = [];
            mediaRecorder.start();
            isRecording = true;
            
            if (voiceBtn) {
                voiceBtn.style.backgroundColor = '#ff4757';
                voiceBtn.style.transform = 'scale(1.1)';
            }
            
            showRecording();
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            isRecording = false;
            
            if (voiceBtn) {
                voiceBtn.style.backgroundColor = '';
                voiceBtn.style.transform = '';
            }
            
            hideRecording();
        }
    }

    function showLoading() {
        if (loadingAnimation) {
            loadingAnimation.style.display = 'block';
        }
    }

    function hideLoading() {
        if (loadingAnimation) {
            loadingAnimation.style.display = 'none';
        }
    }

    function showRecording() {
        if (recordingAnimation) {
            recordingAnimation.style.display = 'flex';
        }
    }

    function hideRecording() {
        if (recordingAnimation) {
            recordingAnimation.style.display = 'none';
        }
    }

    let isDragging = false;
    let offset = { x: 0, y: 0 };

    // Make chatbot draggable in desktop mode
    if (chatbotWindow) {
        chatbotWindow.addEventListener('mousedown', (e) => {
            if (window.innerWidth >= 768 && e.target.closest('.chat-header')) {
                isDragging = true;
                const rect = chatbotWindow.getBoundingClientRect();
                offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                chatbotWindow.style.cursor = 'grabbing';
            }
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (isDragging && chatbotWindow) {
            const x = e.clientX - offset.x;
            const y = e.clientY - offset.y;
            chatbotWindow.style.left = `${x}px`;
            chatbotWindow.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (chatbotWindow) {
            chatbotWindow.style.cursor = 'default';
        }
    });

    // Set up event listeners
    function setupEventListeners() {
        // Fix for chatbot icon
        if (chatbotIcon) {
            // Remove any existing event listeners
            chatbotIcon.removeEventListener('click', toggleChatWindow);
            
            // Add fresh event listener with debugging
            chatbotIcon.addEventListener('click', toggleChatWindow);
            
            // Make the icon more apparent for debugging
            chatbotIcon.style.cursor = 'pointer';
            chatbotIcon.style.zIndex = '9999';
            
            console.log("Event listener added to chatbot icon");
        }
        
        // Add clear chat button to header
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            // First check if button already exists and remove it to prevent duplicates
            const existingClearBtn = document.getElementById('clear-btn');
            if (existingClearBtn) {
                existingClearBtn.remove();
            }
            
            // Create clear chat button
            const clearBtn = document.createElement('button');
            clearBtn.id = 'clear-btn';
            clearBtn.innerHTML = '<i class="fas fa-trash"></i>';
            clearBtn.title = 'Clear Chat History';
            clearBtn.style.marginRight = '10px';
            
            // Insert before close button
            chatHeader.insertBefore(clearBtn, closeBtn);
            
            // Add event listener
            clearBtn.addEventListener('click', () => {
                clearChatMemory();
                chatBox.innerHTML = ''; // Force clear the chat display
                
                const timestamp = formatTime(new Date());
                appendMessage('bot', "Chat history has been cleared.", timestamp);
                
                // Start fresh chat after a short delay
                setTimeout(() => {
                    startChat();
                }, 500);
            });
        }
        
        // Function to toggle chat window
        function toggleChatWindow(e) {
            console.log("Chatbot icon clicked!");
            e.stopPropagation(); // Prevent event bubbling
            
            if (chatbotWindow) {
                chatbotWindow.classList.toggle('open');
                console.log("Chat window toggled:", chatbotWindow.classList.contains('open'));
            }
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (window.innerWidth >= 768 && chatbotWindow) {
                    chatbotWindow.classList.remove('open');
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }

        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        if (voiceBtn) {
            // Mouse events for desktop
            voiceBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startRecording();
            });
            
            voiceBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                stopRecording();
            });
            
            voiceBtn.addEventListener('mouseleave', (e) => {
                if (isRecording) {
                    e.preventDefault();
                    stopRecording();
                }
            });

            // Touch events for mobile
            voiceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startRecording();
            });
            
            voiceBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                stopRecording();
            });
            
            voiceBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                stopRecording();
            });
        }
    }

    // Check screen size and adjust visibility
    function checkScreenSize() {
        const backgroundElement = document.querySelector('.website-background');
        
        if (window.innerWidth >= 768) {
            if (backgroundElement) backgroundElement.style.display = 'block';
            if (chatbotIcon) {
                chatbotIcon.style.display = 'flex';
                console.log("Chatbot icon should be visible now");
            }
            if (chatbotWindow) {
                // Only close if it was previously opened on mobile
                if (window.lastWidth && window.lastWidth < 768) {
                    chatbotWindow.classList.remove('open');
                }
            }
        } else {
            if (backgroundElement) backgroundElement.style.display = 'none';
            if (chatbotIcon) chatbotIcon.style.display = 'none';
            if (chatbotWindow) chatbotWindow.classList.add('open');
        }
        
        window.lastWidth = window.innerWidth;
    }

    // Add some CSS fixes
    function addStyleFixes() {
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-icon {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #007bff;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                transition: all 0.3s ease;
            }
            
            .chatbot-icon:hover {
                transform: scale(1.1);
                background-color: #0056b3;
            }
            
            .chatbot-icon i {
                font-size: 24px;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .recording-animation {
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                background-color: rgba(255, 71, 87, 0.1);
                border-radius: 10px;
                margin: 10px 0;
            }
            
            .recording-animation i {
                color: #ff4757;
                font-size: 24px;
                animation: pulse 1.5s infinite;
            }
            
            .recording-animation p {
                margin: 5px 0;
                color: #ff4757;
                font-weight: bold;
            }
            
            .recording-animation small {
                color: #ff4757;
                opacity: 0.8;
            }
            
            #voice-input-btn {
                transition: all 0.3s ease;
            }
            
            #voice-input-btn:active {
                transform: scale(0.95);
            }
            
            #clear-btn {
                background: none;
                border: none;
                color: #fff;
                cursor: pointer;
                font-size: 16px;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            #clear-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize everything
    try {
        addStyleFixes();
        initializeVoiceRecording();
        loadMessages();
        startChat();
        setupEventListeners();
        
        window.addEventListener('resize', checkScreenSize);
        // Run once on load
        checkScreenSize();
        
        // Force re-render of chatbot icon after a short delay
        setTimeout(() => {
            if (chatbotIcon) {
                chatbotIcon.style.display = 'none';
                setTimeout(() => {
                    if (window.innerWidth >= 768) {
                        chatbotIcon.style.display = 'flex';
                        console.log("Chatbot icon visibility refreshed");
                    }
                }, 50);
            }
        }, 500);
    } catch (error) {
        console.error("Error initializing chatbot:", error);
    }
});
