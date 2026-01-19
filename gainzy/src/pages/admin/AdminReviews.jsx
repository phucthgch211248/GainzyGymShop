import { useEffect, useState } from 'react';
import Toast from '../../components/Toast.jsx';
import { api } from '../../lib/apiClient';
import { toArray } from '../../lib/normalize';
import { MessageSquare, Trash2, Search, Loader2, Star } from 'lucide-react';

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const pages = Math.max(1, Math.ceil(total / limit));

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const q = `?page=${page}&limit=${limit}`;
      const res = await api.reviews.listAll(q);
      const root = res?.data ?? res ?? {};
      const list = toArray(root);
      
      // Filter theo search term nếu có
      let filteredList = list;
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredList = list.filter((r) => {
          const productName = (r.product?.name || '').toLowerCase();
          const userName = (r.user?.name || '').toLowerCase();
          const userEmail = (r.user?.email || '').toLowerCase();
          const comment = (r.comment || '').toLowerCase();
          return (
            productName.includes(searchLower) ||
            userName.includes(searchLower) ||
            userEmail.includes(searchLower) ||
            comment.includes(searchLower)
          );
        });
      }
      
      const tCandidates = [
        root?.total,
        root?.count,
        root?.pagination?.total,
        res?.data?.total,
        res?.data?.count,
        res?.total,
        res?.count,
        Array.isArray(filteredList) ? filteredList.length : 0,
      ];
      const t = tCandidates.find((v) => typeof v === 'number' && !Number.isNaN(v)) ?? filteredList.length;
      setItems(filteredList);
      setTotal(t);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const remove = async (id) => {
    if (!confirm('Xác nhận xóa đánh giá này?')) return;
    setDeleting(id);
    try {
      await api.reviews.adminRemove(id);
      showToast('Xóa đánh giá thành công!');
      fetchData();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
            <p className="text-sm text-gray-500">Xem và quản lý đánh giá của khách hàng</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sản phẩm hoặc người dùng..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border"
          />
        </div>
        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white">Tìm</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500">
                <th className="px-4 py-3 border-b">Sản phẩm</th>
                <th className="px-4 py-3 border-b">Người dùng</th>
                <th className="px-4 py-3 border-b">Đánh giá</th>
                <th className="px-4 py-3 border-b">Bình luận</th>
                <th className="px-4 py-3 border-b">Ngày</th>
                <th className="px-4 py-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id || r._id} className="text-sm">
                    <td className="px-4 py-3 border-b">
                      {r.product?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        {r.user?.avatar && (
                          <img
                            src={r.user.avatar}
                            alt={r.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span>{r.user?.name || r.user?.email || 'Ẩn danh'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (r.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-gray-600">({r.rating || 0})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <p className="max-w-md truncate">{r.comment || 'Không có bình luận'}</p>
                    </td>
                    <td className="px-4 py-3 border-b text-gray-500">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <button
                        onClick={() => remove(r.id || r._id)}
                        disabled={deleting === (r.id || r._id)}
                        className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 inline-flex items-center gap-1 hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {deleting === (r.id || r._id) ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xóa...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-500">Tổng: {total}</div>
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/trang
                </option>
              ))}
            </select>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm">
              {page}/{pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

