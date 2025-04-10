import React, { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import PopUp from "../../Components/PopUp";
import Alert from "../../Components/Alert";

const BASE_URL = "http://localhost:5000";
const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1); // New: [1,2,...,10]


function NumberTest() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedDigit, setDetectedDigit] = useState("");
  const [detectedConfidence, setDetectedConfidence] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [visited, setVisited] = useState(new Array(10).fill(false));
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { correct, setCorrect } = useContext(UserContext);
  const userId = localStorage.getItem('userId');
  const user = localStorage.getItem('userName');
  const category = 'numberTest';
  const total = 10;
  const navigate = useNavigate();

  useEffect(() => {
    return () => stopVideo();
  }, []);

  useEffect(() => {
    setCorrect(0);
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error("Webcam error:", error);
    }
  };

  const stopVideo = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
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
      const response = await fetch(`${BASE_URL}/predict/digit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Flask API error");

      const data = await response.json();
      drawBoundingBox(data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  const drawBoundingBox = (data) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    if (data.detections?.length > 0) {
      const { x1, y1, x2, y2, label, confidence } = data.detections[0];
      context.strokeStyle = "#fcd34d";
      context.lineWidth = 4;
      context.strokeRect(x1, y1, x2 - x1, y2 - y1);
      context.fillStyle = "#facc15";
      context.font = "bold 30px Arial";
      context.fillText(label, x1 + 5, y1 - 10);

      setDetectedDigit(label);
      setDetectedConfidence(confidence);
      checkMatch(label, confidence);
    } else {
      setDetectedDigit("----");
      setDetectedConfidence(0);
    }
  };

  const checkMatch = (label, confidence) => {
    const currentDigit = NUMBERS[currentDigitIndex].toString();

    setTimeout(() => {
      if (visited[currentDigitIndex]) {
        setShowAlert(true);
        return;
      }
      if (label === currentDigit && confidence >= 50) {
        setVisited(prev => {
          const updated = [...prev];
          updated[currentDigitIndex] = true;
          return updated;
        });
        setCorrect(prev => prev + 1);
        setShowPopup(true);
      }
    }, 500);
  };

  const nextDigit = () => setCurrentDigitIndex(prev => (prev + 1) % 10);
  const prevDigit = () => setCurrentDigitIndex(prev => (10 + (prev - 1) % 10) % 10);

  const complete = async () => {
    stopVideo();
    try {
      const response = await fetch("http://localhost:5001/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, user, category, correct_signs: correct, total_signs: total }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Result submission failed");
      console.log("Submitted:", data);
      navigate("/number-result");
    } catch (error) {
      console.error("Test completion error:", error.message);
    }
  };

  useEffect(() => {
    let interval;
    if (isCameraOn && !showPopup) interval = setInterval(captureFrame, 1000);
    return () => clearInterval(interval);
  }, [isCameraOn, showPopup]);

  return (
    <>
      <div className="flex flex-col items-center bg-yellow-100 min-h-screen">
        <div className="text-4xl w-full text-center font-bold text-white bg-yellow-500 p-2 mb-4">Number Sign Language Test</div>

        <div className="text-2xl text-center mb-2">
          Make Sign of: <span className="text-3xl text-gray-700">{NUMBERS[currentDigitIndex]}</span>
        </div>
        <div className="text-xl text-center mb-4">
          Detected Sign: <span className="text-green-600 text-3xl font-bold">{detectedDigit} ({detectedConfidence}%)</span>
        </div>

        <div className="relative w-[640px] h-[480px] mb-4">
          <video ref={videoRef} autoPlay playsInline className={`absolute top-0 left-0 w-full h-full rounded-lg shadow-lg ${isCameraOn ? "block" : "hidden"}`} />
          <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full border-2 border-black rounded-lg ${isCameraOn ? "block" : "hidden"}`} />
        </div>

        <div className="flex justify-between gap-5 mt-2 w-full px-10">
          <button onClick={prevDigit} className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500">Prev</button>
          <button onClick={isCameraOn ? stopVideo : startVideo} className={`px-4 py-2 text-white rounded-lg shadow ${isCameraOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
            {isCameraOn ? "Stop" : "Start"}
          </button>
          <button onClick={nextDigit} className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500">Next</button>
        </div>

        <div className="flex flex-wrap justify-center mt-5 gap-3 w-full px-10">
          {NUMBERS.map((digit, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentDigitIndex(idx)}
              className={`text-2xl w-12 text-center font-bold py-1 rounded-lg cursor-pointer 
                ${visited[idx] ? "bg-green-500 text-white" : ""}
                ${currentDigitIndex === idx ? "bg-white text-yellow-500" : "bg-yellow-500 text-white"}
              `}
            >
              {digit}
            </span>
          ))}
        </div>

        <button
          onClick={complete}
          className="bg-green-500 text-white font-bold px-6 py-3 mt-6 rounded-lg hover:bg-green-600"
        >
          Complete Test
        </button>
      </div>

      {showPopup && (
        <PopUp
          label={NUMBERS[currentDigitIndex]}
          confidence={detectedConfidence}
          onClose={() => {
            setShowPopup(false);
            setCurrentDigitIndex(prev => prev + 1);
          }}
        />
      )}
      {showAlert && (
        <Alert
          message={"Already Matched"}
          onClose={() => {
            setShowAlert(false);
            setCurrentDigitIndex(prev => prev + 1);
          }}
        />
      )}
    </>
  );
}

export default NumberTest;
