import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: number;
  name: string;
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
          <li key={user.id} className="flex items-center space-x-3 mb-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
