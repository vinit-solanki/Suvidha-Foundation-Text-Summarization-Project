import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AIDetector from './pages/AIDetector';
import Translator from './pages/Translator';
import GrammarChecker from './pages/GrammarChecker';
import Summarizer from './pages/Summarizer';
import Paraphraser from './pages/Paraphraser';
import PlagiarismChecker from './pages/PlagiarismChecker';
import QuillBotFlow from './pages/QuillBotFlow';
function App() {
  return (
    <Router>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              <Route path='/paraphraser' element={<Paraphraser/>}/>
              <Route path='/summarizer' element={<Summarizer/>}/>
              <Route path="/ai-detector" element={<AIDetector />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/grammar-checker" element={<GrammarChecker />} />
              <Route path='/plagiarism-checker' element={<PlagiarismChecker/>}/>
              <Route path='/quillbot-flow' element={<QuillBotFlow/>}/>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;