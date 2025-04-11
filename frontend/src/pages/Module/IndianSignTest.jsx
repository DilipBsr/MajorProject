import React, { useRef, useEffect, useState, useCallback, useContext } from "react";
import UserContext from "../../Context/UserContext";
import PopUp from "../../Components/PopUp";
import { useNavigate } from 'react-router-dom';
import Alert from "../../Components/Alert";

const BASE_URL = "http://localhost:5000"; // Update with your Flask API URL
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function IndianSignTest() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedSign, setDetectedSign] = useState("");
  const [detectedConfidence, setDetectedConfidence] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentAlphabetIndex, setCurrentAlphabetIndex] = useState(0);
  const [visited, setVisited] = useState(new Array(26).fill(false));
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { correct, setCorrect } = useContext(UserContext);
  const userId = localStorage.getItem('userId');
  const user = localStorage.getItem('userName');
  const category = 'Indian Sign Test';
  const total = 26;

  let stream = null;
  useEffect(() => {
    return () => {
      stopVideo();  // Ensure stopVideo is called
    };
  }, []);
  useEffect(() => {
    setCorrect(0)
  }, []);

  const navigate = useNavigate();

  const startVideo = async () => {
    console.log("Video Startted!");
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
    console.log("Inside capture!")
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
      const response = await fetch(`${BASE_URL}/predict/isl`, {
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
        context.strokeStyle = "#e190fc";
        context.lineWidth = 4;
        context.strokeRect(x1, y1, x2 - x1, y2 - y1);
        context.fillStyle = "#A305d8";
        context.font = "bold 30px Serif";
        context.fillText(label, x1 + 5, y1 - 10);
        setDetectedSign(label);
        setDetectedConfidence(confidence);
        checkAlphabetMatch(label, confidence);
      });
    } else {
      setDetectedSign("----");
      setDetectedConfidence(0);
    }
  };



  const checkAlphabetMatch = useCallback((label, confidence) => {
    const currentAlphabet = ALPHABETS[currentAlphabetIndex];

    setTimeout(() => {
      if (visited[currentAlphabetIndex]) {
        setShowAlert(true);
        console.log("Already Matched!! ")
      }
      if (label === currentAlphabet && confidence >= 50) {
        setVisited(prev => {
          const newVisited = [...prev];
          newVisited[currentAlphabetIndex] = true;
          return newVisited;
        });

        setCorrect(prevCorrect => prevCorrect + 1);
        setShowPopup(true);  // Show the popup
      }
    }, 500)

  }, [currentAlphabetIndex]);

  // let label='B';
  // let confidence=80;
  // checkAlphabetMatch(label,confidence);

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentAlphabetIndex(prev => prev + 1);
  };

  async function complete(userId, category, correct_signs, total_signs) {
    stopVideo();
    try {
      const response = await fetch("http://localhost:5001/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          user,
          category,
          correct_signs,
          total_signs,
        })
      }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit test result");
      }
      console.log("Test submitted successfully:", data);
      console.log(`Score: ${data.score}%`);
      return data;
    } catch (error) {
      console.error("Error in Test Completion!!", error.message);
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
    if (isCameraOn && !showPopup) {
      interval = setInterval(captureFrame, 1000);
    }
    return () => clearInterval(interval);
  }, [isCameraOn, showPopup, nextAlphabet, prevAlphabet, checkAlphabetMatch]);

  return (
    <>
      <div className="flex flex-col items-center bg-blue-100 min-h-screen">

        <div className="text-4xl w-full text-center font-bold font-sans text-stone-100  bg-blue-600 p-1 mb-3">Indian Sign Language Test</div>

        <div className="w-full flex flex-col text-center text-2xl font-bold font-sans rounded-2xl text-red-500">

          <h2 className="">Make Sign of: <span className="text-3xl text-gray-500">"{ALPHABETS[currentAlphabetIndex]
            || "Error!"}"</span></h2>


          <h2 className="transition-transform transform scale-100">
            Detected Sign: <span className="text-3xl font-bold text-green-600">{detectedSign} ({detectedConfidence}%)</span>
          </h2>


        </div>


        <div className="relative w-[640px] h-[480px]">
          <video ref={videoRef} autoPlay playsInline className={`absolute top-0 left-0 w-full h-full rounded-lg shadow-lg ${isCameraOn ? "block" : "hidden"}`} />
          <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full h-full border-2 border-black rounded-lg ${isCameraOn ? "block" : "hidden"}`} />
        </div>

        <div className="flex justify-between pl-10 pr-10 lg:pl-35 lg:pr-35 gap-5 mt-5  w-full ">

          <button onClick={prevAlphabet} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200">Prev</button>

          <button
            onClick={isCameraOn ? stopVideo : startVideo}
            className={`text-white rounded-lg shadow-lg transition px-4 py-2 duration-200 ${isCameraOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}>
            {isCameraOn ? "Stop" : "Start"}
          </button>

          <button onClick={nextAlphabet} className=" bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200">Next</button>
        </div>




        <div className="flex flex-wrap lg:w-3/6 justify-center p-5 gap-3 m-2">
          {ALPHABETS.map((letter, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentAlphabetIndex(idx)}  // Click to change the current letter
              className={`text-2xl w-12 text-center font-bold mx-2 px-3 py-1 rounded-lg cursor-pointer 
              ${visited[idx] ? "bg-green-500 text-stone-100" : ""}
                ${currentAlphabetIndex === idx ? "bg-stone-100 text-blue-600 " : "bg-blue-500 text-stone-100"} 
                `}
            >
              {letter}
            </span>
          ))}
        </div>

        <button className="text-center flex justify-center text-xl bg-green-500 p-3 rounded-xl font-bold text-blue-100 cursor-pointer hover:bg-green-600 mb-5" onClick={() => {
          complete(userId, category, correct, total);
          navigate('/isl-result')
        }}>
          Complete Test
        </button>
      </div>
      {showPopup && (
        <PopUp
          label={ALPHABETS[currentAlphabetIndex]}
          confidence={detectedConfidence}
          onClose={() => {
            setShowPopup(false);
            setCurrentAlphabetIndex(prev => prev + 1);
          }}
        />
      )}
      {showAlert && (
        <Alert message={"Already Matched"}
          onClose={() => {
            setShowAlert(false);
            setCurrentAlphabetIndex(prev => prev + 1);
          }
          } />
      )

      }


    </>
  );
}

export default IndianSignTest
