import React, { useRef, useEffect, useState } from "react";


const BASE_URL = "http://localhost:5000"; // Update with your Flask API URL
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Model = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedSign, setDetectedSign] = useState("");
  const [detectedConfidence, setDetectedConfidence] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentAlphabetIndex, setCurrentAlphabetIndex] = useState(0);
  const [correctSigns, setCorrectSigns] = useState(0);
  const [visited, setVisited] = useState(new Array(26).fill(false));
  let stream = null;

  useEffect(() => {
    return () => {
        stopVideo();  // Ensure stopVideo is called
    };
}, []);



  const startVideo = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();

        tracks.forEach(track => {
            track.stop();  // Stop the track
            stream.removeTrack(track); // Remove track from stream
        });

        videoRef.current.srcObject = null;  // Clear the video stream
    }
    setIsCameraOn(false);
};



  const captureFrame = () => {
    if (!isCameraOn || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) sendToFlask(blob);
    }, "image/jpeg");
  };

  const sendToFlask = async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    try {
      const response = await fetch(`${BASE_URL}/translate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Flask API");
      }

      const data = await response.json();
      drawBoundingBox(data);
    } catch (error) {
      console.error("Error sending frame to API:", error);
    }
  };

  const drawBoundingBox = (data) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    if (data.detections && data.detections.length > 0) {
      data.detections.forEach(({ x1, y1, x2, y2, label, confidence }) => {
        context.strokeStyle = "#00FF00";
        context.lineWidth = 4;
        context.strokeRect(x1, y1, x2 - x1, y2 - y1);
        context.fillStyle = "#00FF00";
        context.font = "bold 20px Arial";
        context.fillText(label, x1 + 5, y1 - 10);
        setDetectedSign(label);
        setDetectedConfidence(confidence);
        checkAlphabetMatch(label, confidence);
      });
    } else {
      setDetectedSign("No sign detected");
      setDetectedConfidence(0);
    }
  };
  const checkAlphabetMatch = (label, confidence) => {
    const currentAlphabet = ALPHABETS[currentAlphabetIndex];
    if (label === currentAlphabet && confidence >= 50 && !visited[currentAlphabetIndex]) {
      setVisited(prev => {
        const newVisited = [...prev];
        newVisited[currentAlphabetIndex] = true; // Mark as completed
        return newVisited;
      });
      setCorrectSigns(prev => prev + 1);
      setCurrentAlphabetIndex((prev) => prev + 1);
    }
  };

  const nextAlphabet = () => {
    setCurrentAlphabetIndex(prev => (prev + 1) % 26);
  };
  const prevAlphabet = () => {
    setCurrentAlphabetIndex(prev => (26 + (prev - 1) % 26) % 26);
  };

  useEffect(() => {
    let interval;
    if (isCameraOn) {
      interval = setInterval(captureFrame, 1000); // Capture every 500ms
    }
    return () => clearInterval(interval);
  }, [isCameraOn,currentAlphabetIndex]);

  return (
  <>
    <div className="flex flex-col items-center p-6 bg-blue-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Alphabet Test</h1>
      <h3 className="text-xl font-medium mt-4">
        Progress: {Math.round((correctSigns / 26) * 100)}%
      </h3>
      <br />
      <div className="relative w-[640px] h-[480px]">
        <video ref={videoRef} autoPlay playsInline className={`absolute top-0 left-0 w-full h-full rounded-lg shadow-lg ${isCameraOn ? "block" : "hidden"}`} />
        <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full border-2 border-black rounded-lg ${isCameraOn ? "block" : "hidden"}`} />
      </div>
      <br />
      <button
        onClick={isCameraOn ? stopVideo : startVideo}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200">
        {isCameraOn ? "Stop" : "Start"}
      </button>
      <h2 className="text-2xl font-semibold mt-4 text-red-500 transition-transform transform scale-110 ">
        Detected Sign: <span className="text-3xl font-extrabold text-green-600">{detectedSign} ({detectedConfidence.toFixed(2)}%)</span>
      </h2>
      <h2 className="text-2xl font-bold mt-4">Current Sign to Match: <span className="text-4xl text-blue-600">{ALPHABETS[currentAlphabetIndex] || "Completed!"}</span></h2>
      <div className="w-50 flex justify-center gap-5">
        <button onClick={prevAlphabet} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-200">Prev</button>
        <button onClick={nextAlphabet} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-200">Next</button>
      </div>

      

    
      <div className="flex flex-wrap lg:w-3/6 justify-center p-5 gap-3 m-2">
        {ALPHABETS.map((letter, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentAlphabetIndex(idx)}  // Click to change the current letter
            className={`text-2xl w-12 text-center font-bold mx-2 px-3 py-1 rounded-lg cursor-pointer 
                ${currentAlphabetIndex === idx ? "border-2 border-yellow-200 " : ""} 
                ${visited[idx] ? "bg-green-500 text-white" : "bg-blue-400 text-white"}`}
          >
            {letter}
          </span>
        ))}
      </div>


    </div>
  </>
  );
};

export default Model;
