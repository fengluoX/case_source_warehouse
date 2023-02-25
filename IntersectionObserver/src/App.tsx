import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
import Basic from "./routes/basic";
import "antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/basic" replace />} />
          <Route path="/basic" element={<Basic />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
