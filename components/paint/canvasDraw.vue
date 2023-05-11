<template>
  <div class="canvas-wrapper" ref="canvasWrapper">
    <div class="draw-area">
      <canvas id="canvas" ref="canvas" :width="width" :height="height"></canvas>
      <canvas id="cursor" ref="cursor" :width="width" :height="height"></canvas>
    </div>
    <ul class="tools">
      <li class="cursor-pointer w-16 py-1 hover:bg-gray-200" :class="{ active: selectedToolIdx === 0 }" @click="changeTool(0)">
        <img src="~/assets/draw/edit.svg"/>
      </li>
      <li class="cursor-pointer w-16 p-1 hover:bg-gray-200" :class="{ active: selectedToolIdx === 1 }" @click="changeTool(1)">
        <img src="~/assets/draw/eraser.svg"/>
      </li>
      <li class="cursor-pointer flex w-16 p-1 hover:bg-gray-200" @click="showColorPalette()">
        <img src="~/assets/draw/color-palette.svg"/>
      </li>
      <li class="cursor-pointer flex w-16 p-1 hover:bg-gray-200" @click="download()">
        <img src="~/assets/draw/download.svg"/>
      </li>
      <li class="cursor-pointer flex items-center w-16 hover:bg-gray-200 p-1" @click="add_drawing()">
        <img src="~/assets/draw/send.svg"/> <div class="text-gray-800">Post</div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: 'CanvasDraw',
  props: {
    brushSize: {
      type: Number,
      default: 12,
    },
    width: {
      type: Number,
      default: 640,
    },
    height: {
      type: Number,
      default: 480,
    },
    outputName: {
      type: String,
      default: 'canvas',
    },
  },
  data() {
    return {
      canvasContext: null,
      cursorContext: null,
      isDrawing: false,
      link: '',
      lastX: 0,
      lastY: 0,
      tools: [
        {
          name: 'Pencil',
          color: '#000000',
        },
        {
          name: 'Eraser',
        },
      ],
      selectedToolIdx: 0,
    };
  },
  mounted() {
    this.setCanvas();
    this.bindEvents();
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
    }),
    currentDate() {
      let today = new Date() // Create a new Date object
      let day = today.getDate() // Get the day of the month (1-31)
      let month = today.getMonth() + 1 // Get the month (0-11), adding 1 to make it 1-12
      let year = today.getFullYear() // Get the full year (e.g. 2023)

      // Combine the day, month, and year into a string in the format "DD/MM/YYYY"
      let dateString = `${day}/${month}/${year}`

      return dateString
    },
  },
  methods: {
    add_drawing() {
      const path = document.createElement('a');
      path.download = `${this.outputName}.png`;
      path.href = this.$refs.canvas.toDataURL()
      this.link = path.href

      const formData = new FormData();

      formData.append("token", this.user.token);
      formData.append('currentDate', this.currentDate)
      formData.append("link", this.link);

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
    },
    setCanvas() {
      this.$refs.canvasWrapper.style.gridTemplateColumns = `${this.width}px 30px`;
      this.$refs.canvasWrapper.style.width = `${this.width + 30}px`;
      this.$refs.canvasWrapper.style.height = `${this.height}px`;
      this.canvasContext = this.$refs.canvas.getContext('2d');
      this.canvasContext.lineJoin = 'round';
      this.canvasContext.lineCap = 'round';
      this.canvasContext.lineWidth = this.brushSize;
      this.canvasContext.strokeStyle = this.tools[this.selectedToolIdx].color;
      this.cursorContext = this.$refs.cursor.getContext('2d');
    },
    bindEvents() {
      this.$refs.canvas.addEventListener('mousedown', (event) => {
        this.isDrawing = true;
        [this.lastX, this.lastY] = [event.offsetX, event.offsetY];
      });
      this.$refs.canvas.addEventListener('mousemove', this.draw);
      this.$refs.canvas.addEventListener('mouseup', () => this.isDrawing = false);
      this.$refs.canvas.addEventListener('mouseout', () => this.isDrawing = false);
    },
    changeTool(tool) {
      this.selectedToolIdx = tool;
    },
    draw(event) {
      this.drawCursor(event);
      if (!this.isDrawing) return;
      if (this.tools[this.selectedToolIdx].name === 'Eraser') {
        this.canvasContext.globalCompositeOperation = 'destination-out';
      } else {
        this.canvasContext.globalCompositeOperation = 'source-over';
        this.canvasContext.strokeStyle = this.tools[this.selectedToolIdx].color;
      }
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(this.lastX, this.lastY);
      this.canvasContext.lineTo(event.offsetX, event.offsetY);
      this.canvasContext.stroke();
      [this.lastX, this.lastY] = [event.offsetX, event.offsetY];
    },
    drawCursor(event) {
      this.cursorContext.beginPath();
      this.cursorContext.ellipse(
        event.offsetX, event.offsetY,
        this.brushSize, this.brushSize,
        Math.PI / 4, 0, 2 * Math.PI
      );
      this.cursorContext.stroke();
      setTimeout(() => {
        this.cursorContext.clearRect(0, 0, this.width, this.height);
      }, 100);
    },
    showColorPalette() {
      const colorPalette = document.createElement('input');
      colorPalette.addEventListener('change', (event) => {
        this.tools[0].color = event.target.value;
      });
      colorPalette.type = 'color';
      colorPalette.value = this.tools[0].color;
      colorPalette.click();
    },
    download() {
      const link = document.createElement('a');
      link.download = `${this.outputName}.png`;
      link.href = this.$refs.canvas.toDataURL()
      link.click();
    },
  },
};
</script>

<style scoped>
.canvas-wrapper {
  display: grid;
  margin: auto;
  position: relative;
}
#canvas {
  background-color: #f9f9f9;
  z-index: 0;
}
#cursor {
  z-index: 1;
  pointer-events: none;
}
.active {
  background-color: #dea878 !important;
}
.tools {
  margin: 0;
  padding: 0;
}
.tools li{
  border-left: 1px solid #abaaaa;
  margin-left: 2px;
  appearance: none;
  border: 1px solid rgba(27, 31, 35, .15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 6px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
}
.tools li:not(:last-child) {
  border-bottom: 1px solid #abaaaa;
}
.draw-area canvas {
  position: absolute;
  left: 0;
  top: 0;
  border: 2px solid #c8c8c8;
  border-radius: 10px 0 10px 10px;
}

</style>
