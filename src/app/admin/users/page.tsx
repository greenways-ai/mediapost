import { createClientServer } from '@/lib/supabase-server';
import { Users, Mail, Calendar, Shield } from 'lucide-react';

async function getUsers() {
  const supabase = await createClientServer();
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return profiles || [];
}

export default async function UsersAdmin() {
  const users = await getUsers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-text-primary">Users</h1>
        <p className="text-text-secondary mt-1">
          Manage users and their permissions
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-sunken border-b border-divider">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username || ''}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-text-tertiary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {user.full_name || user.username || 'Anonymous'}
                        </p>
                        <p className="text-sm text-text-secondary">@{user.username || 'unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.id.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-sunken text-text-secondary">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium text-text-primary">No users found</h3>
            <p className="text-text-secondary mt-1">Users will appear here once they sign up.</p>
          </div>
        )}
      </div>
    </div>
  );
}
