// // // let mediaRecorder;
// // // let audioChunks = [];
// // // let isRecording = false;
// // // let currentAudio = null;
// // // let isFirstInteraction = true;

// // // const chatbotWindow = document.getElementById('chatbot-window');
// // // const closeBtn = document.getElementById('close-btn');
// // // const chatBox = document.getElementById('chatBox');
// // // const userInput = document.getElementById('userInput');
// // // const sendBtn = document.getElementById('send-btn');
// // // const voiceBtn = document.getElementById('voice-input-btn');
// // // const loadingAnimation = document.getElementById('loadingAnimation');
// // // const recordingAnimation = document.getElementById('recordingAnimation');
// // // const chatbotIcon = document.getElementById('chatbot-icon');

// // // const isFirstLogin = () => {
// // //     const firstLogin = localStorage.getItem('firstLogin') === null;
// // //     if (firstLogin) {
// // //         localStorage.setItem('firstLogin', 'false');
// // //         localStorage.removeItem('chatMessages');
// // //     }
// // //     return firstLogin;
// // // };

// // // const loadMessages = () => {
// // //     chatBox.innerHTML = '';
// // //     if (!isFirstLogin()) {
// // //         const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
// // //         messages.forEach(msg => {
// // //             if (msg.type === 'text') {
// // //                 appendMessage(msg.sender, msg.text, msg.timestamp);
// // //             }
// // //         });
// // //     }
// // // };

// // // const saveMessage = (sender, text, timestamp, type = 'text') => {
// // //     const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
// // //     messages.push({ sender, text, timestamp, type });
// // //     localStorage.setItem('chatMessages', JSON.stringify(messages));
// // // };

// // // const formatTime = (date) => {
// // //     return date.toLocaleTimeString([], { 
// // //         hour: '2-digit', 
// // //         minute: '2-digit', 
// // //         second: '2-digit',
// // //         hour12: true 
// // //     }).toUpperCase();
// // // };

// // // async function initializeVoiceRecording() {
// // //     try {
// // //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// // //         mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

// // //         mediaRecorder.ondataavailable = (event) => {
// // //             audioChunks.push(event.data);
// // //         };

// // //         mediaRecorder.onstop = async () => {
// // //             const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
// // //             const timestamp = formatTime(new Date());

// // //             try {
// // //                 showLoading();
// // //                 const formData = new FormData();
// // //                 formData.append('audio', audioBlob, 'recording.webm');

// // //                 const response = await fetch('http://14.139.189.232:8087/upload-audio', {
// // //                     method: 'POST',
// // //                     body: formData,
// // //                 });

// // //                 if (response.ok) {
// // //                     const result = await response.json();
// // //                     const recognizedText = result.recognizedText || "Could not recognize speech";

// // //                     appendMessage('user', recognizedText, timestamp);
// // //                     saveMessage('user', recognizedText, timestamp);

// // //                     stopCurrentAudio();
// // //                     await getBotResponse(recognizedText);
// // //                 }
// // //             } catch (error) {
// // //                 console.error('Upload failed:', error);
// // //                 appendMessage('bot', "Sorry, I encountered an error processing your voice message.", formatTime(new Date()));
// // //             } finally {
// // //                 hideLoading();
// // //                 audioChunks = [];
// // //             }
// // //         };
// // //     } catch (error) {
// // //         console.error('Microphone access error:', error);
// // //         appendMessage('bot', "Please enable microphone access to use voice commands.", formatTime(new Date()));
// // //     }
// // // }

// // // function appendMessage(sender, message, timestamp) {
// // //     const messageDiv = document.createElement("div");
// // //     messageDiv.className = `message ${sender}`;

// // //     const initial = sender === 'user' ? 'YOU' : 'BOT';
// // //     const isBot = sender === 'bot';

// // //     messageDiv.innerHTML = `
// // //         <div class="message-avatar">${initial}</div>
// // //         <div class="message-content ${isBot ? 'message-bot' : ''}">
// // //             <div class="message-text">${message}</div>
// // //             <div class="message-timestamp">${timestamp}</div>
// // //         </div>
// // //     `;

// // //     chatBox.appendChild(messageDiv);
// // //     chatBox.scrollTop = chatBox.scrollHeight;
    
// // //     if (isFirstInteraction) {
// // //         isFirstInteraction = false;
// // //     }
// // // }

// // // function stopCurrentAudio() {
// // //     if (currentAudio) {
// // //         currentAudio.pause();
// // //         currentAudio = null;
// // //     }
// // // }

// // // async function playAudio() {
// // //     try {
// // //         stopCurrentAudio();
// // //         // showLoading();
        
// // //         const response = await fetch('http://14.139.189.232:8087/audio');
// // //         if (!response.ok) throw new Error('Audio fetch failed');
        
// // //         const audioBlob = await response.blob();
// // //         const audioUrl = URL.createObjectURL(audioBlob);
        
// // //         currentAudio = new Audio(audioUrl);
// // //         currentAudio.autoplay = true;
        
// // //         currentAudio.onended = () => {
// // //             URL.revokeObjectURL(audioUrl);
// // //             currentAudio = null;
// // //             hideLoading();
// // //         };
// // //     } catch (error) {
// // //         console.error('Error playing audio:', error);
// // //         hideLoading();
// // //     }
// // // }

// // // async function getBotResponse(message) {
// // //     try {
// // //         showLoading();
// // //         const response = await fetch(`http://14.139.189.232:8087/get_next_question/${encodeURIComponent(message)}`);
// // //         const botReply = await response.text();
        
