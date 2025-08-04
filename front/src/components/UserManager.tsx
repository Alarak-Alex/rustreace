import React, { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest } from '../api';
import { userApi } from '../api';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
  });

  // 加载用户列表
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载用户失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建用户
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      setError('请填写所有必填字段');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await userApi.create(formData);
      setFormData({ username: '', email: '' });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建用户失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新用户
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setLoading(true);
      setError(null);
      const updateData: UpdateUserRequest = {
        username: formData.username || undefined,
        email: formData.email || undefined,
      };
      await userApi.update(editingUser.id, updateData);
      setEditingUser(null);
      setFormData({ username: '', email: '' });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新用户失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个用户吗？')) return;

    try {
      setLoading(true);
      setError(null);
      await userApi.delete(id);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除用户失败');
    } finally {
      setLoading(false);
    }
  };

  // 开始编辑
  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
    });
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '' });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>用户管理</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {/* 用户表单 */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>{editingUser ? '编辑用户' : '创建新用户'}</h3>
        <form onSubmit={editingUser ? handleUpdate : handleCreate}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>用户名:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>邮箱:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
              required
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                marginRight: '10px'
              }}
            >
              {loading ? '处理中...' : (editingUser ? '更新用户' : '创建用户')}
            </button>
            {editingUser && (
              <button 
                type="button" 
                onClick={cancelEdit}
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 用户列表 */}
      <div>
        <h3>用户列表</h3>
        {loading && <p>加载中...</p>}
        {users.length === 0 && !loading ? (
          <p>暂无用户数据</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>用户名</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>邮箱</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>创建时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px' }}>{user.username}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(user.created_at).toLocaleString('zh-CN')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => startEdit(user)}
                        style={{ 
                          backgroundColor: '#28a745', 
                          color: 'white', 
                          padding: '5px 10px', 
                          border: 'none', 
                          borderRadius: '3px', 
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{ 
                          backgroundColor: '#dc3545', 
                          color: 'white', 
                          padding: '5px 10px', 
                          border: 'none', 
                          borderRadius: '3px', 
                          cursor: 'pointer'
                        }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;