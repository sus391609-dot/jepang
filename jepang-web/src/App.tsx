import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { AppProvider } from "./contexts/AppContext";
import Home from "./pages/Home";
import Vocab from "./pages/Vocab";
import Tests from "./pages/Tests";
import TestMC from "./pages/TestMC";
import TestTyping from "./pages/TestTyping";
import TestSentence from "./pages/TestSentence";
import Statistics from "./pages/Statistics";
import Notes from "./pages/Notes";
import Kaigo from "./pages/Kaigo";
import KaigoModulePage from "./pages/KaigoModulePage";
import KaigoVocab from "./pages/KaigoVocab";
import KaigoTestMC from "./pages/KaigoTestMC";
import KaigoTestTyping from "./pages/KaigoTestTyping";
import Grammar from "./pages/Grammar";
import GrammarDetail from "./pages/GrammarDetail";
import GrammarTest from "./pages/GrammarTest";
import Conjugation from "./pages/Conjugation";
import Choukai from "./pages/Choukai";
import Dokkai from "./pages/Dokkai";
import SimulasiJLPT from "./pages/SimulasiJLPT";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kosakata" element={<Vocab />} />
            <Route path="/kosakata/:sectionId" element={<Vocab />} />
            <Route path="/kosakata/:sectionId/:pageNum" element={<Vocab />} />
            <Route path="/tes" element={<Tests />} />
            <Route path="/tes/pilihan-ganda" element={<TestMC />} />
            <Route path="/tes/mengetik" element={<TestTyping />} />
            <Route path="/tes/susun-kalimat" element={<TestSentence />} />
            <Route path="/tes/choukai" element={<Choukai />} />
            <Route path="/tes/dokkai" element={<Dokkai />} />
            <Route path="/tes/simulasi-jlpt-n4" element={<SimulasiJLPT />} />
            <Route path="/kaigo" element={<Kaigo />} />
            <Route path="/kaigo/:moduleId" element={<KaigoModulePage />} />
            <Route path="/kaigo/:moduleId/tes/pilihan-ganda" element={<KaigoTestMC />} />
            <Route path="/kaigo/:moduleId/tes/mengetik" element={<KaigoTestTyping />} />
            <Route path="/kaigo/:moduleId/:sectionId" element={<KaigoVocab />} />
            <Route path="/kaigo/:moduleId/:sectionId/:pageNum" element={<KaigoVocab />} />
            <Route path="/tata-bahasa" element={<Grammar />} />
            <Route path="/tata-bahasa/tes" element={<GrammarTest />} />
            <Route path="/tata-bahasa/:id" element={<GrammarDetail />} />
            <Route path="/konjugasi" element={<Conjugation />} />
            <Route path="/statistik" element={<Statistics />} />
            <Route path="/catatan" element={<Notes />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
