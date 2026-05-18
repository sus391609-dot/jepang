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
