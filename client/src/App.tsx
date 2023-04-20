import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <div className="App">
      <h2>Video Chat</h2>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}

export default App;
