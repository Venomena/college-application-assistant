import React, { useEffect, useRef } from 'react';

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('##')) {
          return `<h2 key=${i} class="text-xl font-semibold mb-2">${line.substring(2).trim()}</h2>`;
        }
        if (line.startsWith('*')) {
          return `<li key=${i} class="list-disc pl-5 mb-1">${line.substring(1).trim()}</li>`;
        }
        if (line.includes('[http')) {
          const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
          return line.replace(regex, '<a key=${i} href="$2" class="text-white underline" target="_blank">$1</a>');
        }
        return `<p key=${i} class="mb-2">${line}</p>`;
      })
      .join('');
  };

  return (
    <div
      ref={containerRef}
      className="chat-container p-4 bg-black border border-white rounded-lg overflow-y-auto flex-1 relative text-white"
    >
      {messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p className="text-center">Don&apos;t forget to upload your application/CV before chatting 👉</p>
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-4 mb-4`}
        >
          {msg.role === "ai" ? (
            <div
              className="ai-message p-4 rounded-lg border border-white bg-black text-white"
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
            />
          ) : (
            <div className="user-message p-4 rounded-lg border border-white bg-black text-white">
              {msg.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
