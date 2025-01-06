import UserList from "./components/UserList";
import ChatArea from "./components/ChatArea";
function App() {
  const users = [
    { id: 1, name: "Alice", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Bob", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=40&width=40" },
  ];

  const messages = [
    { id: 1, userId: 1, text: "Hey everyone!", timestamp: "2:30 PM" },
    { id: 2, userId: 2, text: "Hi Alice, how are you?", timestamp: "2:31 PM" },
    { id: 3, userId: 3, text: "Hello there!", timestamp: "2:32 PM" },
  ];
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <UserList users={users} />
        <ChatArea messages={messages} users={users} />
      </div>
    </>
  );
}

export default App;
