import React from 'react'
import { useNavigate } from 'react-router-dom'

// Subject definitions
const SUBJECTS = [
  { id: 'english', name: '英語', description: '文法・読解・単語の3年間学習プラン', color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'math', name: '数学', description: '数Ⅰ+A・数Ⅱ+B・数Ⅲ+Cの体系的学習プラン', color: 'bg-green-600 hover:bg-green-700' },
  { id: 'japanese', name: '国語', description: '現代文・古文・漢文の総合学習プラン', color: 'bg-purple-600 hover:bg-purple-700' },
  { id: 'science', name: '理科', description: '物理・化学・生物の理系学習プラン', color: 'bg-red-600 hover:bg-red-700' },
  { id: 'social', name: '社会', description: '日本史・世界史・地理の文系学習プラン', color: 'bg-orange-600 hover:bg-orange-700' },
]

function HomePage() {
  const navigate = useNavigate()

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subject/${subjectId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            大学受験速習サイト
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            高校1年から3年までの効率的な先取り学習プランをご提供。<br />
            大学受験から逆算した3年間のロードマップで、確実に合格力を身につけましょう。
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {SUBJECTS.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className={`${subject.color} text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{subject.name}</h2>
                <p className="text-white/90 text-lg leading-relaxed">{subject.description}</p>
                <div className="mt-6 inline-flex items-center text-white/90 font-medium">
                  詳細を見る
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">サイトの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3年間の学習計画</h3>
              <p className="text-gray-600">高校1年から3年まで体系的な学習スケジュールを提供</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">レベル別参考書</h3>
              <p className="text-gray-600">目標大学に応じた最適な教材を推薦</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">重要項目明示</h3>
              <p className="text-gray-600">入試頻出項目を★マークで視覚的に表示</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            まずは興味のある科目をクリックして、3年間の学習プランを確認してみましょう。
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage