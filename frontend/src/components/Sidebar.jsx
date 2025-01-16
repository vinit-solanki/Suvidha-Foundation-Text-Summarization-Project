import { Link, useLocation } from 'react-router-dom';
import { ClipboardCheck, Type, Bot, FileSearch, FileText, Zap } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { icon: ClipboardCheck, text: 'Paraphraser', path: '/paraphraser' },
    { icon: Type, text: 'Grammar Checker', path: '/grammar-checker' },
    { icon: Bot, text: 'AI Detector', path: '/ai-detector' },
    { icon: FileSearch, text: 'Plagiarism Checker', path: '/plagiarism-checker' },
    { icon: FileText, text: 'Summarizer', path: '/summarizer' },
    { icon: Type, text: 'Translator', path: '/translator' },
    { icon: Zap, text: 'QuillBot Flow', path: '/quillbot-flow' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className='text-2xl font-bold' style={{fontFamily:"cursive"}}>
          Suvidha-Flow
          </h1>
        </Link>
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm ${
              location.pathname === item.path
                ? 'bg-green-50 text-green-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.text}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;