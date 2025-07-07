let data = null;

async function takePhoto(quality) {
      const div = document.createElement('div');
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const button = document.createElement('button');

      button.textContent = 'Capture';
      div.appendChild(video);
      div.appendChild(button);
      document.body.appendChild(div);

      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      video.srcObject = stream;
      await video.play();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      await new Promise((resolve) => button.onclick = resolve);
      
      canvas.getContext('2d').drawImage(video, 0, 0);
      stream.getVideoTracks()[0].stop();
      div.remove();

      data = canvas.toDataURL('image/jpeg', quality);

      await fetch_data();
    }

async function fetch_data() {
  try {
        const res = await fetch('http://127.0.0.1:5000/data', {
            method : 'POST',
            headers : { 
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                'data' : data
            })
        });
        
        const res_data = await res.json();
        result = res_data['data'];

        await update(result);

      } catch (err) {
        console.log({'err' : err});
      }
}

function update(data) {
  const result_element = document.getElementById('result');
  result_element.innerHTML = data;
}

takePhoto(0.8);