'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 장비 리뷰 타입 정의
type GearReview = {
  id: number;
  productName: string;
  category: string;
  brand: string;
  rating: number;
  imageUrl: string;
  price: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  reviewText: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  likes: number;
  comments: number;
};

// 필터 옵션 타입 정의
type FilterOptions = {
  category: string | null;
  brand: string | null;
  minRating: number;
  sortBy: 'newest' | 'rating' | 'popular';
};

export default function GearPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    brand: null,
    minRating: 0,
    sortBy: 'newest',
  });

  // 장비 리뷰 데이터 (실제 앱에서는 API에서 가져올 것)
  const gearReviews: GearReview[] = [
    {
      id: 1,
      productName: 'Fender Stratocaster Professional II',
      category: 'Guitar',
      brand: 'Fender',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '1,999,000원',
      author: {
        id: 'user1',
        name: '기타리스트K',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
      reviewText: '3년간 사용해 본 결과 정말 훌륭한 기타입니다. 특히 넥의 그립감과 피크업 사운드가 일품입니다. 블루스, 펑크, 록 등 다양한 장르에서 잘 어울리는 소리를 냅니다.',
      pros: [
        '뛰어난 넥 그립감',
        '다양한 장르에 적합한 사운드',
        '빈티지와 현대적 사운드의 좋은 조합',
        '내구성이 뛰어남'
      ],
      cons: [
        '가격이 비싼 편',
        '트레몰로가 튜닝 안정성에 영향을 줌'
      ],
      createdAt: '2025-04-02',
      likes: 45,
      comments: 12,
    },
    {
      id: 2,
      productName: 'Universal Audio Apollo Twin X',
      category: 'Audio Interface',
      brand: 'Universal Audio',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '899,000원',
      author: {
        id: 'user2',
        name: '프로듀서M',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      reviewText: 'Unison 프리앰프 기술과 내장된 UAD 플러그인은 홈 레코딩 스튜디오의 품질을 크게 향상시켜줍니다. 레이턴시가 매우 낮고, 프리앰프 품질이 뛰어납니다.',
      pros: [
        '뛰어난 프리앰프 품질',
        '매우 낮은 레이턴시',
        'UAD 플러그인과의 통합',
        '견고한 빌드 품질'
      ],
      cons: [
        '상당히 높은 가격',
        'UAD 플러그인을 활용하려면 추가 비용 필요',
        'DSP 한계가 있음'
      ],
      createdAt: '2025-04-01',
      likes: 38,
      comments: 9,
    },
    {
      id: 3,
      productName: '슈어 SM7B',
      category: 'Microphone',
      brand: 'Shure',
      rating: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '499,000원',
      author: {
        id: 'user3',
        name: '보컬J',
        avatar: 'https://i.pravatar.cc/150?img=13',
      },
      reviewText: '팟캐스트와 보컬 레코딩에 모두 탁월한 다이내믹 마이크입니다. 방송용으로 많이 사용되며 웜하고 깨끗한 소리를 제공합니다. 클라우드 리프터와 함께 사용하는 것이 좋습니다.',
      pros: [
        '깊고 따뜻한 보컬 톤',
        '주변 소음에 대한 뛰어난 격리',
        '내구성이 매우 뛰어남',
        '팟캐스팅과 보컬 레코딩 모두에 적합'
      ],
      cons: [
        '게인을 높여주는 장비가 필요함',
        '무겁고 부피가 큼'
      ],
      createdAt: '2025-03-30',
      likes: 52,
      comments: 15,
    },
    {
      id: 4,
      productName: 'Native Instruments Komplete 14',
      category: 'Software',
      brand: 'Native Instruments',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '599,000원',
      author: {
        id: 'user4',
        name: '작곡가P',
        avatar: 'https://i.pravatar.cc/150?img=14',
      },
      reviewText: '방대한 양의 가상 악기와 샘플을 제공하는 완벽한 패키지입니다. Kontakt 라이브러리와 신스가 매우 인상적이고 사용하기 쉽습니다.',
      pros: [
        '방대한 가상 악기 및 효과 라이브러리',
        '높은 사운드 품질',
        '정기적인 업데이트',
        '유연한 라이센싱'
      ],
      cons: [
        '많은 저장 공간 필요 (약 250GB)',
        '모든 제품을 완전히 익히는 데 시간이 걸림',
        '높은 초기 투자 비용'
      ],
      createdAt: '2025-03-29',
      likes: 40,
      comments: 18,
    },
    {
      id: 5,
      productName: 'Yamaha HS8',
      category: 'Monitor Speaker',
      brand: 'Yamaha',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '399,000원',
      author: {
        id: 'user5',
        name: '믹싱엔지니어S',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
      reviewText: '스튜디오 모니터로서 가격 대비 성능이 매우 뛰어납니다. 평탄한 주파수 응답을 제공하여 믹싱에 이상적입니다. 방의 크기에 맞게 HS5, HS7, HS8 중에서 선택하는 것이 좋습니다.',
      pros: [
        '정확하고 평탄한 주파수 응답',
        '중저가 범위에서 뛰어난 성능',
        '깨끗한 고역대와 정확한 저역대',
        '견고한 빌드 품질'
      ],
      cons: [
        '작은 방에는 너무 강력할 수 있음',
        '서브우퍼 없이는 초저역대가 부족함',
        '일부 사람들은 소리가 냉정하다고 느낄 수 있음'
      ],
      createdAt: '2025-03-28',
      likes: 35,
      comments: 7,
    },
    {
      id: 6,
      productName: 'Roland TD-17KVX',
      category: 'Electronic Drums',
      brand: 'Roland',
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1568443629711-12c5d265cc5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '1,699,000원',
      author: {
        id: 'user6',
        name: '드러머K',
        avatar: 'https://i.pravatar.cc/150?img=16',
      },
      reviewText: '아파트에서 연습하기에 완벽한 전자 드럼 세트입니다. 메쉬 헤드는 실제 드럼과 유사한 느낌을 주고, 소리 모듈은 다양한 드럼 키트를 제공합니다.',
      pros: [
        '실제 드럼과 유사한 메쉬 헤드 느낌',
        '다양한 내장 키트와 연습 기능',
        '저소음으로 아파트에서 연습 가능',
        '견고한 구조로 내구성이 좋음'
      ],
      cons: [
        '하이햇 컨트롤이 실제보다 덜 정교함',
        '설치 공간이 여전히 필요함',
        '가격이 높은 편'
      ],
      createdAt: '2025-03-27',
      likes: 28,
      comments: 5,
    },
    {
      id: 7,
      productName: 'Ableton Live 12 Suite',
      category: 'Software',
      brand: 'Ableton',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      price: '799,000원',
      author: {
        id: 'user7',
        name: '일렉트로닉프로듀서E',
        avatar: 'https://i.pravatar.cc/150?img=17',
      },
      reviewText: '전자 음악 제작을 위한 최고의 DAW입니다. 워크플로우가 매우 직관적이며 라이브 퍼포먼스에도 완벽합니다. 포함된 악기와 효과는 품질이 뛰어납니다.',
      pros: [
        '직관적인 워크플로우와 유연한 세션 뷰',
        '창의적인 작곡과 라이브 퍼포먼스에 탁월',
        '뛰어난 내장 악기 및 효과',
        '안정적인 성능'
      ],
      cons: [
        '높은 가격',
        '처음 사용자에게는 학습 곡선이 있음',
        '영상 편집 기능은 제한적'
      ],
      createdAt: '2025-03-26',
      likes: 48,
      comments: 14,
    },
  ];

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
  };

  // 필터 핸들러
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  // 리뷰 데이터 필터링 및 정렬
  const filteredReviews = gearReviews
    .filter((review) => {
      // 카테고리 필터링
      if (filters.category && review.category !== filters.category) {
        return false;
      }
      
      // 브랜드 필터링
      if (filters.brand && review.brand !== filters.brand) {
        return false;
      }
      
      // 평점 필터링
      if (review.rating < filters.minRating) {
        return false;
      }
      
      // 검색어 필터링 (제품명, 리뷰 내용에서 검색)
      if (
        searchQuery &&
        !review.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !review.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // 정렬
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  // 모든 카테고리 목록 생성
  const allCategories = Array.from(
    new Set(gearReviews.map((review) => review.category))
  ).sort();

  // 모든 브랜드 목록 생성
  const allBrands = Array.from(
    new Set(gearReviews.map((review) => review.brand))
  ).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">음악 장비 리뷰</h1>
              <p className="text-gray-600 dark:text-gray-300">
                악기, 오디오 장비, 음악 소프트웨어에 대한 리뷰와 토론
              </p>
            </div>
            <div className="flex space-x-2">
              <Link href="/community/gear/create">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                  리뷰 작성
                </button>
              </Link>
            </div>
          </div>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="장비 또는 소프트웨어 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {/* 필터 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">필터</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">카테고리</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || null)}
              >
                <option value="">모든 카테고리</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">브랜드</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value || null)}
              >
                <option value="">모든 브랜드</option>
                {allBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">최소 평점</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
              >
                <option value="0">모든 평점</option>
                <option value="3">3점 이상</option>
                <option value="4">4점 이상</option>
                <option value="4.5">4.5점 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">정렬</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.sortBy}
                onChange={(e) => 
                  handleFilterChange('sortBy', e.target.value as 'newest' | 'rating' | 'popular')
                }
              >
                <option value="newest">최신순</option>
                <option value="rating">평점순</option>
                <option value="popular">인기순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 리뷰 카테고리 탭 */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          <button
            className={`px-4 py-2 whitespace-nowrap rounded-md ${
              filters.category === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleFilterChange('category', null)}
          >
            전체
          </button>
          {allCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 whitespace-nowrap rounded-md ${
                filters.category === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleFilterChange('category', category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-8 mb-8">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 이미지 섹션 */}
                  <div className="md:w-1/4 p-4">
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                      <img
                        src={review.imageUrl}
                        alt={review.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  {/* 컨텐츠 섹션 */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between mb-2">
                      <h2 className="text-xl font-semibold">{review.productName}</h2>
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 ${
                                i < Math.floor(review.rating)
                                  ? 'text-yellow-500'
                                  : i < review.rating
                                  ? 'text-yellow-500' // 반개 별 (실제로는 더 복잡한 구현이 필요)
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-lg font-semibold">{review.rating}</span>
                      </div>
                    </div>

                    {/* 태그 및 가격 */}
                    <div className="flex flex-wrap items-center mb-4">
                      <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium">
                        {review.category}
                      </span>
                      <span className="mr-2 px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-medium">
                        {review.brand}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        가격: {review.price}
                      </span>
                    </div>

                    {/* 리뷰 내용 */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {review.reviewText}
                    </p>

                    {/* 장단점 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">장점</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {review.pros.slice(0, 2).map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                          {review.pros.length > 2 && <li>...</li>}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">단점</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {review.cons.slice(0, 2).map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                          {review.cons.length > 2 && <li>...</li>}
                        </ul>
                      </div>
                    </div>

                    {/* 작성자 및 상호작용 */}
                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <img
                          src={review.author.avatar}
                          alt={review.author.name}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                        <span>{review.author.name} · {review.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <button className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.591-.926L5 14M14 10V5a2 2 0 00-2-2h-.5a2 2 0 00-2 2v5"
                            />
                          </svg>
                          <span>{review.likes}</span>
                        </button>
                        <button className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>{review.comments}</span>
                        </button>
                        <Link href={`/community/gear/${review.id}`}>
                          <span className="text-blue-600 dark:text-blue-400 hover:underline">
                            더 보기
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                검색 조건에 맞는 리뷰가 없습니다.
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: null,
                    brand: null,
                    minRating: 0,
                    sortBy: 'newest',
                  });
                }}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {filteredReviews.length > 0 && (
          <div className="flex items-center justify-center space-x-2">
            <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              이전
            </button>
            <button className="px-3 py-2 rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              2
            </button>
            <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
