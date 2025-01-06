import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  userId: number;
  text: string;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface ChatAreaProps {
  messages: Message[];
  users: User[];
}

function ChatArea({ messages, users }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Message", newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => {
          const user = users.find((u) => u.id === message.userId);
          return (
            <div key={message.id} className="flex items-start space-x-2 mb-4">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-bold mr-2">{user?.name}</span>
                  <span className="text-sm text-gray-500">
                    {message.timestamp}
                  </span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSendNewMessage} className="p-4 border-t flex">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default ChatArea;
