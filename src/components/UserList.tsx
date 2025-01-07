import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  username: string;
  avatar: string;
}

interface UserListProps {
  users: User[];
}
function UserList({ users }: UserListProps) {
  return (
    <div className="w-1/4 bg-white p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.username}
            className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-gray-200 p-2"
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <span>{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