// // //         const timestamp = formatTime(new Date());
// // //         hideLoading();
// // //         appendMessage('bot', botReply, timestamp);
// // //         saveMessage('bot', botReply, timestamp);
       
        
// // //         await playAudio();
// // //     } catch (error) {
// // //         console.error('Error getting bot response:', error);
// // //         appendMessage('bot', "Sorry, I'm having trouble connecting to the server.", formatTime(new Date()));
// // //     } finally {
// // //         hideLoading();
// // //     }
// // // }

// // // async function startChat() {
// // //     try {
// // //         const response = await fetch('http://14.139.189.232:8087/first_question');
// // //         const firstQuestion = await response.text();
        
// // //         const timestamp = formatTime(new Date());
// // //         appendMessage('bot', firstQuestion, timestamp);
// // //         saveMessage('bot', firstQuestion, timestamp);
        
// // //         await playAudio();
// // //     } catch (error) {
// // //         console.error('Error starting chat:', error);
// // //         appendMessage('bot', "Welcome to KSFE Assistant! How can I help you today?", formatTime(new Date()));
// // //     }
// // // }

// // // async function sendMessage() {
// // //     const message = userInput.value.trim();
// // //     if (message) {
// // //         const timestamp = formatTime(new Date());
// // //         appendMessage('user', message, timestamp);
// // //         saveMessage('user', message, timestamp);
        
// // //         userInput.value = '';
// // //         stopCurrentAudio();
// // //         await getBotResponse(message);
// // //     }
// // // }

// // // function startRecording() {
// // //     if (mediaRecorder && mediaRecorder.state === 'inactive') {
// // //         stopCurrentAudio();
// // //         audioChunks = [];
// // //         mediaRecorder.start();
// // //         isRecording = true;
// // //         voiceBtn.classList.add('recording');
// // //         showRecording();
// // //     }
// // // }

// // // function stopRecording() {
// // //     if (mediaRecorder && mediaRecorder.state === 'recording') {
// // //         mediaRecorder.stop();
// // //         isRecording = false;
// // //         voiceBtn.classList.remove('recording');
// // //         hideRecording();
// // //     }
// // // }

// // // function showLoading() {
// // //     loadingAnimation.style.display = 'block';
// // // }

// // // function hideLoading() {
// // //     loadingAnimation.style.display = 'none';
// // // }

// // // function showRecording() {
// // //     recordingAnimation.style.display = 'block';
// // // }

// // // function hideRecording() {
// // //     recordingAnimation.style.display = 'none';
// // // }

// // // let isDragging = false;
// // // let offset = { x: 0, y: 0 };

// // // chatbotWindow.addEventListener('mousedown', (e) => {
// // //     if (window.innerWidth >= 768 && e.target.closest('.chat-header')) {
// // //         isDragging = true;
// // //         const rect = chatbotWindow.getBoundingClientRect();
// // //         offset = {
// // //             x: e.clientX - rect.left,
// // //             y: e.clientY - rect.top
// // //         };
// // //         chatbotWindow.style.cursor = 'grabbing';
// // //     }
// // // });

// // // document.addEventListener('mousemove', (e) => {
// // //     if (isDragging) {
// // //         const x = e.clientX - offset.x;
// // //         const y = e.clientY - offset.y;
// // //         chatbotWindow.style.left = `${x}px`;
// // //         chatbotWindow.style.top = `${y}px`;
// // //     }
// // // });

// // // document.addEventListener('mouseup', () => {
// // //     isDragging = false;
// // //     if (chatbotWindow) {
// // //         chatbotWindow.style.cursor = 'default';
// // //     }
// // // });

// // // closeBtn.addEventListener('click', () => {
// // //     if (window.innerWidth >= 768) {
// // //         chatbotWindow.classList.remove('open');
// // //     }
// // // });

// // // sendBtn.addEventListener('click', sendMessage);

// // // userInput.addEventListener('keypress', (e) => {
// // //     if (e.key === 'Enter') sendMessage();
// // // });

// // // voiceBtn.addEventListener('mousedown', startRecording);
// // // voiceBtn.addEventListener('mouseup', stopRecording);
// // // voiceBtn.addEventListener('mouseleave', stopRecording);

// // // voiceBtn.addEventListener('touchstart', (e) => {
// // //     e.preventDefault();
// // //     startRecording();
// // // });

// // // voiceBtn.addEventListener('touchend', (e) => {
// // //     e.preventDefault();
// // //     stopRecording();
// // // });

// // // document.addEventListener('DOMContentLoaded', () => {
// // //     initializeVoiceRecording();
// // //     loadMessages();
// // //     startChat();
    
// // //     function checkScreenSize() {
// // //         if (window.innerWidth >= 768) {
// // //             document.querySelector('.website-background').style.display = 'block';
// // //             chatbotIcon.style.display = 'flex';
// // //             chatbotWindow.classList.remove('open');
// // //         } else {
// // //             document.querySelector('.website-background').style.display = 'none';
// // //             chatbotIcon.style.display = 'none';
// // //             chatbotWindow.classList.add('open');
// // //         }
// // //     }
    
// // //     chatbotIcon.addEventListener('click', () => {
// // //         if (window.innerWidth >= 768) {
// // //             chatbotWindow.classList.toggle('open');
// // //         }
// // //     });
    
// // //     window.addEventListener('resize', checkScreenSize);
// // //     checkScreenSize();
// // // });


// // let mediaRecorder;
// // let audioChunks = [];
// // let isRecording = false;
// // let currentAudio = null;
// // let isFirstInteraction = true;

