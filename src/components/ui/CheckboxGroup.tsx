'use client';

interface CheckboxOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface CheckboxGroupProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: CheckboxOption[];
  required?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

export default function CheckboxGroup({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  columns = 2,
}: CheckboxGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                relative group rounded-xl p-4 border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                  : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              {/* Checkbox indicator */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {option.icon && (
                      <span className="text-2xl">{option.icon}</span>
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold transition-colors ${
                        isSelected ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className={`text-xs mt-1 transition-colors ${
                          isSelected ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Custom checkbox */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 bg-white group-hover:border-blue-400'
                  }
                `}>
                  {isSelected && (
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Selected indicator glow */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-blue-500/5 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />
    </div>
  );
}
