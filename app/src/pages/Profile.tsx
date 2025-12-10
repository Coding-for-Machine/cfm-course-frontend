import { useAuth } from "../context/AuthContex";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <>User topilmadi</>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Profile Page</h1>

      <div className="bg-white p-4 rounded shadow w-80">
        <p><strong>ID:</strong> {user.user_id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Full name:</strong> {user.full_name}</p>
        <p><strong>Last login:</strong> {user.last_login_time?.toString()}</p>
      </div>
    </div>
  );
}
