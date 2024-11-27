window.onload = function () {
    const uploadedImage = localStorage.getItem("uploadedImage");
    const transformation = localStorage.getItem("transformation");

    if (!uploadedImage || !transformation) {
      alert("No image data found. Please upload an image first!");
      window.location.href = "index.html";
      return;
    }

    const img = new Image();
    img.src = uploadedImage;

    img.onload = function () {
      const maxCanvasSize = 400;
      const scale = Math.min(maxCanvasSize / img.width, maxCanvasSize / img.height);

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const originalCanvas = document.getElementById("original-canvas");
      const transformedCanvas = document.getElementById("transformed-canvas");
      const ctxOriginal = originalCanvas.getContext("2d");
      const ctxTransformed = transformedCanvas.getContext("2d");

      originalCanvas.width = scaledWidth;
      originalCanvas.height = scaledHeight;
      transformedCanvas.width = scaledWidth;
      transformedCanvas.height = scaledHeight;

      ctxOriginal.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      const imageData = ctxOriginal.getImageData(0, 0, scaledWidth, scaledHeight);

      let transformedData;
      if (transformation === "grayscale") {
        transformedData = applyGrayscale(imageData);
      } else if (transformation === "blur") {
        transformedData = applyBlur(imageData);
      }

      ctxTransformed.putImageData(transformedData, 0, 0);
    };
};

function applyGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    return imageData;
}

function applyBlur(imageData) {
    const { data, width, height } = imageData;
    const newData = new Uint8ClampedArray(data);

    const kernelSize = 5;
    const kernelOffset = Math.floor(kernelSize / 2);
    const kernel = [];

    for (let y = -kernelOffset; y <= kernelOffset; y++) {
      for (let x = -kernelOffset; x <= kernelOffset; x++) {
        kernel.push([x, y]);
      }
    }

    for (let y = kernelOffset; y < height - kernelOffset; y++) {
      for (let x = kernelOffset; x < width - kernelOffset; x++) {
        let r = 0, g = 0, b = 0;

        kernel.forEach(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          const index = (ny * width + nx) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
        });

        const idx = (y * width + x) * 4;
        newData[idx] = r / kernel.length;
        newData[idx + 1] = g / kernel.length;
        newData[idx + 2] = b / kernel.length;
        newData[idx + 3] = data[idx + 3]; // Alpha
      }
    }

    imageData.data.set(newData);
    return imageData;
}


function goBack() {
    window.history.back();
}