
function TimePicker({ label, value, onChange }: { 
  label: string, 
  value: string, 
  onChange: (time: string) => void 
}) {
  return (
    <div className="w-full mb-2">
      <label className="block mb-1 text-sm font-medium text-gray-200">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
          </svg>
        </div>
        <input 
          type="time" 
          className="bg-gray-700 border leading-none border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required 
        />
      </div>
    </div>
  );
}

export default TimePicker;