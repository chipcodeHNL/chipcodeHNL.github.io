const fields = document.getElementById("fields");
const drawing = document.getElementById("drawing");
const notification = document.getElementById("notification");
const externalLink = document.getElementById("externalLink");

const GITHUB_PAGES_CHIP_IMG_URL = "https://chipcodehnl.github.io/tophatandcane.jpg";
const RELATIVE_CHIP_IMG_URL = "tophatandcane.jpg";
const HOTSTAMP_RADIUS_MM = 24;
const DISPLAY_RADIUS_PX = 61.5;
// 12pt = 16px. So we would adjust 8px per 12pt ignoring line height.
// But the line height has some empty space.
// The default line height in Inkscape is 1.25.
// But 1.3 seems to work better, probably something wrong with my math.
const BASELINE_ADJUST_FACTOR = 8/(12*1.3);
// And something is even more wrong with my math here. But it works.
const BASELINE_ADJUST_FACTOR_VERTICAL = 8/(12*1.5);
const GOLD_COLOR_RGB = "#efcb6c";
const SQUARE = [
  ["M",-36.2,36.1],
  ["v",-72.2],
  ["h",72.1],
  ["l",0.2,0.1],
  ["l",0.1,0.2],
  ["v",71.7],
  ["L",36.1,36],
  ["l",-0.2,0.1],
  ["L",-36.2,36.1],
  ["z"]
];
const STAR = [
["M",-19.3,11.2],
["L",-49.9,-11],
["l",-0.1,-0.2],
["l",0.2,-0.1],
["H",-12],
["l",0.2,-0.1],
["l",11.7,-36],
["L",0,-47.6],
["l",0.2,0.1],
["l",11.7,36],
["l",0.2,0.1],
["h",37.8],
["l",0.1,0],
["l",0.1,0.1],
["L",49.9,-11],
["L",19.3,11.2],
["l",-0.1,0.2],
["l",0,0],
["l",11.7,36],
["l",-0.1,0.2],
["h",-0.2],
["L",0.1,25.3],
["l",-0.2,0],
["l",0,0],
["l",-30.6,22.2],
["l",-0.2,0],
["l",-0.1,-0.2],
["l",11.7,-36],
["L",-19.3,11.2],
["z"]
];
const CIRCLE = [
["M",43.8,0],
["c",0,24.2,-19.6,43.8,-43.8,43.8],
["l",0,0],
["c",-24.2,0,-43.8,-19.6,-43.8,-43.8],
["c",0,0,0,0,0,0],
["c",0,-24.2,19.6,-43.8,43.8,-43.8],

["c",0,0,0,0,0,0],
["C",24.2,-43.8,43.8,-24.2,43.8,0],
["C",43.8,0,43.8,0,43.8,0],
["z"],

["M",18.8,0],
["c",0,-10.4,-8.4,-18.8,-18.8,-18.8],
["c",-10.4,0,-18.8,8.4,-18.8,18.8],

["c",0,0,0,0,0,0],
["c",0,10.4,8.4,18.8,18.8,18.8],
["l",0,0],
["C",10.4,18.8,18.8,10.4,18.8,0],
["z"]
];

const CROSS = [
["M",-0.2,17.9],
["l",-22,22],
["l",-0.2,0.1],
["l",-0.2,-0.1],
["l",-17.3,-17.3],
["l",-0.1,-0.1],
["l",0.1,-0.3],
["l",22,-22],
["l",0.1,-0.2],
["l",-0.1,-0.2],
["l",-22,-21.9],
["l",-0.1,-0.2],
        
["l",0.1,-0.2],
["l",0,0],
["l",0,0],
["l",17.3,-17.3],
["l",0.2,-0.1],
["l",0.3,0.1],
["l",22,22],
["L",0,-17.8],
["l",0.2,-0.1],
["l",21.9,-22],
["l",0.2,-0.1],
["l",0.3,0.1],
["l",17.3,17.3],
["l",0.1,0.1],
["l",-0.1,0.3],
["l",-22,21.9],
        
["L",17.8,0],
["l",0.1,0.2],
["l",22,22],
["l",0.1,0.2],
["l",-0.1,0.2],
["L",22.6,39.8],
["l",-0.2,0.1],
["l",-0.2,-0.1],
["l",-22,-22],
["L",0,17.8],
["L",-0.2,17.9],
["z"]
];

const NONE = [];

