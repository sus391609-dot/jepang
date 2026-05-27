import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { AppProvider } from "./contexts/AppContext";
import Home from "./pages/Home";
import InstallPWA from "./components/InstallPWA";
import PWAStatus from "./components/PWAStatus";

const Vocab = lazy(() => import("./pages/Vocab"));
const Tests = lazy(() => import("./pages/Tests"));
const TestMC = lazy(() => import("./pages/TestMC"));
const TestTyping = lazy(() => import("./pages/TestTyping"));
const TestSentence = lazy(() => import("./pages/TestSentence"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Notes = lazy(() => import("./pages/Notes"));
const Kaigo = lazy(() => import("./pages/Kaigo"));
const KaigoModulePage = lazy(() => import("./pages/KaigoModulePage"));
const KaigoVocab = lazy(() => import("./pages/KaigoVocab"));
const KaigoTestMC = lazy(() => import("./pages/KaigoTestMC"));
const KaigoTestTyping = lazy(() => import("./pages/KaigoTestTyping"));
const Grammar = lazy(() => import("./pages/Grammar"));
const GrammarDetail = lazy(() => import("./pages/GrammarDetail"));
const GrammarTest = lazy(() => import("./pages/GrammarTest"));
const Conjugation = lazy(() => import("./pages/Conjugation"));
const Choukai = lazy(() => import("./pages/Choukai"));
const Dokkai = lazy(() => import("./pages/Dokkai"));
const SimulasiJLPT = lazy(() => import("./pages/SimulasiJLPT"));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-500">
      Memuat…
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <PWAStatus />
          <InstallPWA />
          <Suspense fallback={<PageFallback />}>
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
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
