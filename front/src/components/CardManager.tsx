import React, { useState, useEffect } from 'react';
import type { Card, CreateCardRequest, UpdateCardRequest } from '../api';
import { cardApi } from '../api';

type CardStatus = 'Todo' | 'InProgress' | 'Done';

const CardManager: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState<CreateCardRequest>({
    title: '',
    content: '',
    status: 'Todo',
  });

  const statusOptions: { value: CardStatus; label: string; color: string }[] = [
    { value: 'Todo', label: '待办', color: '#6c757d' },
    { value: 'InProgress', label: '进行中', color: '#007bff' },
    { value: 'Done', label: '已完成', color: '#28a745' },
  ];

  // 加载卡片列表
  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cardApi.getAll();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载卡片失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建卡片
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('请填写所有必填字段');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cardApi.create(formData);
      setFormData({ title: '', content: '', status: 'Todo' });
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建卡片失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新卡片
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    try {
      setLoading(true);
      setError(null);
      const updateData: UpdateCardRequest = {
        title: formData.title || undefined,
        content: formData.content || undefined,
        status: formData.status || undefined,
      };
      await cardApi.update(editingCard.id, updateData);
      setEditingCard(null);
      setFormData({ title: '', content: '', status: 'Todo' });
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新卡片失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除卡片
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个卡片吗？')) return;

    try {
      setLoading(true);
      setError(null);
      await cardApi.delete(id);
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除卡片失败');
    } finally {
      setLoading(false);
    }
  };

  // 开始编辑
  const startEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      content: card.content,
      status: card.status,
    });
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingCard(null);
    setFormData({ title: '', content: '', status: 'Todo' });
  };

  // 获取状态标签
  const getStatusLabel = (status: CardStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // 获取状态颜色
  const getStatusColor = (status: CardStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#6c757d';
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>卡片管理</h2>
      
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

      {/* 卡片表单 */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>{editingCard ? '编辑卡片' : '创建新卡片'}</h3>
        <form onSubmit={editingCard ? handleUpdate : handleCreate}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>标题:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            <label style={{ display: 'block', marginBottom: '5px' }}>内容:</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                resize: 'vertical'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>状态:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CardStatus })}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              {loading ? '处理中...' : (editingCard ? '更新卡片' : '创建卡片')}
            </button>
            {editingCard && (
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

      {/* 卡片列表 */}
      <div>
        <h3>卡片列表</h3>
        {loading && <p>加载中...</p>}
        {cards.length === 0 && !loading ? (
          <p>暂无卡片数据</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {cards.map((card) => (
              <div 
                key={card.id} 
                style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '8px', 
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{card.title}</h4>
                  <span 
                    style={{ 
                      backgroundColor: getStatusColor(card.status), 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getStatusLabel(card.status)}
                  </span>
                </div>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.5', 
                  marginBottom: '15px',
                  minHeight: '60px'
                }}>
                  {card.content}
                </p>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#999', 
                  marginBottom: '15px',
                  borderTop: '1px solid #eee',
                  paddingTop: '10px'
                }}>
                  <div>创建: {new Date(card.created_at).toLocaleString('zh-CN')}</div>
                  <div>更新: {new Date(card.updated_at).toLocaleString('zh-CN')}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => startEdit(card)}
                    style={{ 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      padding: '8px 16px', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    style={{ 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      padding: '8px 16px', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardManager;