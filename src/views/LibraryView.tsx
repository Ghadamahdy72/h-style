import React, { useState } from 'react';
import { BookOpen, Key, Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { CODES_DATA } from '../data/codesData';
import { SCIENCES_DATA } from '../data/sciencesData';

export const LibraryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sciences' | 'codes'>('sciences');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSciences = SCIENCES_DATA.filter(sci => {
    const q = searchQuery.toLowerCase();
    return (
      sci.nameAr.toLowerCase().includes(q) ||
      sci.authorAr.toLowerCase().includes(q) ||
      sci.summaryAr.toLowerCase().includes(q) ||
      sci.keyConceptAr.toLowerCase().includes(q)
    );
  });

  const filteredCodes = CODES_DATA.filter(code => {
    const q = searchQuery.toLowerCase();
    return (
      code.nameAr.toLowerCase().includes(q) ||
      code.categoryAr.toLowerCase().includes(q) ||
      code.descriptionAr.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-28 text-right max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>المكتبة المرجعية الشاملة</span>
          <BookOpen className="w-5 h-5 text-purple-600" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          استكشف العلوم الـ 25 والشيفرات الـ 20 التي تشكل أساس خوارزميات فك الشيفرة.
        </p>
      </div>

      {/* Main Tab Toggle */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 text-xs font-bold shadow-sm">
        <button
          onClick={() => {
            setActiveTab('sciences');
            setExpandedId(null);
          }}
          className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'sciences'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>المكتبة العلمية ({SCIENCES_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('codes');
            setExpandedId(null);
          }}
          className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'codes'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>مكتبة الشيفرات ({CODES_DATA.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={activeTab === 'sciences' ? 'ابحث عن نظرية، مؤلف، أو مفهوم علمي...' : 'ابحث في الشيفرات، الدوافع، أو المعتقدات...'}
          className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200 focus:border-purple-500 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all text-right shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
      </div>

      {/* Sciences Tab Content */}
      {activeTab === 'sciences' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>النتائج: {filteredSciences.length} علم ونظرية</span>
            <span className="text-purple-600 font-bold">موثقة بالباحث والرابط الرسمي</span>
          </div>

          <div className="space-y-3">
            {filteredSciences.map(sci => {
              const isExpanded = expandedId === sci.id;
              return (
                <div
                  key={sci.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-purple-200 transition-all text-right space-y-2.5"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : sci.id)}
                    className="flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-slate-900">
                        {sci.nameAr}
                      </h2>
                      <p className="text-xs text-purple-600 font-bold mt-0.5">
                        الباحث / المؤلف: {sci.authorAr}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600"
                      aria-label="تفاصيل"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {sci.summaryAr}
                  </p>

                  <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-[11px] text-slate-700">
                    <strong className="text-purple-700 font-bold ml-1">المفهوم الجوهري:</strong>
                    <span>{sci.keyConceptAr}</span>
                  </div>

                  {isExpanded && (
                    <div className="pt-2.5 border-t border-slate-100 space-y-2 text-xs">
                      <div className="text-slate-500">
                        <strong className="text-slate-800">المرجع الأكاديمي:</strong>
                        <p className="font-mono text-[11px] mt-0.5 text-slate-500">{sci.referenceAr}</p>
                      </div>

                      <div className="pt-1">
                        <a
                          href={sci.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-all"
                        >
                          <span>زيارة الموقع الرسمي أو المرجع</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Codes Tab Content */}
      {activeTab === 'codes' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>النتائج: {filteredCodes.length} شيفرة سلوكية ونفسية</span>
            <span className="text-cyan-600 font-bold">مرتبطة بالدوافع والمسارات</span>
          </div>

          <div className="space-y-3">
            {filteredCodes.map(code => {
              const isExpanded = expandedId === code.id;
              return (
                <div
                  key={code.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-cyan-200 transition-all text-right space-y-2.5"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : code.id)}
                    className="flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-black text-slate-900">
                          {code.nameAr}
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                          {code.categoryAr}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600"
                      aria-label="تفاصيل"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {code.descriptionAr}
                  </p>

                  {/* Indicators */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 ml-1">مؤشرات الشيفرة:</span>
                    {code.indicators.map((ind, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        • {ind}
                      </span>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-purple-700 block">
                        العلوم والنظريات المرتبطة بهذه الشيفرة:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {code.relatedSciences.map(sid => {
                          const sci = SCIENCES_DATA.find(s => s.id === sid);
                          return (
                            <span
                              key={sid}
                              className="text-[10px] px-2 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-semibold"
                            >
                              {sci ? sci.nameAr : sid}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
