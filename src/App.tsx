import { Suspense, useState } from "react";
import { useRoutes, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/home";
import PhotoCapture from "./components/PhotoCapture";
import PhotoSelection from "./components/PhotoSelection";
import CollageCreator from "./components/CollageCreator";
import routes from "tempo-routes";

function AppContent() {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/capture"
        element={
          <PhotoCapture
            onComplete={(photos) => {
              setCapturedPhotos(photos);
              navigate("/selection");
            }}
          />
        }
      />
      <Route
        path="/selection"
        element={
          <PhotoSelection
            photos={capturedPhotos}
            onComplete={(photos) => {
              setSelectedPhotos(photos);
              navigate("/collage");
            }}
            onBack={() => navigate("/capture")}
          />
        }
      />
      <Route
        path="/collage"
        element={
          <CollageCreator
            selectedPhotos={selectedPhotos}
            onComplete={() => navigate("/")}
            onBack={() => navigate("/selection")}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <AppContent />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