// // const chatbotWindow = document.getElementById('chatbot-window');
// // const closeBtn = document.getElementById('close-btn');
// // const chatBox = document.getElementById('chatBox');
// // const userInput = document.getElementById('userInput');
// // const sendBtn = document.getElementById('send-btn');
// // const voiceBtn = document.getElementById('voice-input-btn');
// // const loadingAnimation = document.getElementById('loadingAnimation');
// // const recordingAnimation = document.getElementById('recordingAnimation');
// // const chatbotIcon = document.getElementById('chatbot-icon');

// // // Function to safely update element styles and classes
// // function safeElementUpdate(element, action, value) {
// //     if (element) {
// //         try {
// //             if (action === 'addClass') {
// //                 element.classList.add(value);
// //             } else if (action === 'removeClass') {
// //                 element.classList.remove(value);
// //             } else if (action === 'setStyle') {
// //                 element.style[value.property] = value.value;
// //             }
// //         } catch (error) {
// //             console.error(`Failed to ${action} on element:`, error);
// //         }
// //     }
// // }

// // const isFirstLogin = () => {
// //     const firstLogin = localStorage.getItem('firstLogin') === null;
// //     if (firstLogin) {
// //         localStorage.setItem('firstLogin', 'false');
// //         localStorage.removeItem('chatMessages');
// //     }
// //     return firstLogin;
// // };

// // const loadMessages = () => {
// //     chatBox.innerHTML = '';
// //     if (!isFirstLogin()) {
// //         const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
// //         messages.forEach(msg => {
// //             if (msg.type === 'text') {
// //                 appendMessage(msg.sender, msg.text, msg.timestamp);
// //             }
// //         });
// //     }
// // };

// // const saveMessage = (sender, text, timestamp, type = 'text') => {
// //     const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
// //     messages.push({ sender, text, timestamp, type });
// //     localStorage.setItem('chatMessages', JSON.stringify(messages));
// // };

// // const formatTime = (date) => {
// //     return date.toLocaleTimeString([], { 
// //         hour: '2-digit', 
// //         minute: '2-digit', 
// //         second: '2-digit',
// //         hour12: true 
// //     }).toUpperCase();
// // };

// // async function initializeVoiceRecording() {
// //     try {
// //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //         mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

// //         mediaRecorder.ondataavailable = (event) => {
// //             audioChunks.push(event.data);
// //         };

// //         mediaRecorder.onstop = async () => {
// //             const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
// //             const timestamp = formatTime(new Date());

// //             try {
// //                 showLoading();
// //                 const formData = new FormData();
// //                 formData.append('audio', audioBlob, 'recording.webm');

// //                 const response = await fetch('http://14.139.189.232:8087/upload-audio', {
// //                     method: 'POST',
// //                     body: formData,
// //                 });

// //                 if (response.ok) {
// //                     const result = await response.json();
// //                     const recognizedText = result.recognizedText || "Could not recognize speech";

// //                     appendMessage('user', recognizedText, timestamp);
// //                     saveMessage('user', recognizedText, timestamp);

// //                     stopCurrentAudio();
// //                     await getBotResponse(recognizedText);
// //                 }
// //             } catch (error) {
// //                 console.error('Upload failed:', error);
// //                 appendMessage('bot', "Sorry, I encountered an error processing your voice message.", formatTime(new Date()));
// //             } finally {
// //                 hideLoading();
// //                 audioChunks = [];
// //             }
// //         };
// //     } catch (error) {
// //         console.error('Microphone access error:', error);
// //         appendMessage('bot', "Please enable microphone access to use voice commands.", formatTime(new Date()));
// //     }
// // }

// // function appendMessage(sender, message, timestamp) {
// //     const messageDiv = document.createElement("div");
// //     messageDiv.className = `message ${sender}`;

// //     const initial = sender === 'user' ? 'YOU' : 'BOT';
// //     const isBot = sender === 'bot';

// //     messageDiv.innerHTML = `
// //         <div class="message-avatar">${initial}</div>
// //         <div class="message-content ${isBot ? 'message-bot' : ''}">
// //             <div class="message-text">${message}</div>
// //             <div class="message-timestamp">${timestamp}</div>
// //         </div>
// //     `;

// //     chatBox.appendChild(messageDiv);
// //     chatBox.scrollTop = chatBox.scrollHeight;
    
// //     if (isFirstInteraction) {
// //         isFirstInteraction = false;
// //     }
// // }

// // function stopCurrentAudio() {
// //     if (currentAudio) {
// //         currentAudio.pause();
// //         currentAudio = null;
// //     }
// // }

// // async function playAudio() {
// //     try {
// //         stopCurrentAudio();
        
// //         const response = await fetch('http://14.139.189.232:8087/audio');
// //         if (!response.ok) throw new Error('Audio fetch failed');
        
// //         const audioBlob = await response.blob();
// //         const audioUrl = URL.createObjectURL(audioBlob);
        
// //         currentAudio = new Audio(audioUrl);
// //         currentAudio.autoplay = true;
        
// //         currentAudio.onended = () => {
// //             URL.revokeObjectURL(audioUrl);
// //             currentAudio = null;
// //             hideLoading();
// //         };
// //     } catch (error) {
// //         console.error('Error playing audio:', error);
// //         hideLoading();
// //     }
// // }

// // async function getBotResponse(message) {
// //     try {
// //         showLoading();
// //         const response = await fetch(`http://14.139.189.232:8087/get_next_question/${encodeURIComponent(message)}`);
// //         const botReply = await response.text();
        
// //         const timestamp = formatTime(new Date());
// //         hideLoading();
// //         appendMessage('bot', botReply, timestamp);
// //         saveMessage('bot', botReply, timestamp);
       
