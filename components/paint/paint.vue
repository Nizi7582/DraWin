<template>
  <client-only>
    <div class="paint-container">
      <section class="tools">
        <div class="row">
          <label class="title">Shapes</label>
          <ul class="options">
            <li class="option tool" tabindex="0" id="rectangle">
              <img src="./images/rectangle.svg" alt="rectangle" />
              <span>Rectangle</span>
            </li>
            <li class="option tool" tabindex="0" id="circle">
              <img src="./images/circle.svg" alt="circle" />
              <span>Circle</span>
            </li>
            <li class="option tool" tabindex="0" id="triangle">
              <img src="./images/triangle.svg" alt="triangle" />
              <span>Triangle</span>
            </li>
            <li class="option tool" tabindex="0" id="line">
              <img src="./images/line.svg" alt="line" />
              <span>Line</span>
            </li>
            <li class="option" tabindex="0">
              <input type="checkbox" id="fill" class="fill" tabindex="-1" />
              <label for="fill">Fill color</label>
            </li>
          </ul>
        </div>
        <div class="row">
          <label class="title">Options</label>
          <ul class="options">
            <li class="option tool active" tabindex="0" id="brush">
              <img src="./images/brush.svg" alt="brush" />
              <span>Brush</span>
            </li>
            <li class="option tool" tabindex="0" id="eraser">
              <img src="./images/eraser.svg" alt="eraser" />
              <span>Eraser</span>
            </li>
            <li class="option">
              <input
                type="range"
                id="size"
                class="size"
                min="1"
                value="5"
                max="30"
                step="any"
              />
            </li>
          </ul>
        </div>
        <div class="row colors">
          <label class="title">Colors</label>
          <ul class="options">
            <li class="option" tabindex="0" id="#f5f6f7"></li>
            <li class="option selected" tabindex="0" id="#1a1a1a"></li>
            <li class="option" tabindex="0" id="#ee8888"></li>
            <li class="option" tabindex="0" id="#88ee88"></li>
            <li class="option" id="#ee88ee">
              <input type="color" class="color" value="#ee88ee" />
            </li>
          </ul>
        </div>
        <div class="row buttons">
          <button class="clear">Clear Canvas</button>
          <button class="save">Save As Image</button>
          <button class="saveLink">Post the Drawing</button>
        </div>
      </section>
      <section class="board">
        <canvas></canvas>
        <div class="indicator">
          <div class="rectangle"></div>
          <div class="circle"></div>
          <div class="triangle">
            <div class="_1"></div>
            <div class="_2"></div>
            <div class="_3"></div>
          </div>
          <div class="line"></div>
          <div class="brush"></div>
          <div class="eraser"></div>
        </div>
      </section>
    </div>
  </client-only>
</template>

<script>
import axios from "axios";
import "./paint.css";

