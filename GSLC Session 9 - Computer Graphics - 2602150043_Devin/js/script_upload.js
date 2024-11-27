document.getElementById("convert-btn").addEventListener("click", () => {
    const fileInput = document.getElementById("image-upload");
    const transformation = document.getElementById("transformation").value;

    if (fileInput.files.length === 0) {
      alert("Please upload an image first!");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      localStorage.setItem("uploadedImage", event.target.result);
      localStorage.setItem("transformation", transformation);

      window.location.href = "result.html";
    };

    reader.readAsDataURL(file);
});