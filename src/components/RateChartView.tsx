import React, { useState, useMemo } from 'react';
import { TestItem } from '../types/diagnostic';
import { 
  Search, 
  Plus, 
  Check, 
  ShieldCheck, 
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  Calendar
} from 'lucide-react';
import { LAB_DETAILS } from '../data/defaultTests';

interface RateChartViewProps {
  tests: TestItem[];
  selectedTestIds: string[];
  onToggleTest: (test: TestItem) => void;
  onOpenBooking: () => void;
}

export const RateChartView: React.FC<RateChartViewProps> = ({
  tests,
  selectedTestIds,
  onToggleTest,
  onOpenBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    tests.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [tests]);

  // Filtered tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      if (!t.isActive) return false;
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || t.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [tests, searchQuery, selectedCategory]);

  // Split into 2 columns matching the poster layout
  const half = Math.ceil(filteredTests.length / 2);
  const col1Tests = filteredTests.slice(0, half);
  const col2Tests = filteredTests.slice(half);

  const renderTestRow = (test: TestItem) => {
    const isSelected = selectedTestIds.includes(test.id);
    return (
      <div
        key={test.id}
        onClick={() => onToggleTest(test)}
        className={`px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors border-b border-sky-100 last:border-b-0 ${
          isSelected
            ? 'bg-sky-100/90 text-sky-950 font-semibold'
            : 'hover:bg-sky-50/70 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleTest(test);
            }}
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition ${
              isSelected
                ? 'bg-teal-600 text-white shadow-xs'
                : 'border border-slate-300 text-slate-400 hover:border-sky-500 hover:text-sky-600 bg-white'
            }`}
            title={isSelected ? 'Deselect test' : 'Select test to book'}
          >
            {isSelected ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
              {test.name}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>Sample: {test.sampleType}</span>
              {test.fastingRequired && (
                <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  Fasting
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-black text-sm sm:text-base text-slate-900 font-mono">
            ₹{test.price}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header matching poster style */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Official Laboratory Rates
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          RATE CHART — ALL PATHOLOGICAL TESTS
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Quality testing at affordable rates at MQ Diagnostic Care, Trisulia, Baranga.
        </p>

        {/* Feature Badges from Poster */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Accurate Results</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>On-Time Service</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Home Collection Available</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test name (FBS, CBC, Lipid...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ONE UNIFIED OFFICIAL RATE CHART TABLE (Matching the uploaded poster format) */}
      <div className="bg-white rounded-3xl border-2 border-sky-600 shadow-lg overflow-hidden">
        {/* Table Top Header */}
        <div className="bg-gradient-to-r from-sky-700 to-cyan-700 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-wide uppercase">
              MQ DIAGNOSTIC CARE — PATHOLOGICAL RATE CHART
            </h3>
            <p className="text-xs text-sky-100">
              Trisulia, Baranga • Helpline: {LAB_DETAILS.contactNumber}
            </p>
          </div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white">
            {filteredTests.length} Tests Listed
          </span>
        </div>

        {filteredTests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No tests found matching "{searchQuery}".
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="block mx-auto mt-2 text-xs font-bold text-sky-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-sky-200">
            {/* Column 1 */}
            <div>
              <div className="bg-sky-50 px-4 py-2 flex justify-between text-[11px] font-black uppercase tracking-wider text-sky-900 border-b border-sky-200">
                <span>Test Name</span>
                <span>Rate (₹)</span>
              </div>
              <div className="divide-y divide-sky-100">
                {col1Tests.map(renderTestRow)}
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="bg-sky-50 px-4 py-2 flex justify-between text-[11px] font-black uppercase tracking-wider text-sky-900 border-b border-sky-200">
                <span>Test Name</span>
                <span>Rate (₹)</span>
              </div>
              <div className="divide-y divide-sky-100">
                {col2Tests.map(renderTestRow)}
              </div>
            </div>
          </div>
        )}

        {/* Footer of the rate chart matching poster */}
        <div className="bg-sky-50 p-4 border-t border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-900">Call for Test Booking:</span>
            <a
              href={`tel:${LAB_DETAILS.contactNumber}`}
              className="font-extrabold text-sm text-sky-700 hover:underline"
            >
              {LAB_DETAILS.contactNumber}
            </a>
          </div>
          <div className="text-slate-500 text-[11px]">
            Home Collection Available • Trisulia, Baranga
          </div>
        </div>
      </div>

      {/* Floating Action Cart bar if tests are selected */}
      {selectedTestIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-500 text-white font-extrabold text-xs px-2 py-0.5 rounded-full">
                  {selectedTestIds.length} Tests Selected
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  Total:
                </span>
                <span className="text-xl font-black text-white">
                  ₹{tests.filter((t) => selectedTestIds.includes(t.id)).reduce((acc, t) => acc + t.price, 0)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Home sample collection available in Trisulia &amp; Baranga
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 shrink-0"
            >
              <span>Proceed to Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