// //         await playAudio();
// //     } catch (error) {
// //         console.error('Error getting bot response:', error);
// //         appendMessage('bot', "Sorry, I'm having trouble connecting to the server.", formatTime(new Date()));
// //     } finally {
// //         hideLoading();
// //     }
// // }

// // async function startChat() {
// //     try {
// //         const response = await fetch('http://14.139.189.232:8087/first_question');
// //         const firstQuestion = await response.text();
        
// //         const timestamp = formatTime(new Date());
// //         appendMessage('bot', firstQuestion, timestamp);
// //         saveMessage('bot', firstQuestion, timestamp);
        
// //         await playAudio();
// //     } catch (error) {
// //         console.error('Error starting chat:', error);
// //         appendMessage('bot', "Welcome to KSFE Assistant! How can I help you today?", formatTime(new Date()));
// //     }
// // }

// // async function sendMessage() {
// //     const message = userInput.value.trim();
// //     if (message) {
// //         const timestamp = formatTime(new Date());
// //         appendMessage('user', message, timestamp);
// //         saveMessage('user', message, timestamp);
        
// //         userInput.value = '';
// //         stopCurrentAudio();
// //         await getBotResponse(message);
// //     }
// // }

// // // Improved recording functions with better animation handling
// // function startRecording() {
// //     if (mediaRecorder && mediaRecorder.state === 'inactive') {
// //         stopCurrentAudio();
// //         audioChunks = [];
// //         mediaRecorder.start();
// //         isRecording = true;
        
// //         // Use direct style manipulation instead of classList
// //         if (voiceBtn) {
// //             voiceBtn.style.backgroundColor = '#ff4757'; // Red color when recording
// //             voiceBtn.style.animation = 'pulse 1.5s infinite';
// //         }
        
// //         showRecording();
// //     }
// // }

// // function stopRecording() {
// //     if (mediaRecorder && mediaRecorder.state === 'recording') {
// //         mediaRecorder.stop();
// //         isRecording = false;
        
// //         // Reset styles directly
// //         if (voiceBtn) {
// //             voiceBtn.style.backgroundColor = ''; // Reset to default
// //             voiceBtn.style.animation = '';
// //         }
        
// //         hideRecording();
// //     }
// // }

// // function showLoading() {
// //     if (loadingAnimation) {
// //         loadingAnimation.style.display = 'block';
// //     }
// // }

// // function hideLoading() {
// //     if (loadingAnimation) {
// //         loadingAnimation.style.display = 'none';
// //     }
// // }

// // function showRecording() {
// //     if (recordingAnimation) {
// //         recordingAnimation.innerHTML = `
// //             <div class="recording-pulse"></div>
// //             <span>Recording...</span>
// //         `;
// //         recordingAnimation.style.display = 'flex';
// //     }
// // }

// // function hideRecording() {
// //     if (recordingAnimation) {
// //         recordingAnimation.style.display = 'none';
// //     }
// // }

// // let isDragging = false;
// // let offset = { x: 0, y: 0 };

// // chatbotWindow.addEventListener('mousedown', (e) => {
// //     if (window.innerWidth >= 768 && e.target.closest('.chat-header')) {
// //         isDragging = true;
// //         const rect = chatbotWindow.getBoundingClientRect();
// //         offset = {
// //             x: e.clientX - rect.left,
// //             y: e.clientY - rect.top
// //         };
// //         chatbotWindow.style.cursor = 'grabbing';
// //     }
// // });

// // document.addEventListener('mousemove', (e) => {
// //     if (isDragging) {
// //         const x = e.clientX - offset.x;
// //         const y = e.clientY - offset.y;
// //         chatbotWindow.style.left = `${x}px`;
// //         chatbotWindow.style.top = `${y}px`;
// //     }
// // });

// // document.addEventListener('mouseup', () => {
// //     isDragging = false;
// //     if (chatbotWindow) {
// //         chatbotWindow.style.cursor = 'default';
// //     }
// // });

// // // Initialize all event listeners
// // function initializeEventListeners() {
// //     if (closeBtn) {
// //         closeBtn.addEventListener('click', () => {
// //             if (window.innerWidth >= 768) {
// //                 safeElementUpdate(chatbotWindow, 'removeClass', 'open');
// //             }
// //         });
// //     }

// //     if (sendBtn) {
// //         sendBtn.addEventListener('click', sendMessage);
// //     }

// //     if (userInput) {
// //         userInput.addEventListener('keypress', (e) => {
// //             if (e.key === 'Enter') sendMessage();
// //         });
// //     }

// //     if (voiceBtn) {
// //         // For desktop
// //         voiceBtn.addEventListener('mousedown', (e) => {
// //             e.preventDefault();
// //             startRecording();
// //         });
        
// //         voiceBtn.addEventListener('mouseup', (e) => {
// //             e.preventDefault();
// //             stopRecording();
// //         });
        
// //         voiceBtn.addEventListener('mouseleave', (e) => {
// //             if (isRecording) {
// //                 e.preventDefault();
// //                 stopRecording();
// //             }
// //         });

// //         // For mobile
// //         voiceBtn.addEventListener('touchstart', (e) => {
// //             e.preventDefault();
// //             startRecording();
// //         });
        
// //         voiceBtn.addEventListener('touchend', (e) => {
// //             e.preventDefault();
// //             stopRecording();
// //         });
        
// //         voiceBtn.addEventListener('touchcancel', (e) => {
// //             e.preventDefault();
// //             stopRecording();
// //         });
// //     }

