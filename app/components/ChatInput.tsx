import React, { useState } from "react";
import { Button } from "./ui/Button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onBeastModeChange: (enabled: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onBeastModeChange,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 flex items-center space-x-4 border-t border-gray-200">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-lg"
        aria-label="Message input"
        tabIndex={0}
      />
      <Button
        onClick={handleSubmit}
        className="button-primary"
        aria-label="Send Message"
        tabIndex={0}
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;