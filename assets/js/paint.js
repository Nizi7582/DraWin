// Constants
const paint_container = document.querySelector('.paint-container')
const paint_tools = paint_container.querySelector('.tools')
const paint_toolBTNs = paint_tools.querySelectorAll('.tool')
const paint_shapes = paint_tools.querySelectorAll('.row')[0]
const paint_fill = paint_shapes.querySelectorAll('.options .option')[4]
const paint_options = paint_tools.querySelectorAll('.row')[1]
const paint_size = paint_options.querySelectorAll('.options .option')[2]
const paint_colors = paint_tools.querySelectorAll('.row')[2]
const paint_colorBTNs = paint_colors.querySelectorAll('.option')
const paint_picker = paint_colors.querySelectorAll('.options .option')[4]
const buttons = paint_tools.querySelectorAll('.row')[3]
const paint_clear = buttons.querySelector('.clear')
const paint_save = buttons.querySelector('.save')
const paint_board = paint_container.querySelector('.board')
const paint_canvas = paint_board.querySelector('canvas')
const paint_context = paint_canvas.getContext('2d')
const paint_indicator = paint_board.querySelector('.indicator')
const paint_indicatorDIVs = paint_board.querySelectorAll('.indicator>div')


// Variables
let paint_previousMouseX, paint_previousMouseY
let paint_snapshot
let paint_isDrawing = false
let paint_brushWidth = 5
let paint_currentTool = 'brush'
let paint_currentColor = 'rgb(26, 26, 26)'
let paint_preview


// Events Listeners
paint_toolBTNs.forEach(tool => paint_setupTool(tool))
paint_size.querySelector('input').addEventListener('input', (e) => paint_changeSize(e))
paint_picker.querySelector('input').addEventListener('input', (e) => paint_colorUpdate(e))
paint_colorBTNs.forEach(color => paint_setupColor(color))
paint_clear.addEventListener('click', () => paint_clearCanvas())
paint_save.addEventListener('click', () => paint_saveIMG())
paint_canvas.addEventListener('mousedown', (e) => paint_start(e))
paint_canvas.addEventListener('mouseup', () => paint_isDrawing = false)
paint_canvas.addEventListener('mousemove', (e) => paint_drawing(e))


