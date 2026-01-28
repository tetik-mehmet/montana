import { ReactNode } from 'react';
import { Card, CardContent } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="group relative">
      {/* Gradient border effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
      
      <Card className="relative bg-white hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                {title}
              </p>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 origin-left">
                {value}
              </p>
              {trend && (
                <div
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    trend.isPositive
                      ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                      : 'bg-red-100 text-red-700 group-hover:bg-red-200'
                  }`}
                >
                  <svg
                    className={`w-3 h-3 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            
            {icon && (
              <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {icon}
              </div>
            )}
          </div>
        </CardContent>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </Card>
    </div>
  );
}
