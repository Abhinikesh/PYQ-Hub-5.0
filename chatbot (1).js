// Chatbot JavaScript
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.conversationHistory = [];
        this.typingTimeout = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadConversationHistory();
    }

    initializeElements() {
        this.chatbotContainer = document.querySelector('.chatbot-container');
        this.floatingChatBtn = document.getElementById('floatingChatBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.quickActions = document.querySelectorAll('.quick-action');
    }

    bindEvents() {
        // Floating chat button
        this.floatingChatBtn.addEventListener('click', () => this.toggleChat());

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());

        // Minimize and close buttons
        this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        this.closeBtn.addEventListener('click', () => this.closeChat());

        // Quick actions
        this.quickActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.chatbotContainer.contains(e.target) && 
                !this.floatingChatBtn.contains(e.target) && 
                this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatbotContainer.classList.add('active');
        this.floatingChatBtn.style.display = 'none';
        this.messageInput.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        this.chatbotContainer.classList.remove('active', 'minimized');
        this.floatingChatBtn.style.display = 'flex';
        this.hideTypingIndicator();
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.chatbotContainer.classList.toggle('minimized', this.isMinimized);
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.scrollToBottom();

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const aiResponse = this.generateAIResponse(message);
            this.addMessage(aiResponse, 'bot');
        }, 1000 + Math.random() * 2000);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const icon = document.createElement('i');
        icon.className = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        avatar.appendChild(icon);

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // Handle different content types
        if (typeof content === 'string') {
            bubble.innerHTML = this.formatMessage(content);
        } else if (content.html) {
            bubble.innerHTML = content.html;
        }

        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = this.getCurrentTime();

        messageContent.appendChild(bubble);
        messageContent.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Save to conversation history
        this.conversationHistory.push({
            sender,
            content,
            timestamp: new Date().toISOString()
        });
        this.saveConversationHistory();
    }

    formatMessage(content) {
        // Convert URLs to links
        content = content.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" style="color: #93c5fd; text-decoration: underline;">$1</a>'
        );
        
        // Convert line breaks to <br>
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Study tips
        if (lowerMessage.includes('study') || lowerMessage.includes('tip') || lowerMessage.includes('learn')) {
            return this.getStudyTips();
        }
        
        // Find questions
        if (lowerMessage.includes('find') || lowerMessage.includes('question') || lowerMessage.includes('search')) {
            return this.getFindQuestionsResponse();
        }
        
        // Organize
        if (lowerMessage.includes('organize') || lowerMessage.includes('organize') || lowerMessage.includes('folder')) {
            return this.getOrganizeResponse();
        }
        
        // Exam preparation
        if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('prepare')) {
            return this.getExamPrepResponse();
        }
        
        // General greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! 👋 How can I help you with your studies today?";
        }
        
        // Help
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return this.getHelpResponse();
        }
        
        // Default response
        return this.getDefaultResponse();
    }

    getStudyTips() {
        const tips = [
            "📚 **Active Recall**: Test yourself instead of just re-reading notes",
            "⏰ **Pomodoro Technique**: Study in 25-minute focused sessions",
            "📝 **Mind Mapping**: Create visual connections between concepts",
            "🔄 **Spaced Repetition**: Review material at increasing intervals",
            "🎯 **Set Clear Goals**: Break down topics into manageable chunks"
        ];
        
        return `Here are some effective study strategies:\n\n${tips.join('\n')}\n\nWhich technique would you like to learn more about?`;
    }

    getFindQuestionsResponse() {
        return `I can help you find specific questions! 🔍\n\nTry searching by:\n• Subject (Math, Science, etc.)\n• Topic (Algebra, Physics, etc.)\n• Year or exam type\n• Question type (MCQ, Essay, etc.)\n\nWhat subject or topic are you looking for?`;
    }

    getOrganizeResponse() {
        return `Let's organize your study materials! 📁\n\n**Organization Tips:**\n• Create folders by subject\n• Use consistent naming (YYYY-MM-DD_Subject_Topic)\n• Tag important questions for quick access\n• Keep a master index of all materials\n\nWould you like help setting up a specific organization system?`;
    }

    getExamPrepResponse() {
        return `Exam preparation strategies! 🎯\n\n**Pre-Exam Checklist:**\n✅ Review past papers\n✅ Create summary notes\n✅ Practice time management\n✅ Get adequate sleep\n✅ Prepare materials the night before\n\n**During Exam:**\n• Read all questions first\n• Start with easiest questions\n• Manage your time wisely\n• Review answers if time permits\n\nWhat specific exam are you preparing for?`;
    }

    getHelpResponse() {
        return `I'm your PYQ Hub Assistant! 🤖\n\n**I can help with:**\n📚 Study tips and strategies\n🔍 Finding specific questions\n📝 Organizing your materials\n💡 Learning techniques\n❓ General academic questions\n\nJust ask me anything related to your studies!`;
    }

    getDefaultResponse() {
        const responses = [
            "That's an interesting question! 🤔 Could you tell me more about what you're studying?",
            "I'd be happy to help with that! 📚 What specific aspect would you like to focus on?",
            "Great question! 💡 Let me know if you need help with study strategies, finding questions, or organizing your materials.",
            "I'm here to help with your studies! 🎓 What would you like to work on today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleQuickAction(action) {
        let message = '';
        
        switch(action) {
            case 'study-tips':
                message = 'Can you give me some study tips?';
                break;
            case 'find-questions':
                message = 'I need help finding specific questions';
                break;
            case 'organize':
                message = 'How can I organize my study materials?';
                break;
        }
        
        if (message) {
            this.addMessage(message, 'user');
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.generateAIResponse(message);
                this.addMessage(response, 'bot');
            }, 800);
        }
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    autoResizeTextarea() {
        const textarea = this.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('chatbotHistory');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }

    saveConversationHistory() {
        // Keep only last 50 messages to prevent localStorage overflow
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        localStorage.setItem('chatbotHistory', JSON.stringify(this.conversationHistory));
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

// Add chatbot to existing pages
function addChatbotToPage() {
    // Check if chatbot already exists
    if (document.querySelector('.chatbot-container')) {
        return;
    }

    // Create chatbot elements
    const chatbotHTML = `
        <div class="chatbot-container">
            <div class="chatbot-header">
                <div class="header-content">
                    <div class="bot-info">
                        <div class="bot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="bot-details">
                            <h3>PYQ Hub Assistant</h3>
                            <span class="status online">Online</span>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="minimize-btn" id="minimizeBtn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="close-btn" id="closeBtn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <p>Hello! 👋 I'm your PYQ Hub Assistant. How can I help you today?</p>
                        </div>
                        <span class="message-time">Just now</span>
                    </div>
                </div>
            </div>

            <div class="typing-indicator" id="typingIndicator" style="display: none;">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble typing">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chat-input-area">
                <div class="input-container">
                    <textarea 
                        id="messageInput" 
                        placeholder="Type your message here..."
                        rows="1"
                    ></textarea>
                    <button class="send-btn" id="sendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="quick-actions">
                    <button class="quick-action" data-action="study-tips">
                        <i class="fas fa-lightbulb"></i>
                        Study Tips
                    </button>
                    <button class="quick-action" data-action="find-questions">
                        <i class="fas fa-search"></i>
                        Find Questions
                    </button>
                    <button class="quick-action" data-action="organize">
                        <i class="fas fa-folder"></i>
                        Organize
                    </button>
                </div>
            </div>
        </div>

        <div class="floating-chat-btn" id="floatingChatBtn">
            <i class="fas fa-comments"></i>
        </div>
    `;

    // Add chatbot to page
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Initialize chatbot
    new Chatbot();
}

// Export for use in other pages
window.addChatbotToPage = addChatbotToPage; 