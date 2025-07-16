// ngrok.js
import ngrok from 'ngrok';

const port = 5000; // change if your server runs on another port

const runTunnel = async () => {
  try {
    const url = await ngrok.connect(port);
    console.log(`🚀 ngrok tunnel running at: ${url}`);
  } catch (error) {
    console.error("❌ Failed to start ngrok:", error);
  }
};

runTunnel();