// //     if (chatbotIcon) {
// //         chatbotIcon.addEventListener('click', () => {
// //             if (window.innerWidth >= 768) {
// //                 safeElementUpdate(chatbotWindow, 'toggle', 'open');
// //             }
// //         });
// //     }
// // }

// // document.addEventListener('DOMContentLoaded', () => {
// //     try {
// //         initializeVoiceRecording();
// //         loadMessages();
// //         startChat();
// //         initializeEventListeners();
        
// //         function checkScreenSize() {
// //             if (window.innerWidth >= 768) {
// //                 const backgroundElement = document.querySelector('.website-background');
// //                 if (backgroundElement) backgroundElement.style.display = 'block';
// //                 if (chatbotIcon) chatbotIcon.style.display = 'flex';
// //                 if (chatbotWindow) chatbotWindow.classList.remove('open');
// //             } else {
// //                 const backgroundElement = document.querySelector('.website-background');
// //                 if (backgroundElement) backgroundElement.style.display = 'none';
// //                 if (chatbotIcon) chatbotIcon.style.display = 'none';
// //                 if (chatbotWindow) chatbotWindow.classList.add('open');
// //             }
// //         }
        
// //         window.addEventListener('resize', checkScreenSize);
// //         checkScreenSize();
// //     } catch (error) {
// //         console.error("Error initializing chatbot:", error);
// //     }
// // });

// // // Add CSS for recording animation
// // document.head.insertAdjacentHTML('beforeend', `
// // <style>
// // @keyframes pulse {
// //     0% { transform: scale(1); }
// //     50% { transform: scale(1.1); }
// //     100% { transform: scale(1); }
// // }

// // #recordingAnimation {
// //     display: none;
// //     align-items: center;
// //     justify-content: center;
// //     background-color: rgba(255, 71, 87, 0.1);
// //     padding: 8px 12px;
// //     border-radius: 20px;
// //     margin: 8px 0;
// //     color: #ff4757;
// //     font-weight: bold;
// // }

// // .recording-pulse {
// //     width: 12px;
// //     height: 12px;
// //     background-color: #ff4757;
// //     border-radius: 50%;
// //     margin-right: 8px;
// //     animation: pulse 1.5s infinite;
// // }

// // #voice-input-btn {
// //     transition: all 0.3s ease;
// // }

// // #voice-input-btn:active {
// //     transform: scale(0.95);
// // }

// // #loadingAnimation {
// //     display: none;
// //     text-align: center;
// //     padding: 10px;
// // }

// // .loading-dots {
// //     display: inline-block;
// // }

// // .loading-dots span {
// //     display: inline-block;
// //     width: 8px;
// //     height: 8px;
// //     background-color: #007bff;
// //     border-radius: 50%;
// //     margin: 0 3px;
// //     animation: loading 1.4s infinite ease-in-out both;
// // }

// // .loading-dots span:nth-child(1) {
// //     animation-delay: -0.32s;
// // }

// // .loading-dots span:nth-child(2) {
// //     animation-delay: -0.16s;
// // }

// // @keyframes loading {
// //     0%, 80%, 100% { transform: scale(0); }
// //     40% { transform: scale(1); }
// // }
// // </style>
// // `);
// let mediaRecorder;
// let audioChunks = [];
// let isRecording = false;
// let currentAudio = null;
// let isFirstInteraction = true;

// // Wait for DOM to be fully loaded before accessing elements
// document.addEventListener('DOMContentLoaded', () => {
//     const chatbotWindow = document.getElementById('chatbot-window');
//     const closeBtn = document.getElementById('close-btn');
//     const chatBox = document.getElementById('chatBox');
//     const userInput = document.getElementById('userInput');
//     const sendBtn = document.getElementById('send-btn');
//     const voiceBtn = document.getElementById('voice-input-btn');
//     const loadingAnimation = document.getElementById('loadingAnimation');
//     const recordingAnimation = document.getElementById('recordingAnimation');
//     const chatbotIcon = document.getElementById('chatbot-icon');

//     // Explicitly log elements to verify they exist
//     console.log("Chatbot icon found:", chatbotIcon !== null);
//     console.log("Chatbot window found:", chatbotWindow !== null);

//     const isFirstLogin = () => {
//         const firstLogin = localStorage.getItem('firstLogin') === null;
//         if (firstLogin) {
//             localStorage.setItem('firstLogin', 'false');
//             localStorage.removeItem('chatMessages');
//         }
//         return firstLogin;
//     };

//     const loadMessages = () => {
//         if (!chatBox) return;
//         chatBox.innerHTML = '';
//         if (!isFirstLogin()) {
//             const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
//             messages.forEach(msg => {
//                 if (msg.type === 'text') {
//                     appendMessage(msg.sender, msg.text, msg.timestamp);
//                 }
//             });
//         }
//     };

//     const saveMessage = (sender, text, timestamp, type = 'text') => {
//         const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
//         messages.push({ sender, text, timestamp, type });
//         localStorage.setItem('chatMessages', JSON.stringify(messages));
//     };

//     const formatTime = (date) => {
//         return date.toLocaleTimeString([], { 
//             hour: '2-digit', 
//             minute: '2-digit', 
//             second: '2-digit',
//             hour12: true 
//         }).toUpperCase();
//     };

//     async function initializeVoiceRecording() {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

//             mediaRecorder.ondataavailable = (event) => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = async () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//                 const timestamp = formatTime(new Date());

//                 try {
//                     showLoading();
//                     const formData = new FormData();
//                     formData.append('audio', audioBlob, 'recording.webm');

