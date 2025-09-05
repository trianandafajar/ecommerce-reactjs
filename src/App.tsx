import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "@/app/store";
import { Footer } from "@/components/foother";
import { router } from "./routes/route";

function App() {
  return (
    <Provider store={store}>
      <div className="font-sans antialiased">
        <RouterProvider router={router} />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
