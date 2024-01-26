document.addEventListener("DOMContentLoaded", function () {
	const audioElement = document.getElementById("audioElement");
	const candle = document.getElementById("birthdayCandle");
	const container = document.querySelector(".container");
      
	// Check for microphone support
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	  navigator.mediaDevices
	    .getUserMedia({ audio: true })
	    .then(function (stream) {
	      // Set the microphone audio as the source
	      audioElement.srcObject = stream;
      
	      // Create an audio context and connect the microphone stream to it
	      const audioContext =
		new (window.AudioContext || window.webkitAudioContext)();
	      const microphone = audioContext.createMediaStreamSource(stream);
      
	      // Create a script processor node for audio analysis
	      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      
	      // Connect the microphone to the script processor
	      microphone.connect(scriptProcessor);
	      scriptProcessor.connect(audioContext.destination);
      
	      // Define the onaudioprocess callback function
	      scriptProcessor.onaudioprocess = function (event) {
		// Analyze the microphone input
		const inputBuffer = event.inputBuffer.getChannelData(0);
		const rms = calculateRMS(inputBuffer);
      
		// You may need to adjust this threshold based on your testing
		const threshold = 0.02; // Adjusted threshold value
      
		// Check if the audio level is above the threshold
		if (rms > threshold) {
		  // Audio detected, turn off the flame
		  candle.classList.add("off");
      
		  // Start confetti animation
		  container.classList.add("confetti-active");
      
		  // Add the text
		  const textElement = document.createElement("div");
		  textElement.classList.add("text");
		  textElement.textContent = "Happy Anniversary Mom and Dad!";
		  document.body.appendChild(textElement);
      
		  // Stop the script processor to prevent further analysis
		  scriptProcessor.disconnect();
		  audioContext.close();
		}
	      };
	    })
	    .catch(function (err) {
	      console.error("Error accessing microphone:", err);
	    });
	} else {
	  console.error("Microphone not supported by the browser");
	}
      
	// Function to calculate root mean square (RMS) of audio buffer
	function calculateRMS(buffer) {
	  let sum = 0;
	  for (let i = 0; i < buffer.length; i++) {
	    sum += buffer[i] * buffer[i];
	  }
	  const mean = sum / buffer.length;
	  return Math.sqrt(mean);
	}
      });
      