//                     const response = await fetch('http://14.139.189.232:8087/upload-audio', {
//                         method: 'POST',
//                         body: formData,
//                     });

//                     if (response.ok) {
//                         const result = await response.json();
//                         const recognizedText = result.recognizedText || "Could not recognize speech";

//                         appendMessage('user', recognizedText, timestamp);
//                         saveMessage('user', recognizedText, timestamp);

//                         stopCurrentAudio();
//                         await getBotResponse(recognizedText);
//                     }
//                 } catch (error) {
//                     console.error('Upload failed:', error);
//                     appendMessage('bot', "Sorry, I encountered an error processing your voice message.", formatTime(new Date()));
//                 } finally {
//                     hideLoading();
//                     audioChunks = [];
//                 }
//             };
//         } catch (error) {
//             console.error('Microphone access error:', error);
//             appendMessage('bot', "Please enable microphone access to use voice commands.", formatTime(new Date()));
//         }
//     }

//     function appendMessage(sender, message, timestamp) {
//         if (!chatBox) return;
        
//         const messageDiv = document.createElement("div");
//         messageDiv.className = `message ${sender}`;

//         const initial = sender === 'user' ? 'YOU' : 'BOT';
//         const isBot = sender === 'bot';

//         messageDiv.innerHTML = `
//             <div class="message-avatar">${initial}</div>
//             <div class="message-content ${isBot ? 'message-bot' : ''}">
//                 <div class="message-text">${message}</div>
//                 <div class="message-timestamp">${timestamp}</div>
//             </div>
//         `;

//         chatBox.appendChild(messageDiv);
//         chatBox.scrollTop = chatBox.scrollHeight;
        
//         if (isFirstInteraction) {
//             isFirstInteraction = false;
//         }
//     }

//     function stopCurrentAudio() {
//         if (currentAudio) {
//             currentAudio.pause();
//             currentAudio = null;
//         }
//     }

//     async function playAudio() {
//         try {
//             stopCurrentAudio();
            
//             const response = await fetch('http://14.139.189.232:8087/audio');
//             if (!response.ok) throw new Error('Audio fetch failed');
            
//             const audioBlob = await response.blob();
//             const audioUrl = URL.createObjectURL(audioBlob);
            
//             currentAudio = new Audio(audioUrl);
//             currentAudio.autoplay = true;
            
//             currentAudio.onended = () => {
//                 URL.revokeObjectURL(audioUrl);
//                 currentAudio = null;
//                 hideLoading();
//             };
//         } catch (error) {
//             console.error('Error playing audio:', error);
//             hideLoading();
//         }
//     }

//     async function getBotResponse(message) {
//         try {
//             showLoading();
//             const response = await fetch(`http://14.139.189.232:8087/get_next_question/${encodeURIComponent(message)}`);
//             const botReply = await response.text();
            
//             const timestamp = formatTime(new Date());
//             hideLoading();
//             appendMessage('bot', botReply, timestamp);
//             saveMessage('bot', botReply, timestamp);
           
//             await playAudio();
//         } catch (error) {
//             console.error('Error getting bot response:', error);
//             appendMessage('bot', "Sorry, I'm having trouble connecting to the server.", formatTime(new Date()));
//         } finally {
//             hideLoading();
//         }
//     }

//     async function startChat() {
//         try {
//             const response = await fetch('http://14.139.189.232:8087/first_question');
//             const firstQuestion = await response.text();
            
//             const timestamp = formatTime(new Date());
//             appendMessage('bot', firstQuestion, timestamp);
//             saveMessage('bot', firstQuestion, timestamp);
            
//             await playAudio();
//         } catch (error) {
//             console.error('Error starting chat:', error);
//             appendMessage('bot', "Welcome to KSFE Assistant! How can I help you today?", formatTime(new Date()));
//         }
//     }

//     async function sendMessage() {
//         if (!userInput || !userInput.value) return;
        
//         const message = userInput.value.trim();
//         if (message) {
//             const timestamp = formatTime(new Date());
//             appendMessage('user', message, timestamp);
//             saveMessage('user', message, timestamp);
            
//             userInput.value = '';
//             stopCurrentAudio();
//             await getBotResponse(message);
//         }
//     }

//     // Recording functions with direct style manipulation
//     function startRecording() {
//         if (mediaRecorder && mediaRecorder.state === 'inactive') {
//             stopCurrentAudio();
//             audioChunks = [];
//             mediaRecorder.start();
//             isRecording = true;
            
//             if (voiceBtn) {
//                 voiceBtn.style.backgroundColor = '#ff4757';
//                 voiceBtn.style.transform = 'scale(1.1)';
//             }
            
//             showRecording();
//         }
//     }

//     function stopRecording() {
//         if (mediaRecorder && mediaRecorder.state === 'recording') {
//             mediaRecorder.stop();
//             isRecording = false;
            
//             if (voiceBtn) {
//                 voiceBtn.style.backgroundColor = '';
//                 voiceBtn.style.transform = '';
//             }
            
//             hideRecording();
//         }
//     }

//     function showLoading() {
//         if (loadingAnimation) {
//             loadingAnimation.style.display = 'block';
//         }
//     }

//     function hideLoading() {
//         if (loadingAnimation) {
//             loadingAnimation.style.display = 'none';
//         }
//     }

//     function showRecording() {
//         if (recordingAnimation) {
//             recordingAnimation.style.display = 'flex';
//         }
//     }

//     function hideRecording() {
//         if (recordingAnimation) {
//             recordingAnimation.style.display = 'none';
//         }
//     }

//     let isDragging = false;
//     let offset = { x: 0, y: 0 };

