const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      //needs to be a url
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`WHYYY!??! 💩`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  //didn't work (when called?)
  // const width = 640;
  // const height = 480;
  // need to make sure canvas is same w/h of video being piped
  canvas.width = width;
  canvas.height = height;
  console.dir(video);

  //paint to canvas from video stream ever 16ms
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)// start at top left
    // lets f with image
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess w/ them
    pixels = redEffect(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);

  }, 16);
}

function takePhoto() {
  //¯\_(ツ)_/¯
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome'); //filename `handsome`
  link.innerHTML = `<img src="${data}">`;
  strip.insertBefore(link, strip.firstChild);

}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    // pixels[i] //r
    // pixels[i + 1] //g
    // pixels[i + 2] //b
    pixels[i + 0] = pixels.data[i + 0] + 100; //r
    pixels[i + 1] = pixels.data[i + 0] - 50; //g
    pixels[i + 2] = pixels.data[i + 0] * 0.5; //b
  }
  return pixels;
}


getVideo();

video.addEventListener('canplay', paintToCanvas);