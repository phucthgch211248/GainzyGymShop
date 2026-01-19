import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/apiClient'
import { toArray } from '../lib/normalize'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [wheyProducts, setWheyProducts] = useState([])
  const [wheyCategories, setWheyCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const productCarouselRef = useRef(null)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        // Lấy danh sách categories
        const categories = await api.categories.list('?limit=100').catch(() => [])
        const categoriesList = toArray(categories)
        
        // Lấy 5 category đầu tiên để hiển thị làm buttons
        const topCategories = categoriesList.slice(0, 5)
        setWheyCategories(topCategories)
        
        // Tìm category "Whey protein" để lấy sản phẩm
        const wheyCategory = categoriesList.find(
          (cat) => cat.name?.toLowerCase().includes('whey') || cat.slug?.toLowerCase().includes('whey')
        ) || topCategories[0] // Nếu không tìm thấy whey, dùng category đầu tiên
        
        const [f, whey] = await Promise.all([
          api.products.featured().catch(() => []),
          wheyCategory 
            ? api.products.list(`?limit=8&category=${wheyCategory.slug || wheyCategory.name || wheyCategory._id || wheyCategory.id}`).catch(() => [])
            : Promise.resolve([])
        ])
        if (mounted) {
          setFeatured(toArray(f))
          setWheyProducts(toArray(whey))
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const placeholderImg = '/vite.svg'

  const slides = ['/images/slider_1.webp','/images/slider_2.webp','/images/slider_3.webp','/images/slider_4.webp']
  const [slideIdx, setSlideIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 3500)
    return () => clearInterval(id)
  }, [slides.length])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>

  return (
    <>
    <div className="page-container p-6 max-w-6xl mx-auto">
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-2 bg-white rounded overflow-hidden shadow relative">
            <div className="relative w-full h-96 overflow-hidden">
              <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${slideIdx * 100}%)` }}>
                {slides.map((s, i) => (
                  <img key={i} src={s} alt={`slide-${i+1}`} className="w-full h-96 object-cover flex-shrink-0" />
                ))}
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 rounded-full px-2 py-1">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setSlideIdx(i)} aria-label={`Slide ${i+1}`} className={`h-2.5 w-2.5 rounded-full ${i===slideIdx ? 'bg-white' : 'bg-white/60'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:h-96">
            {['/images/right_banner_1.webp','/images/right_banner_2.webp','/images/right_banner_3.jpg'].map((src, i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow flex-1">
                <img src={src} alt={`right-${i+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['/images/voucher30k.png','/images/voucher70k.png','/images/voucher100k.png','/images/voucher150k.png'].map((src, i) => (
            <div key={i} className="bg-white rounded overflow-hidden shadow p-4 flex items-center justify-center">
              <img src={src} alt={`voucher-${i+1}`} className="max-w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </section>

      <section className="section-block -mt-2">
        <div className="bg-white rounded overflow-hidden shadow">
          <img src="/images/anhwhey.webp" alt="banner-whey" className="w-full h-56 md:h-72 object-cover" />
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title text-2xl font-semibold mb-4">WHEY PROTEIN</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Nút Whey protein cố định */}
          <Link
            to="/products?category=Whey protein"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
          >
            Whey protein
          </Link>
          
          {/* Hiển thị 4 category khác từ database */}
          {wheyCategories.length > 0 ? (
            wheyCategories.slice(0, 4).map((cat) => {
              const categoryName = cat.name || cat.slug || ''
              const categoryId = cat.slug || cat.name || cat._id || cat.id || ''
              return (
                <Link
                  key={cat._id || cat.id || categoryName}
                  to={`/products?category=${encodeURIComponent(categoryId)}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
                >
                  {categoryName}
                </Link>
              )
            })
          ) : (
            // Fallback nếu chưa load được categories
            ['Protein Bar','Meal Replacements','Vegan Protein'].map((label) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
              >
                {label}
              </Link>
            ))
          )}
        </div>
        
        {wheyProducts.length > 0 && (
          <div className="relative mb-4">
            {/* Nút mũi tên trái */}
            <button
              onClick={() => {
                if (productCarouselRef.current) {
                  const scrollAmount = productCarouselRef.current.offsetWidth * 0.8
                  productCarouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Container carousel */}
            <div
              ref={productCarouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-thin scroll-smooth pb-3"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(203, 213, 225, 0.5) rgba(241, 245, 249, 0.3)'
              }}
            >
              {wheyProducts.slice(0, 8).map((p) => (
                <Link
                  key={p.id || p._id}
                  to={`/products/${p.id || p._id}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-400 flex-shrink-0 w-48 sm:w-56"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {Array.isArray(p.images) && p.images[0] ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-xs">Không có ảnh</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors mb-2 min-h-[40px]">
                      {p.name}
                    </h3>
                    <p className="text-base font-bold text-amber-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(p.price || 0)}
                    </p>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 line-through">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(p.originalPrice)}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                          -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Nút mũi tên phải */}
            <button
              onClick={() => {
                if (productCarouselRef.current) {
                  const scrollAmount = productCarouselRef.current.offsetWidth * 0.8
                  productCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}
        
        <div className="mt-4 bg-white rounded overflow-hidden shadow">
          <img src="/images/bannersection1.jpg" alt="banner-section-1" className="w-full h-56 md:h-72 object-cover" />
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title text-2xl font-semibold mb-4">MASS GAINER</h2>
        <div className="flex flex-wrap gap-3">
          {['Sữa Tăng Cân','Sữa Tăng Cân Nhanh','Sữa Tăng Cân Ít Tăng Mỡ'].map((label) => (
            <Link
              key={label}
              to={`/products?category=${encodeURIComponent(label)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block -mt-2">
        <div className="bg-white rounded overflow-hidden shadow">
          <img src="/images/bannersection2.jpg" alt="banner-section-2" className="w-full h-56 md:h-72 object-cover" />
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3">TĂNG SỨC MẠNH &amp; SỨC BỀN</h3>
          <div className="flex flex-wrap gap-3">
            {['Creatine','Pre Workout','EAA','Caffeine'].map((label) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block -mt-2">
        <div className="bg-white rounded overflow-hidden shadow">
          <img src="/images/bannersection2.webp" alt="banner-section-2-webp" className="w-full h-56 md:h-72 object-cover" />
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3">VITAMIN &amp; KHOÁNG CHẤT</h3>
          <div className="flex flex-wrap gap-3">
            {['Magnesium','Vitamin D3 K2','Vitamin Tổng Hợp','Zinc'].map((label) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
