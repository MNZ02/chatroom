import UserList from "@/components/UserList";
import ChatArea from "@/components/ChatArea";
import Header from "@/components/Header";
import { getAllUsers } from "@/hooks/useGetallusers";
import { getCurrentUser } from "@/hooks/useGetcurrentuser";
import { useEffect, useState } from "react";

interface User {
  username: string;
  avatar?: string;
}

function Home() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getCurrentUser();
      console.log({ data });
      setCurrentUser(data?.currentUser || null);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data?.users || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const messages = [
    { id: 1, userId: 1, text: "Hey everyone!", timestamp: "2:30 PM" },
    { id: 2, userId: 2, text: "Hi Alice, how are you?", timestamp: "2:31 PM" },
    { id: 3, userId: 3, text: "Hello there!", timestamp: "2:32 PM" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header user={currentUser || { username: "Guest" }} />
      <div className="flex flex-1 overflow-hidden">
        {loading ? <div>Loading</div> : <UserList users={users} />}
        <ChatArea messages={messages} users={users} />
      </div>
    </div>
  );
}

export default Home;