//     // Make chatbot draggable in desktop mode
//     if (chatbotWindow) {
//         chatbotWindow.addEventListener('mousedown', (e) => {
//             if (window.innerWidth >= 768 && e.target.closest('.chat-header')) {
//                 isDragging = true;
//                 const rect = chatbotWindow.getBoundingClientRect();
//                 offset = {
//                     x: e.clientX - rect.left,
//                     y: e.clientY - rect.top
//                 };
//                 chatbotWindow.style.cursor = 'grabbing';
//             }
//         });
//     }

//     document.addEventListener('mousemove', (e) => {
//         if (isDragging && chatbotWindow) {
//             const x = e.clientX - offset.x;
//             const y = e.clientY - offset.y;
//             chatbotWindow.style.left = `${x}px`;
//             chatbotWindow.style.top = `${y}px`;
//         }
//     });

//     document.addEventListener('mouseup', () => {
//         isDragging = false;
//         if (chatbotWindow) {
//             chatbotWindow.style.cursor = 'default';
//         }
//     });

//     // Set up event listeners
//     function setupEventListeners() {
//         // Fix for chatbot icon
//         if (chatbotIcon) {
//             // Remove any existing event listeners
//             chatbotIcon.removeEventListener('click', toggleChatWindow);
            
//             // Add fresh event listener with debugging
//             chatbotIcon.addEventListener('click', toggleChatWindow);
            
//             // Make the icon more apparent for debugging
//             chatbotIcon.style.cursor = 'pointer';
//             chatbotIcon.style.zIndex = '9999';
            
//             console.log("Event listener added to chatbot icon");
//         }
        
//         // Function to toggle chat window
//         function toggleChatWindow(e) {
//             console.log("Chatbot icon clicked!");
//             e.stopPropagation(); // Prevent event bubbling
            
//             if (chatbotWindow) {
//                 chatbotWindow.classList.toggle('open');
//                 console.log("Chat window toggled:", chatbotWindow.classList.contains('open'));
//             }
//         }

//         if (closeBtn) {
//             closeBtn.addEventListener('click', () => {
//                 if (window.innerWidth >= 768 && chatbotWindow) {
//                     chatbotWindow.classList.remove('open');
//                 }
//             });
//         }

//         if (sendBtn) {
//             sendBtn.addEventListener('click', sendMessage);
//         }

//         if (userInput) {
//             userInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') sendMessage();
//             });
//         }

//         if (voiceBtn) {
//             // Mouse events for desktop
//             voiceBtn.addEventListener('mousedown', (e) => {
//                 e.preventDefault();
//                 startRecording();
//             });
            
//             voiceBtn.addEventListener('mouseup', (e) => {
//                 e.preventDefault();
//                 stopRecording();
//             });
            
//             voiceBtn.addEventListener('mouseleave', (e) => {
//                 if (isRecording) {
//                     e.preventDefault();
//                     stopRecording();
//                 }
//             });

//             // Touch events for mobile
//             voiceBtn.addEventListener('touchstart', (e) => {
//                 e.preventDefault();
//                 startRecording();
//             });
            
//             voiceBtn.addEventListener('touchend', (e) => {
//                 e.preventDefault();
//                 stopRecording();
//             });
            
//             voiceBtn.addEventListener('touchcancel', (e) => {
//                 e.preventDefault();
//                 stopRecording();
//             });
//         }
//     }

//     // Check screen size and adjust visibility
//     function checkScreenSize() {
//         const backgroundElement = document.querySelector('.website-background');
        
//         if (window.innerWidth >= 768) {
//             if (backgroundElement) backgroundElement.style.display = 'block';
//             if (chatbotIcon) {
//                 chatbotIcon.style.display = 'flex';
//                 console.log("Chatbot icon should be visible now");
//             }
//             if (chatbotWindow) {
//                 // Only close if it was previously opened on mobile
//                 if (window.lastWidth && window.lastWidth < 768) {
//                     chatbotWindow.classList.remove('open');
//                 }
//             }
//         } else {
//             if (backgroundElement) backgroundElement.style.display = 'none';
//             if (chatbotIcon) chatbotIcon.style.display = 'none';
//             if (chatbotWindow) chatbotWindow.classList.add('open');
//         }
        
//         window.lastWidth = window.innerWidth;
//     }

//     // Add some CSS fixes
//     function addStyleFixes() {
//         const style = document.createElement('style');
//         style.textContent = `
//             .chatbot-icon {
//                 position: fixed;
//                 bottom: 20px;
//                 right: 20px;
//                 width: 60px;
//                 height: 60px;
//                 background-color: #007bff;
//                 color: white;
//                 border-radius: 50%;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 cursor: pointer;
//                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//                 z-index: 9999;
//                 transition: all 0.3s ease;
//             }
            
//             .chatbot-icon:hover {
//                 transform: scale(1.1);
//                 background-color: #0056b3;
//             }
            
//             .chatbot-icon i {
//                 font-size: 24px;
//             }
            
//             @keyframes pulse {
//                 0% { transform: scale(1); opacity: 1; }
//                 50% { transform: scale(1.1); opacity: 0.7; }
//                 100% { transform: scale(1); opacity: 1; }
//             }
            
//             .recording-animation {
//                 display: none;
//                 flex-direction: column;
//                 align-items: center;
//                 justify-content: center;
//                 padding: 10px;
//                 background-color: rgba(255, 71, 87, 0.1);
//                 border-radius: 10px;
//                 margin: 10px 0;
//             }
            
//             .recording-animation i {
//                 color: #ff4757;
//                 font-size: 24px;
//                 animation: pulse 1.5s infinite;
//             }
            
