import { Diamond } from 'lucide-react';

function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-800">
          
        </h1>
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Diamond className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;