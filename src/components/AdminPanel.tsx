import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import SongManager from "./SongManager";

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Lic Admin Dashboard</h1>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Game
          </Button>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="songs">Song Catalogue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Plus className="mr-2 h-5 w-5" />
                    User Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Current Users</h3>
                    {users.length === 0 ? (
                      <p className="text-muted-foreground">No users found.</p>
                    ) : (
                      <div className="space-y-2">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 border rounded-lg bg-card"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-foreground">{user.username}</span>
                              {user.isAdmin && (
                                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                                  Admin
                                </span>
                              )}
                            </div>
                            {user.username !== "admin" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <Input
                      placeholder="Username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="admin"
                        checked={makeAdmin}
                        onCheckedChange={(checked) => setMakeAdmin(checked as boolean)}
                      />
                      <label htmlFor="admin" className="text-sm text-foreground">
                        Make this user an admin
                      </label>
                    </div>
                    <Button type="submit" className="w-full">
                      Add User
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="songs">
            <SongManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;