export default {
  data() {
    return {
      link: "",
      successMessage: "",
      errorMessage: "",
      errorDraw: "",
    };
  },
  mounted() {
    function loadMePaint() {
      // Constants
      const paint_container = document.querySelector(".paint-container");
      const paint_tools = paint_container.querySelector(".tools");
      const paint_toolBTNs = paint_tools.querySelectorAll(".tool");
      const paint_shapes = paint_tools.querySelectorAll(".row")[0];
      const paint_fill = paint_shapes.querySelectorAll(".options .option")[4];
      const paint_options = paint_tools.querySelectorAll(".row")[1];
      const paint_size = paint_options.querySelectorAll(".options .option")[2];
      const paint_colors = paint_tools.querySelectorAll(".row")[2];
      const paint_colorBTNs = paint_colors.querySelectorAll(".option");
      const paint_picker = paint_colors.querySelectorAll(".options .option")[4];
      const buttons = paint_tools.querySelectorAll(".row")[3];
      const paint_clear = buttons.querySelector(".clear");
      const paint_save = buttons.querySelector(".save");
      const paint_saveLink = buttons.querySelector(".saveLink");
      const paint_board = paint_container.querySelector(".board");
      const paint_canvas = paint_board.querySelector("canvas");
      const paint_context = paint_canvas.getContext("2d");
      const paint_indicator = paint_board.querySelector(".indicator");
      const paint_indicatorDIVs = paint_board.querySelectorAll(".indicator>div");

      // Variables
      let paint_previousMouseX, paint_previousMouseY;
      let paint_snapshot;
      let paint_isDrawing = false;
      let paint_brushWidth = 5;
      let paint_currentTool = "brush";
      let paint_currentColor = "rgb(26, 26, 26)";
      let paint_preview;

      // Events Listeners
      paint_toolBTNs.forEach((tool) => paint_setupTool(tool));
      paint_size
        .querySelector("input")
        .addEventListener("input", (e) => paint_changeSize(e));
      paint_picker
        .querySelector("input")
        .addEventListener("input", (e) => paint_colorUpdate(e));
      paint_colorBTNs.forEach((color) => paint_setupColor(color));
      paint_clear.addEventListener("click", () => paint_clearCanvas());
      paint_save.addEventListener("click", () => paint_saveIMG());
      paint_saveLink.addEventListener("click", () => paint_saveLinkIMG());
      paint_canvas.addEventListener("mousedown", (e) => paint_start(e));
      paint_canvas.addEventListener("mouseup", () => (paint_isDrawing = false));
      paint_canvas.addEventListener("mousemove", (e) => paint_drawing(e));

      // Functions
      function paint_load() {
        paint_canvas.width = paint_canvas.offsetWidth;
        paint_canvas.height = paint_canvas.offsetHeight;
        paint_clearCanvas();
        console.log("Drawing Plugin made by Nolly");
        //console.log("https://projects.thenolle.com/paint");
      }
      paint_load();
      function paint_setupTool(tool) {
        tool.addEventListener("click", () => {
          document.querySelector(".active").classList.remove("active");
          tool.classList.add("active");
          paint_currentTool = tool.id;
        });
      }
      function paint_changeSize(e) {
        paint_brushWidth = e.target.value;
        paint_handleIndicators();
      }
      function paint_handleIndicators() {
        clearTimeout(paint_preview);
        paint_indicator.style.display = "flex";
        paint_indicatorDIVs.forEach((indicator) => {
          const tool = paint_indicator.classList[0];
          if (tool !== paint_currentTool) return (paint_indicator.style.display = "none");
          paint_indicator.style.display = "block";
          switch (tool) {
            case "rectangle":
              paint_indicator.style.borderWidth = `${paint_brushWidth}px`;
              paint_indicator.style.borderColor = paint_currentColor;
              if (paint_fill.querySelector("input").checked)
                return (paint_indicator.style.backgroundColor = paint_currentColor);
              else return (paint_indicator.style.backgroundColor = "transparent");
            case "circle":
              paint_indicator.style.borderWidth = `${paint_brushWidth}px`;
              paint_indicator.style.borderColor = paint_currentColor;
              if (paint_fill.querySelector("input").checked)
                return (paint_indicator.style.backgroundColor = paint_currentColor);
              else return (paint_indicator.style.backgroundColor = "transparent");
            case "triangle":
              paint_indicator
                .querySelectorAll("div")
                .forEach((side) => (side.style.backgroundColor = paint_currentColor));
              return paint_indicator
                .querySelectorAll("div")
                .forEach((side) => (side.style.height = `${paint_brushWidth}px`));
            case "line":
              paint_indicator.style.borderStyle = "none";
              paint_indicator.style.backgroundColor = paint_currentColor;
              return (paint_indicator.style.height = `${paint_brushWidth}px`);
            case "brush":
              paint_indicator.style.height = `${paint_brushWidth}px`;
              paint_indicator.style.width = `${paint_brushWidth}px`;
              paint_indicator.style.border = "none";
              return (paint_indicator.style.backgroundColor = paint_currentColor);
            case "eraser":
              paint_indicator.style.height = `${paint_brushWidth}px`;
              paint_indicator.style.width = `${paint_brushWidth}px`;
              paint_indicator.style.border = `1px solid #1a1a1a`;
              return (paint_indicator.style.backgroundColor = "transparent");
          }
        });
        paint_preview = setTimeout(() => {
          paint_indicator.style.display = "none";
          paint_indicatorDIVs.forEach(
            (indicator) => (paint_indicator.style.display = "none")
          );
        }, 1500);
      }
      function paint_colorUpdate(e) {
        paint_picker.style.backgroundColor = e.target.value;
        paint_picker.id = e.target.value;
        paint_picker.click();
      }
      function paint_setupColor(color) {
        color.addEventListener("click", () => {
          document.querySelector(".selected").classList.remove("selected");
          color.classList.add("selected");
          paint_currentColor = color.id;
        });
      }
      function paint_clearCanvas() {
        paint_context.clearRect(0, 0, paint_canvas.width, paint_canvas.height);
        paint_context.fillStyle = "#f5f6f7";
        paint_context.fillRect(0, 0, paint_canvas.width, paint_canvas.height);
        paint_context.fillStyle = paint_currentColor;
      }
      function paint_start(e) {
        paint_isDrawing = true;
        paint_previousMouseX = e.offsetX;
        paint_previousMouseY = e.offsetY;
        paint_context.beginPath();
        paint_context.lineWidth = paint_brushWidth;
        paint_context.strokeStyle = paint_currentColor;
        paint_context.fillStyle = paint_currentColor;
        paint_snapshot = paint_context.getImageData(
          0,
          0,
          paint_canvas.width,
          paint_canvas.height
        );
      }
      function paint_drawing(e) {
        if (!paint_isDrawing) return;
        paint_context.putImageData(paint_snapshot, 0, 0);
        switch (paint_currentTool) {
          case "rectangle":
            if (paint_fill.querySelector("input").checked)
              return paint_context.fillRect(
                e.offsetX,
                e.offsetY,
                paint_previousMouseX - e.offsetX,
                paint_previousMouseY - e.offsetY
              );
            else
              return paint_context.strokeRect(
                e.offsetX,
                e.offsetY,
                paint_previousMouseX - e.offsetX,
                paint_previousMouseY - e.offsetY
              );
          case "circle":
            paint_context.beginPath();
            const radius = Math.sqrt(
              Math.pow(paint_previousMouseX - e.offsetX, 2) +
                Math.pow(paint_previousMouseY - e.offsetY, 2)
            );
            paint_context.arc(
              paint_previousMouseX,
              paint_previousMouseY,
              radius,
              0,
              2 * Math.PI
            );
            if (paint_fill.querySelector("input").checked) return paint_context.fill();
            else return paint_context.stroke();
          case "triangle":
            paint_context.beginPath();
            paint_context.moveTo(paint_previousMouseX, paint_previousMouseY);
            paint_context.lineTo(e.offsetX, e.offsetY);
            paint_context.lineTo(paint_previousMouseX * 2 - e.offsetX, e.offsetY);
            paint_context.closePath();
            if (paint_fill.querySelector("input").checked) return paint_context.fill();
            else return paint_context.stroke();
          case "line":
            paint_context.beginPath();
            paint_context.moveTo(paint_previousMouseX, paint_previousMouseY);
            paint_context.lineTo(e.offsetX, e.offsetY);
            return paint_context.stroke();
          case "brush":
            paint_context.lineTo(e.offsetX, e.offsetY);
            return paint_context.stroke();
          case "eraser":
            paint_context.strokeStyle = "#f5f6f7";
            paint_context.fillStyle = "#f5f6f7";
            paint_context.lineTo(e.offsetX, e.offsetY);
            return paint_context.stroke();
        }
      }
      function paint_saveIMG() {
        const a = document.createElement("a");
        a.download = `+--_img-${Date.now()}.jpg`;
        a.href = paint_canvas.toDataURL(); // paint_canvas.toDataURL() => string utilisable en source d'image pour afficher le dessin
        a.click();
        console.log(paint_canvas.toDataURL());
      }
      function paint_saveLinkIMG() {
        const a = document.createElement("a");
        a.href = paint_canvas.toDataURL(); // paint_canvas.toDataURL() => string utilisable en source d'image pour afficher le dessin
        a.click();
        add_drawing(a.href);
      }
      function add_drawing(link) {
        const formData = new FormData();
        formData.append("link", link);

        axios
          .post("http://localhost/my-app/ScribblBack/add_drawing.php", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data === "Le dessin a déja été enregistré.") {
              this.errorMail = response.data;
              setTimeout(() => {
                this.errorMail = "";
              }, 3500);
              return;
            }
          })

          .catch((error) => {
            console.log(error);
          });
      }
    }
    setTimeout(() => {
      loadMePaint();
    }, 1500);
  },
};
</script>
