import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  }, []);

  return (
    <div className="text-primary bg-white w-screen h-screen flex flex-col items-center justify-center gap-12">
      <h1>Welcome to the App</h1>
      <p className="text-deepBlue text-sm">Redirecting to the dashboard...</p>
    </div>
  );
}
//new push
export default App;