const exportButton = document.getElementById("export");
exportButton.addEventListener("click", () => {
  // Get SVG source
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(drawing);

  // Add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  // Convert SVG source to URI data scheme
  const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  
  notification.hidden = false;
  externalLink.href = url;
});

externalLink.addEventListener("click", () => {
  notification.hidden = true;
});

fields.addEventListener("click", () => {
  notification.hidden = true;
});

const chipImage = document.getElementById("chipImage");
const isCodepen = window.origin === "https://cdpn.io";
const chipImageUrl = isCodepen ? GITHUB_PAGES_CHIP_IMG_URL : RELATIVE_CHIP_IMG_URL;
fetch(chipImageUrl)
  .then(response => response.blob())
  .then(blob => {
    //const val = window.URL.createObjectURL(blob);
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
      chipImage.setAttribute("href", reader.result);
    }
  });

const hideButton = document.getElementById("hide");
hideButton.addEventListener("click", () => {
  document.getElementById("instructions").hidden = true;
});

var counter = 0;

const addButton = document.getElementById("add");
addButton.addEventListener("click", () => {
  notification.hidden = true;
  fields.hidden = false;
  counter += 1;
  const div = document.createElement("div");
  div.classList.add("fields");
  div.id = "field" + counter;
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M -80, 0 A 1 1, 0, 0 1, 80 0");
  path.id = div.id;
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("font-size", "18pt");
  text.setAttribute("font-family", "Helvetica, sans-serif");
  text.setAttribute("letter-spacing", 0);
  const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
  
  textPath.setAttribute("fill", GOLD_COLOR_RGB);
  textPath.setAttribute("href", "#" + div.id);
  textPath.setAttribute("startOffset", "50%");
  textPath.setAttribute("text-anchor", "middle");
  text.appendChild(textPath);
  drawing.appendChild(path);
  drawing.appendChild(text);
  
  const fieldTypeLabel = document.createElement("span");
  fieldTypeLabel.innerText = "Type";
  const fieldTypeSelect = document.createElement("select");
  const fieldTypeTop = document.createElement("option");
  fieldTypeTop.value = "top";
  fieldTypeTop.innerText = "Circle Top Text";
  fieldTypeSelect.appendChild(fieldTypeTop);
  const fieldTypeBottom = document.createElement("option");
  fieldTypeBottom.value = "bottom";
  fieldTypeBottom.innerText = "Circle Bottom Text";
  fieldTypeSelect.appendChild(fieldTypeBottom);
  const fieldTypeLine = document.createElement("option");
  fieldTypeLine.value = "line";
  fieldTypeLine.innerText = "Line Text";
  fieldTypeSelect.appendChild(fieldTypeLine);
  const fieldTypeIcon = document.createElement("option");
  fieldTypeIcon.value = "icon";
  fieldTypeIcon.innerText = "Icon";
  fieldTypeSelect.appendChild(fieldTypeIcon);
  div.appendChild(fieldTypeLabel);
  div.appendChild(fieldTypeSelect);
  
  const textLabel = document.createElement("span");
  textLabel.innerText = "Text";
  const textBox = document.createElement("input");
  textBox.value = "Your Text Here";
  div.appendChild(textLabel);
  div.appendChild(textBox);
  const updateText = () => {
    textPath.textContent = textBox.value;
  };
  textBox.addEventListener("input", updateText);
  updateText();
  
  const textSizeLabel = document.createElement("span");
  const textSizeRange = document.createElement("input");
  textSizeRange.type = "range";
  textSizeRange.min = 3;
  textSizeRange.max = 36;
  textSizeRange.value = 12;
  div.appendChild(textSizeLabel);
  div.appendChild(textSizeRange);
  
  const textSpacingLabel = document.createElement("span");
  const textSpacingRange = document.createElement("input");
  textSpacingRange.type = "range";
  textSpacingRange.min = -100;
  textSpacingRange.max = 500;
  textSpacingRange.value = 10;
  const updateTextSpacing = () => {
    const spacing = textSpacingRange.value;
  	textSpacingLabel.innerText = "Spacing (" + spacing + ")";
    text.setAttribute("letter-spacing", spacing/40);
  };
  textSpacingRange.addEventListener("input", updateTextSpacing);
  updateTextSpacing();
  div.appendChild(textSpacingLabel);
  div.appendChild(textSpacingRange);
  
  const iconTypeLabel = document.createElement("span");
  iconTypeLabel.textContent = "Icon";
  const iconTypeSelect = document.createElement("select");
  const iconTypeStar = document.createElement("option");
  iconTypeStar.value = "star";
  iconTypeStar.innerText = "Star";
  iconTypeSelect.append(iconTypeStar);
  const iconTypeCross = document.createElement("option");
  iconTypeCross.value = "cross";
  iconTypeCross.innerText = "Cross";
  iconTypeSelect.append(iconTypeCross);
  const iconTypeSquare = document.createElement("option");
  iconTypeSquare.value = "square";
  iconTypeSquare.innerText = "Square";
  iconTypeSelect.append(iconTypeSquare);
  const iconTypeCircle = document.createElement("option");
  iconTypeCircle.value = "circle";
  iconTypeCircle.innerText = "Circle";
  iconTypeSelect.append(iconTypeCircle);
  div.appendChild(iconTypeLabel);
  div.appendChild(iconTypeSelect);
  
  const iconSizeLabel = document.createElement("span");
  const iconSizeRange = document.createElement("input");
  iconSizeRange.type = "range";
  iconSizeRange.min = 20;
  iconSizeRange.max = 500;
  iconSizeRange.value = 100;
  div.appendChild(iconSizeLabel);
  div.appendChild(iconSizeRange);
  
  const xPositionLabel = document.createElement("span");
  const xPositionRange = document.createElement("input");
  xPositionRange.type = "range";
  xPositionRange.min = -12;
  xPositionRange.max = 12;
  xPositionRange.value = 0;
  div.appendChild(xPositionLabel);
  div.appendChild(xPositionRange);
  
  const yPositionLabel = document.createElement("span");
  const yPositionRange = document.createElement("input");
  yPositionRange.type = "range";
  yPositionRange.min = -12;
  yPositionRange.max = 12;
  yPositionRange.value = 0;
  div.appendChild(yPositionLabel);
  div.appendChild(yPositionRange);
  
  const circleSizeLabel = document.createElement("span");
  const circleSizeRange = document.createElement("input");
  circleSizeRange.type = "range";
  circleSizeRange.min = 5;
  circleSizeRange.max = 24;
  circleSizeRange.value = 18;
  div.appendChild(circleSizeLabel);
  div.appendChild(circleSizeRange);
  
  const updatePath = () => {
    const fieldType = fieldTypeSelect.value;
    
    const isCircularType = ["top", "bottom"].includes(fieldType);
    const isText = ["top", "bottom", "line"].includes(fieldType);
    
    textLabel.hidden = !isText;
    textBox.hidden = !isText;
    textSpacingLabel.hidden = !isText;
    textSpacingRange.hidden = !isText;
    textSizeLabel.hidden = !isText;
    textSizeRange.hidden = !isText;
    iconTypeLabel.hidden = isText;
    iconTypeSelect.hidden = isText;
    iconSizeLabel.hidden = isText;
    iconSizeRange.hidden = isText;
    
    xPositionLabel.hidden = isCircularType;
    xPositionRange.hidden = isCircularType;
    yPositionLabel.hidden = isCircularType;
    yPositionRange.hidden = isCircularType;
    circleSizeLabel.hidden = !isCircularType;
    circleSizeRange.hidden = !isCircularType;
    
    text.setAttribute("visibility", isText ? "visible" : "hidden");
    textPath.textContent = isText ? textBox.value : "";
    path.setAttribute("fill-opacity", isText ? 0 : 100);
    path.setAttribute("fill", isText ? "" : GOLD_COLOR_RGB);
    
    if (!isText) {
      let shape;
      const iconType = iconTypeSelect.value;
      if (iconType === "square") {
        shape = SQUARE;
      } else if (iconType === "star") {
        shape = STAR;
      } else if (iconType === "circle") {
        shape = CIRCLE;
      } else if (iconType === "cross") {
        shape = CROSS;
      } else {
        shape = NONE;
      }
      const scaledShape = shape.map((arr) => {
        return arr.map((el, i) => {
          if (i === 0) {
            return el;
          }
          const instructionType = arr[0];
          const scaledPx = el * iconSizeRange.value / 100;
          const dxPx = xPositionRange.value * 2 * DISPLAY_RADIUS_PX / HOTSTAMP_RADIUS_MM;
      const dyPx = yPositionRange.value * 2 * DISPLAY_RADIUS_PX / HOTSTAMP_RADIUS_MM;
          // Doesn't support arcs yet
          if (instructionType === "V") {
            return (scaledPx + dyPx).toFixed(4);
          } else if (instructionType === "H") {
            return (scaledPx + dxPx).toFixed(4);
          } else if (["M", "L", "C", "S", "Q", "T"].includes(instructionType)) {
            const isX = i % 2 === 1;
            return (isX ? scaledPx + dxPx : scaledPx + dyPx).toFixed(4);
          } else {
            return scaledPx.toFixed(4);
          }
        });
      });
      path.setAttribute("d", scaledShape.flat(Infinity).join(" "));
      
    } else if (isCircularType) {
      const isTop = fieldTypeSelect.value === "top";
      const sweep = isTop ? "1" : "0";
      
      // Our circle scaling factor converts from our internal pixel represeentation to user facing mm measurement.
      const scaledCircleSize = circleSizeRange.value*DISPLAY_RADIUS_PX/HOTSTAMP_RADIUS_MM;
      
      // Text along path uses the path as a baseline.
      // We want the text to appear in the middle of the path, but alignment-baseline is not implemented in Inkscape.
      // So instead, change the size of the scaled circle.
      // See the constant for details on this adjustment factor.
      // For circle top text, we will make the circle smaller.
      // For circle bottom text, we will make the circle larger.
      const adjustmentPx = textSizeRange.value * BASELINE_ADJUST_FACTOR;
      const adjustedCircleSizePx = isTop ? scaledCircleSize - adjustmentPx : scaledCircleSize + adjustmentPx;
      path.setAttribute("d", "M -" + adjustedCircleSizePx + " 0 A 1 1, 0, 0 " + sweep + ", " + adjustedCircleSizePx + " 0");  
    } else {
      // And for line text, we will make the line lower by 8px per 12pt.
      const dxPx = xPositionRange.value * 2 * DISPLAY_RADIUS_PX / HOTSTAMP_RADIUS_MM;
      const dyPx = yPositionRange.value * 2 * DISPLAY_RADIUS_PX / HOTSTAMP_RADIUS_MM;
      const adjustmentPx = textSizeRange.value * BASELINE_ADJUST_FACTOR_VERTICAL;
      const adjustedDyPx = dyPx + adjustmentPx;
      const xStartPx = -DISPLAY_RADIUS_PX + dxPx;
      const xEndPx = DISPLAY_RADIUS_PX + dxPx;
      path.setAttribute("d", "M "+ xStartPx+ " " + adjustedDyPx + " L " + xEndPx + " " + adjustedDyPx);
    }
  };
  
  const updateTextSize = () => {
    const size = textSizeRange.value;
    textSizeLabel.innerText = "Size (" + size + "pt)";
    text.setAttribute("font-size", size + "pt");
    updatePath();
  };
  textSizeRange.addEventListener("input", updateTextSize);
  updateTextSize();
  
  const updateIconType = () => {
    updatePath();
  };
  iconTypeSelect.addEventListener("input", updateIconType);
  updateIconType();
  
  const updateIconSize = () => {
    iconSizeLabel.innerText = "Size (" + iconSizeRange.value + "%)";
    updatePath();
  }
  iconSizeRange.addEventListener("input", updateIconSize);
  updateIconSize();
  
  const updateXPosition = () => {
    xPositionLabel.innerText = "X (" + xPositionRange.value + "mm)";
    updatePath();
  };
  xPositionRange.addEventListener("input", updateXPosition);
  updateXPosition();
  
  const updateYPosition = () => {
    yPositionLabel.innerText = "Y (" + yPositionRange.value + "mm)";
    updatePath();
  };
  yPositionRange.addEventListener("input", updateYPosition);
  updateYPosition();
  
  const updateCircleSize = () => {
    circleSizeLabel.innerText = "Circle (" + circleSizeRange.value + "mm)";
    updatePath();
  };
  circleSizeRange.addEventListener("input", updateCircleSize);
  updateCircleSize();
  
  const updateFieldType = () => {
    updatePath();
  }
  fieldTypeSelect.addEventListener("input", updateFieldType);
  updateFieldType();
  
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {
  	div.remove();
    path.remove();
    text.remove();
    
    if (fields.children.length === 0) {
      fields.hidden = true;
    }
  });
  div.appendChild(deleteButton);
  
  fields.appendChild(div);
});
