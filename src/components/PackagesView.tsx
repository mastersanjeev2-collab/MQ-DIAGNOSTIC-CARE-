import React from 'react';
import { HealthPackage, TestItem } from '../types/diagnostic';
import { 
  Layers, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HeartPulse, 
  Activity, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface PackagesViewProps {
  packages: HealthPackage[];
  tests: TestItem[];
  selectedTestIds: string[];
  onToggleTest: (test: TestItem) => void;
  onOpenBooking: () => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  tests,
  selectedTestIds,
  onToggleTest,
  onOpenBooking,
}) => {
  const activePackages = packages.filter((p) => p.isActive !== false);

  const handleSelectPackage = (pkg: HealthPackage) => {
    // Select all tests in this package
    pkg.testIds.forEach((tid) => {
      const test = tests.find((t) => t.id === tid);
      if (test && !selectedTestIds.includes(tid)) {
        onToggleTest(test);
      }
    });
    onOpenBooking();
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-4 h-4 text-teal-600" />
          Doctor-Curated Health Packages
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Comprehensive Health Checkup Profiles
        </h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Save significantly with bundled diagnostic test profiles recommended for preventive wellness, metabolic monitoring, and full vital organ assessment.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>NABL Standards Quality Analyzers</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Free Home Collection on Full Packages</span>
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePackages.map((pkg) => {
          const discountPct = Math.round(
            ((pkg.originalPrice - pkg.packagePrice) / pkg.originalPrice) * 100
          );

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all flex flex-col justify-between relative group"
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-teal-600 to-sky-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                  ★ Recommended
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    Health Package
                  </span>
                  {discountPct > 0 && (
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Save {discountPct}%
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Target Audience / Ideal For */}
                <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-0.5">
                    Recommended For:
                  </span>
                  <span className="text-slate-700 font-medium">
                    {pkg.recommendedFor}
                  </span>
                </div>

                {/* Tests Checklist */}
                <div className="mt-5 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-700 block tracking-wide">
                    Includes {pkg.testNames.length} Essential Tests:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {pkg.testNames.map((testName, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50/80 hover:bg-slate-100 p-2 rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 stroke-[3]" />
                        <span className="font-semibold truncate">{testName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 line-through">
                      ₹{pkg.originalPrice}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{pkg.packagePrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-700 font-bold block">
                    All inclusive price
                  </span>
                </div>

                <button
                  onClick={() => handleSelectPackage(pkg)}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
                >
                  <span>Book Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
