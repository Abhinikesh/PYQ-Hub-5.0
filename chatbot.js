/ Chatbot Integration Script
// Add this to any page to include the AI chatbot

(function() {
    // Load chatbot CSS
    function loadChatbotCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'chatbot.css';
        document.head.appendChild(link);
    }

    // Load Font Awesome if not already loaded
    function loadFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(link);
        }
    }

    // Load chatbot JavaScript
    function loadChatbotJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'chatbot.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Initialize chatbot
    async function initChatbot() {
        try {
            loadChatbotCSS();
            loadFontAwesome();
            await loadChatbotJS();
            
            // Wait a bit for the script to load
            setTimeout(() => {
                if (typeof addChatbotToPage === 'function') {
                    addChatbotToPage();
                }
            }, 100);
        } catch (error) {
            console.error('Failed to load chatbot:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})(); 