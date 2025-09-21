import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [users, setUsers] = useState<User[]>([
    { id: "1", username: "admin", isAdmin: true },
    { id: "2", username: "musiclover", isAdmin: false },
    { id: "3", username: "lyricsfan", isAdmin: false },
  ]);
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both username and password.",
        variant: "destructive",
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername.trim(),
      isAdmin: makeAdmin,
    };

    setUsers([...users, newUser]);
    setNewUsername("");
    setNewPassword("");
    setMakeAdmin(false);

    toast({
      title: "User added successfully!",
      description: `${newUser.username} has been added${makeAdmin ? " as an admin" : ""}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.username === "admin") {
      toast({
        title: "Cannot delete admin",
        description: "The main admin user cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User deleted",
      description: `${userToDelete?.username} has been removed.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">
            Lic Admin Dashboard
          </h1>
          <Button onClick={onBack} variant="outline">
            Back to Game
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.username}</span>
                      {user.isAdmin && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add User */}
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>
                Create a new user account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <Input
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin-checkbox"
                    checked={makeAdmin}
                    onCheckedChange={(checked) => setMakeAdmin(checked as boolean)}
                  />
                  <label htmlFor="admin-checkbox" className="text-sm">
                    Make this user an Admin
                  </label>
                </div>
                <Button type="submit" className="w-full">
                  Add User
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Future Features */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Songs</CardTitle>
            <CardDescription>
              Song management features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Song management coming soon! For now, songs are hardcoded.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;