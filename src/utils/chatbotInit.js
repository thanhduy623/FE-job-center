export default function initChatbot() {
    if (window.n8nChatbot) return; // tránh load lại nếu đã init

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://cdn.n8nchatui.com/v1/embed.js";

    script.onload = () => {
        if (window.Chatbot) {
            window.n8nChatbot = window.Chatbot.init({
                n8nChatUrl: "https://n8n.dat3k.tech/webhook/chatbot",
                metadata: {},
                theme: {
                    button: {
                        backgroundColor: "#99212d",
                        right: 20,
                        bottom: 20,
                        size: 50,
                        iconColor: "#ffffff",
                        customIconSrc: "https://www.svgrepo.com/show/339963/chat-bot.svg",
                        customIconSize: 60,
                        customIconBorderRadius: 15,
                        autoWindowOpen: { autoOpen: false, openDelay: 10000000 },
                        borderRadius: "circle",
                    },
                    tooltip: {
                        showTooltip: true,
                        tooltipMessage: "Hello 👋",
                        tooltipBackgroundColor: "#adb5bd",
                        tooltipTextColor: "#000000",
                        tooltipFontSize: 16,
                    },
                    chatWindow: {
                        borderRadiusStyle: "rounded",
                        avatarBorderRadius: 25,
                        messageBorderRadius: 10,
                        showTitle: true,
                        title: "VAS CHATBOT",
                        titleAvatarSrc: "https://www.svgrepo.com/show/339963/chat-bot.svg",
                        avatarSize: 30,
                        welcomeMessage:
                            "Hello! Welcome to Viet Anh School chatbot! May I help you?",
                        errorMessage: "Osshp, some time we error!",
                        backgroundColor: "#ffffff",
                        height: 600,
                        width: 400,
                        fontSize: 16,
                        starterPrompts: ["Information", "Recruitment", "Curriculum vitae"],
                        starterPromptFontSize: 14,
                        renderHTML: true,
                        clearChatOnReload: true,
                        showScrollbar: false,
                        botMessage: {
                            backgroundColor: "#99212d",
                            textColor: "#ffffff",
                            showAvatar: true,
                            avatarSrc: "https://www.svgrepo.com/show/334455/bot.svg",
                            showCopyToClipboardIcon: false,
                        },
                        userMessage: {
                            backgroundColor: "#adb5bd",
                            textColor: "#050505",
                            showAvatar: true,
                            avatarSrc: "https://www.svgrepo.com/show/532363/user-alt-1.svg",
                        },
                        textInput: {
                            placeholder: "Type your query",
                            backgroundColor: "#ffffff",
                            textColor: "#1e1e1f",
                            sendButtonColor: "#f36539",
                            maxChars: 50,
                            maxCharsWarningMessage:
                                "You exceeded the characters limit. Please input less than 50 characters.",
                            autoFocus: false,
                            borderRadius: 6,
                            sendButtonBorderRadius: 50,
                        },
                        uploadsConfig: {
                            enabled: true,
                            acceptFileTypes: ["jpeg", "jpg", "png", "pdf", "doc", "docx"],
                            maxFiles: 1,
                            maxSizeInMB: 10,
                        },
                    },
                },
            });
            console.log("Chat widget initialized!");
        } else {
            console.error("Chatbot module chưa load!");
        }
    };

    document.body.appendChild(script);
}