// Functions
function paint_load() {
    paint_canvas.width = paint_canvas.offsetWidth
    paint_canvas.height = paint_canvas.offsetHeight
    paint_clearCanvas()
    console.log('Drawing Plugin made by Nolly')
    console.log('https://projects.thenolle.com/paint')
}
paint_load()
function paint_setupTool(tool) {
    tool.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active')
        tool.classList.add('active')
        paint_currentTool = tool.id
    })
}
function paint_changeSize(e) {
    paint_brushWidth = e.target.value
    paint_handleIndicators()
}
function paint_handleIndicators() {
    clearTimeout(paint_preview)
    paint_indicator.style.display = 'flex'
    paint_indicatorDIVs.forEach(indicator => {
        const tool = paint_indicator.classList[0]
        if (tool !== paint_currentTool) return paint_indicator.style.display = 'none'
        paint_indicator.style.display = 'block'
        switch (tool) {
            case 'rectangle':
                paint_indicator.style.borderWidth = `${paint_brushWidth}px`
                paint_indicator.style.borderColor = paint_currentColor
                if (paint_fill.querySelector('input').checked) return paint_indicator.style.backgroundColor = paint_currentColor
                else return paint_indicator.style.backgroundColor = 'transparent'
            case 'circle':
                paint_indicator.style.borderWidth = `${paint_brushWidth}px`
                paint_indicator.style.borderColor = paint_currentColor
                if (paint_fill.querySelector('input').checked) return paint_indicator.style.backgroundColor = paint_currentColor
                else return paint_indicator.style.backgroundColor = 'transparent'
            case 'triangle':
                paint_indicator.querySelectorAll('div').forEach(side => side.style.backgroundColor = paint_currentColor)
                return paint_indicator.querySelectorAll('div').forEach(side => side.style.height = `${paint_brushWidth}px`)
            case 'line':
                paint_indicator.style.borderStyle = 'none'
                paint_indicator.style.backgroundColor = paint_currentColor
                return paint_indicator.style.height = `${paint_brushWidth}px`
            case 'brush':
                paint_indicator.style.height = `${paint_brushWidth}px`
                paint_indicator.style.width = `${paint_brushWidth}px`
                paint_indicator.style.border = 'none'
                return paint_indicator.style.backgroundColor = paint_currentColor
            case 'eraser':
                paint_indicator.style.height = `${paint_brushWidth}px`
                paint_indicator.style.width = `${paint_brushWidth}px`
                paint_indicator.style.border = `1px solid #1a1a1a`
                return paint_indicator.style.backgroundColor = 'transparent'
        }
    })
    paint_preview = setTimeout(() => {
        paint_indicator.style.display = 'none'
        paint_indicatorDIVs.forEach(indicator => paint_indicator.style.display = 'none')
    }, 1500)
}
function paint_colorUpdate(e) {
    paint_picker.style.backgroundColor = e.target.value
    paint_picker.id = e.target.value
    paint_picker.click()
}
function paint_setupColor(color) {
    color.addEventListener('click', () => {
        document.querySelector('.selected').classList.remove('selected')
        color.classList.add('selected')
        paint_currentColor = color.id
    })
}
function paint_clearCanvas() {
    paint_context.clearRect(0, 0, paint_canvas.width, paint_canvas.height)
    paint_context.fillStyle = '#f5f6f7'
    paint_context.fillRect(0, 0, paint_canvas.width, paint_canvas.height)
    paint_context.fillStyle = paint_currentColor
}
function paint_start(e) {
    paint_isDrawing = true
    paint_previousMouseX = e.offsetX
    paint_previousMouseY = e.offsetY
    paint_context.beginPath()
    paint_context.lineWidth = paint_brushWidth
    paint_context.strokeStyle = paint_currentColor
    paint_context.fillStyle = paint_currentColor
    paint_snapshot = paint_context.getImageData(0, 0, paint_canvas.width, paint_canvas.height)
}
function paint_drawing(e) {
    if (!paint_isDrawing) return
    paint_context.putImageData(paint_snapshot, 0, 0)
    switch (paint_currentTool) {
        case 'rectangle':
            if (paint_fill.querySelector('input').checked) return paint_context.fillRect(e.offsetX, e.offsetY, paint_previousMouseX - e.offsetX, paint_previousMouseY - e.offsetY)
            else return paint_context.strokeRect(e.offsetX, e.offsetY, paint_previousMouseX - e.offsetX, paint_previousMouseY - e.offsetY)
        case 'circle':
            paint_context.beginPath()
            const radius = Math.sqrt(Math.pow((paint_previousMouseX - e.offsetX), 2) + Math.pow((paint_previousMouseY - e.offsetY), 2))
            paint_context.arc(paint_previousMouseX, paint_previousMouseY, radius, 0, 2 * Math.PI)
            if (paint_fill.querySelector('input').checked) return paint_context.fill()
            else return paint_context.stroke()
        case 'triangle':
            paint_context.beginPath()
            paint_context.moveTo(paint_previousMouseX, paint_previousMouseY)
            paint_context.lineTo(e.offsetX, e.offsetY)
            paint_context.lineTo(paint_previousMouseX * 2 - e.offsetX, e.offsetY)
            paint_context.closePath()
            if (paint_fill.querySelector('input').checked) return paint_context.fill()
            else return paint_context.stroke()
        case 'line':
            paint_context.beginPath()
            paint_context.moveTo(paint_previousMouseX, paint_previousMouseY)
            paint_context.lineTo(e.offsetX, e.offsetY)
            return paint_context.stroke()
        case 'brush':
            paint_context.lineTo(e.offsetX, e.offsetY)
            return paint_context.stroke()
        case 'eraser':
            paint_context.strokeStyle = '#f5f6f7'
            paint_context.fillStyle = '#f5f6f7'
            paint_context.lineTo(e.offsetX, e.offsetY)
            return paint_context.stroke()
    }
}
function paint_saveIMG() {
    const a = document.createElement('a')
    a.download = `nolly_img-${Date.now()}.jpg`
    a.href = paint_canvas.toDataURL() // paint_canvas.toDataURL() => string utilisable en source d'image pour afficher le dessin
    a.click()
}