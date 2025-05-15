# MajorProject
Sign Language Test using cnn
# MajorProject
Sign Language Test using cnn

The Sign Language Testing Web App is an interactive educational platform designed to help users learn and test their knowledge of Indian Sign Language (ISL). The application leverages Machine Learning, Computer Vision, and a user-friendly web interface to recognize hand gestures in real time using a webcam.

Users can take tests based on:
Numbers (0–9)
Alphabets (A–Z)Indian and American Sign

The system captures webcam input, processes it through a Flask backend with a trained ML model (e.g., TensorFlow/Keras or YOLO), and returns the detected sign. The React frontend displays the result with visual feedback, scoring, and even certificates for completed tests.

✅ Prerequisites
Python 3.8+ installed
Node.js and npm installed

🛠️ Setup Instructions

1. Clone the Repository:

       git clone https://github.com/DilipBsr/MajorProject.git
       cd MajorProject

3. Set Up and Run the Flask APIs
   
  a. Navigate to the backend directory:
  
    cd API
    
  b. Install backend dependencies:
  
    pip install -r requirements.txt
    
  c. Run the Flask server
    for each module navigate to module 
    Terminal 1:
    
      cd AmericanSignAlphabet-Model
      python app.py
      
   Terminal 2
   
      cd api/ISL-Model
      python app.py

  Terminal 3
      
      cd api/OnlyNumberSign-Model
      python app.py

3. Set Up and Run the Node Backend in New Terminal

  a. Navigate to the backend directory:
   
    cd backend
    
  b.create mongoDB Database and connect using driver 
    put driver in .env file
    
  c install all dependency
   
    npm i
    
  d run backend 
    
    npm run start
    

5. Set Up and Run the React Frontend in new Terminal

   
  a. Navigate to the frontend directory:
    
    cd frontend

    
  b. Install frontend dependencies:
   
    npm install

    
  c. Start the React development server:
    
    npm run dev



 