//             .recording-animation p {
//                 margin: 5px 0;
//                 color: #ff4757;
//                 font-weight: bold;
//             }
            
//             .recording-animation small {
//                 color: #ff4757;
//                 opacity: 0.8;
//             }
            
//             #voice-input-btn {
//                 transition: all 0.3s ease;
//             }
            
//             #voice-input-btn:active {
//                 transform: scale(0.95);
//             }
//         `;
//         document.head.appendChild(style);
//     }

//     // Initialize everything
//     try {
//         addStyleFixes();
//         initializeVoiceRecording();
//         loadMessages();
//         startChat();
//         setupEventListeners();
        
//         window.addEventListener('resize', checkScreenSize);
//         // Run once on load
//         checkScreenSize();
        
//         // Force re-render of chatbot icon after a short delay
//         setTimeout(() => {
//             if (chatbotIcon) {
//                 chatbotIcon.style.display = 'none';
//                 setTimeout(() => {
//                     if (window.innerWidth >= 768) {
//                         chatbotIcon.style.display = 'flex';
//                         console.log("Chatbot icon visibility refreshed");
//                     }
//                 }, 50);
//             }
//         }, 500);
//     } catch (error) {
//         console.error("Error initializing chatbot:", error);
//     }
// });


let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let currentAudio = null;
let isFirstInteraction = true;
let microphoneAvailable = false;

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

    // Check if site is running on HTTPS
    const isSecureContext = window.isSecureContext;
    console.log("Running in secure context:", isSecureContext);

    const isFirstLogin = () => {
        const firstLogin = localStorage.getItem('firstLogin') === null;
        if (firstLogin) {
            localStorage.setItem('firstLogin', 'false');
            localStorage.removeItem('chatMessages');
        }
        return firstLogin;
    };

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

    // Modified to handle HTTP context gracefully
    async function initializeVoiceRecording() {
        if (!isSecureContext) {
            console.warn("Site is not running in a secure context. Voice recording disabled.");
            if (voiceBtn) {
                // Convert voice button to help button on HTTP sites
                voiceBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
                voiceBtn.title = "Voice recording requires HTTPS";
                
                // Update click behavior to show message instead
                voiceBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSecureContextWarning();
                });
            }
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            microphoneAvailable = true;

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

                    const response = await fetch('http://14.139.189.232:8087/upload-audio', {
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
            microphoneAvailable = false;
            console.error('Microphone access error:', error);
            
            if (voiceBtn) {
                // Visual indication that mic is not available
                voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceBtn.title = "Microphone access denied";
                
                voiceBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    appendMessage('bot', "Please enable microphone access to use voice commands.", formatTime(new Date()));
                });
            }
        }
    }

    // Show warning about HTTPS requirement
    function showSecureContextWarning() {
        const timestamp = formatTime(new Date());
        appendMessage('bot', "Voice recording requires a secure connection (HTTPS). Please use the text input instead.", timestamp);
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
            
            const response = await fetch('http://14.139.189.232:8087/audio');
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
            const response = await fetch(`http://14.139.189.232:8087/get_next_question/${encodeURIComponent(message)}`);
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
            const response = await fetch('http://14.139.189.232:8087/first_question');
            const firstQuestion = await response.text();
            
            const timestamp = formatTime(new Date());
            appendMessage('bot', firstQuestion, timestamp);
            saveMessage('bot', firstQuestion, timestamp);
            
            // If not on HTTPS, explain the voice limitation
            if (!isSecureContext) {
                setTimeout(() => {
                    appendMessage('bot', "Note: Voice recording is disabled because this site is not running on HTTPS. Please type your questions instead.", formatTime(new Date()));
                }, 1000);
            }
            
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
        if (microphoneAvailable && mediaRecorder && mediaRecorder.state === 'inactive') {
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
        if (microphoneAvailable && mediaRecorder && mediaRecorder.state === 'recording') {
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
            chatbotIcon.removeEventListener('click', toggleChatWindow);
            chatbotIcon.addEventListener('click', toggleChatWindow);
            chatbotIcon.style.cursor = 'pointer';
            chatbotIcon.style.zIndex = '9999';
        }
        
        // Function to toggle chat window
        function toggleChatWindow(e) {
            e.stopPropagation();
            if (chatbotWindow) {
                chatbotWindow.classList.toggle('open');
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

        // Only set up voice recording events if microphone is available
        if (isSecureContext && voiceBtn) {
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
            if (chatbotIcon) chatbotIcon.style.display = 'flex';
            if (chatbotWindow) {
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

    // Add style fixes
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
            
            /* Recording animation styles */
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
            
            #voice-input-btn.unavailable {
                background-color: #d9d9d9;
                color: #888;
                cursor: not-allowed;
            }
            
            #voice-input-btn:active {
                transform: scale(0.95);
            }
            
            .https-message {
                background-color: #fff3cd;
                color: #856404;
                padding: 8px 12px;
                border-radius: 4px;
                margin: 8px 0;
                font-size: 12px;
                text-align: center;
            }
            
            .https-message a {
                color: #856404;
                text-decoration: underline;
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
        checkScreenSize();
        
        // Force re-render of chatbot icon after a short delay
        setTimeout(() => {
            if (chatbotIcon) {
                chatbotIcon.style.display = 'none';
                setTimeout(() => {
                    if (window.innerWidth >= 768) {
                        chatbotIcon.style.display = 'flex';
                    }
                }, 50);
            }
        }, 500);
    } catch (error) {
        console.error("Error initializing chatbot:", error);
    }
});
