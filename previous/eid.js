
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let floorImage = null;
let floorLoaded = false;
let assetsOnCanvas = [];
let selectedAssetIndex = -1;
let selectedAssetIndices = [];
let dragOffsets = {};

let techAssets = [];
let selectedTechAssetIndex = -1;

let hardwareAssets = [];
let selectedHardwareAssetIndex = -1;

let canvasZoom = 1.0;
let panOffsetX = 0;
let panOffsetY = 0;

let globalAnchorX = 0;
let globalAnchorY = 0;

let hoveredAssetIndex = -1;

const btnScaleUp = document.getElementById('btnScaleUp');
const btnScaleDown = document.getElementById('btnScaleDown');
const btnFlipV = document.getElementById('btnFlipV');
const btnFlipH = document.getElementById('btnFlipH');
const btnSendBack = document.getElementById('btnSendBack');
const btnBringForward = document.getElementById('btnBringForward');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnDelete = document.getElementById('btnDelete');
const btnInfo = document.getElementById('btnInfo');
const btnMaximize = document.getElementById('btnMaximize');
const btnSave = document.getElementById('btnSave');

const btnPanLeft = document.getElementById('btnPanLeft');
const btnPanRight = document.getElementById('btnPanRight');

const toggleLeftBtn = document.getElementById('toggleLeftSidebar');
const toggleRightBtn = document.getElementById('toggleRightSidebar');
const leftSidebar = document.getElementById('leftSidebar');
const rightSidebar = document.getElementById('rightSidebar');

const floorImages = document.querySelectorAll('.floor-img');

const categoryBtns = document.querySelectorAll('.category-btn');
const assetsContainer = document.getElementById('assetsContainer');

const hardwareContainer = document.getElementById('hardwareAssetsContainer');
const techContainer = document.getElementById('techAssetsContainer');

const infoModal = document.getElementById('infoModal');
const closeInfo = document.getElementById('closeInfo');

const assets = {};



function updateTotalAmount() {
  let total = 0;
  assetsOnCanvas.forEach(asset => {
    total += asset.price * asset.quantity;
  });
  techAssets.forEach(asset => {
    total += asset.price * asset.quantity;
  });
  hardwareAssets.forEach(asset => {
    total += asset.price * asset.quantity;
  });
  document.getElementById('totalDailyAmount').innerHTML = `Total Daily Amount: <b>$${total.toFixed(2)}</b>`;
}


async function fetchAssets() {
  try {
    const response = await fetch('https://techasapusa3d.com/wp-content/plugins/equipments-api/get_equipments.php');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return processAssets(data);
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return {};
  }
}


function processAssets(data) {
  
  data.forEach(equipment => {
    const category = equipment.category;
    if (!assets[category]) {
      assets[category] = [];
    }
    assets[category].push({
      name: equipment.name,
      image_path: equipment.image_path,
      price: equipment.price,
      description: equipment.description
    });
  });
  return assets;
}

function renderAssets(category, assets) {
  const assetsContainer = document.getElementById('assetsContainer');
  const categoryAssets = assets[category];
  if (!categoryAssets || !assetsContainer) return;

  assetsContainer.innerHTML = categoryAssets
    .map(asset => {
     
      return `
        <div class="bg-white rounded shadow-sm flex items-center justify-center p-2 relative group">
          <img 
            src="${asset.image_path}" 
            alt="${asset.name}" 
            class="w-[100px] h-[100px] object-contain bg-transparent"
            data-category="${category}"
            data-name="${asset.name}"
            data-price="${asset.price}"
            data-description="${asset.description}"
          />
          <div class="absolute bottom-[100%] left-1/2 transform -translate-x-1/2 translate-y-[25px] z-[100] bg-gray-900 text-white p-3 rounded-xl shadow-2xl 2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none w-[150px]">
             <p class="text-base font-semibold text-white leading-tight truncate">${asset.name}</p>
             <p class="text-lg font-bold text-green-400 leading-snug">$${asset.price}</p>
             <p class="text-xs text-gray-300 leading-snug break-words">${asset.description || 'No description available'}</p>
          </div>
        </div>
      `;
    })
    .join('');
}


document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("ballroomsContainer");
    container.innerHTML = "";

    let customImageSet = false;

    
    const customBlock = document.createElement("div");
    customBlock.id = "customBallroomBlock";
    customBlock.className = "bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform";

    const customImg = document.createElement("img");
    customImg.src = "floors/upload.png";
    customImg.alt = "Upload Custom Ballroom";
    customImg.className = "w-full h-[140px] p-1 object-cover floor-img";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    customBlock.appendChild(customImg);
    customBlock.appendChild(fileInput);

    customBlock.addEventListener("click", function () {
        if (!customImageSet) {
            fileInput.click();
        } else {
            const src = customImg.getAttribute("src");
            const newFloorImage = new Image();
            newFloorImage.src = src;
            newFloorImage.onload = () => {
                floorImage = {
                    image: newFloorImage,
                    width: newFloorImage.width,
                    height: newFloorImage.height,
                    src
                };
                floorLoaded = true;
                drawCanvas();
            };
        }
    });

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                customImg.src = e.target.result;
                customImageSet = true;
            };
            reader.readAsDataURL(file);
        }
    });

    container.appendChild(customBlock);

   
    try {
        const response = await fetch('/wp-content/plugins/ballrooms-api/get_ballrooms.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const ballrooms = await response.json();

        ballrooms.forEach(function (ballroom) {
            const div = document.createElement("div");
            div.className = "bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform";
            const img = document.createElement("img");
            img.src = ballroom.image_path;
            img.alt = 'Meeting/Ballrooms image';
            img.className = "w-full h-[140px] p-1 object-cover floor-img";

            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                const newFloorImage = new Image();
                newFloorImage.src = src;
                newFloorImage.onload = () => {
                    floorImage = {
                        image: newFloorImage,
                        width: newFloorImage.width,
                        height: newFloorImage.height,
                        src
                    };
                    floorLoaded = true;
                    drawCanvas();
                };
            });

            div.appendChild(img);
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Failed to fetch ballrooms:", error);
       
    }
    
    const assets = await fetchAssets();


    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            renderAssets(category, assets);
        });
    });


    if (assets['Audio']) {
        renderAssets('Audio', assets);
    }
    
assetsContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'IMG') { 
    const category = event.target.dataset.category;
    const name = event.target.dataset.name;
    const price = event.target.dataset.price;
    const description = event.target.dataset.description;
    const src = event.target.src;
    if (category === "Cable Trunk Hardware") {
      placeHardwareAssetOntoCase({ src, name, price, description });
    } else if (category === "Tech Table Items") {
      placeTechAssetAboveTable({ src, name, price, description });
    }
  }
});
  
});


function placeHardwareAssetOntoCase(assetData) {
  const width = 27;
  const maxItems = 8;
  if (hardwareAssets.length >= maxItems) {
    console.log("Case is full. No more Hardware items can be added.");
    return;
  }
  const img = new Image();
  img.src = assetData.src;
  img.onload = () => {
    const assetObj = {
      img,
      width: width,
      height: width,
      selected: false,
      quantity: 1,
      name: assetData.name,
      price: parseFloat(assetData.price),
      description: assetData.description
    };
    hardwareAssets.push(assetObj);
    renderHardwareAssets();
    updateTotalAmount();
  };
}


function renderHardwareAssets() {
  hardwareContainer.innerHTML = '';
  hardwareAssets.forEach((asset, index) => {
    
    const assetWrapper = document.createElement('div');
    assetWrapper.style.position = 'relative';
    assetWrapper.style.display = 'inline-block';

    
    const assetElem = document.createElement('div');
    assetElem.style.width = `${asset.width}px`;
    assetElem.style.height = `${asset.height}px`;
    assetElem.style.backgroundImage = `url(${asset.img.src})`;
    assetElem.style.backgroundSize = 'contain';
    assetElem.style.backgroundRepeat = 'no-repeat';
    assetElem.style.backgroundPosition = 'center';
    assetElem.classList.add('cursor-pointer');

    
    const controlDiv = document.createElement('div');
    controlDiv.style.position = 'absolute';
    controlDiv.style.left = '20%';
    controlDiv.style.width = '60px';
    controlDiv.style.transform = 'translateX(-50%)';
    controlDiv.style.display = 'flex';
    controlDiv.style.alignItems = 'center';
    controlDiv.style.justifyContent = 'center';
    controlDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    controlDiv.style.padding = '2px 5px';
    controlDiv.style.borderRadius = '4px';
    controlDiv.style.visibility = 'hidden';
    controlDiv.style.opacity = '0';
    controlDiv.style.transition = 'opacity 0.2s, visibility 0.2s';

    
    if (index < 4) {
      controlDiv.style.top = '-25px'; 
    } else {
      controlDiv.style.top = `${asset.height}px`; 
    }


    
    const plusBtn = document.createElement('img');
    plusBtn.src = 'icons/plus.svg';
    plusBtn.style.width = '16px';
    plusBtn.style.height = '16px';
    plusBtn.style.cursor = 'pointer';
    plusBtn.style.marginRight = '5px';

    
    const qtyDisplay = document.createElement('p');
    qtyDisplay.innerHTML = `<b>${asset.quantity}</b>`;
    qtyDisplay.style.margin = '0 5px';
    qtyDisplay.style.color = 'white';
    qtyDisplay.style.fontSize = '14px';

    
    const minusBtn = document.createElement('img');
    minusBtn.src = 'icons/minus.svg';
    minusBtn.style.width = '16px';
    minusBtn.style.height = '16px';
    minusBtn.style.cursor = 'pointer';
    minusBtn.style.marginLeft = '5px';

    
    controlDiv.appendChild(plusBtn);
    controlDiv.appendChild(qtyDisplay);
    controlDiv.appendChild(minusBtn);

    
    assetWrapper.appendChild(assetElem);
    assetWrapper.appendChild(controlDiv);

    
    assetWrapper.addEventListener('mouseenter', () => {
      controlDiv.style.visibility = 'visible';
      controlDiv.style.opacity = '1';
    });
    assetWrapper.addEventListener('mouseleave', () => {
      controlDiv.style.visibility = 'hidden';
      controlDiv.style.opacity = '0';
    });

    
    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      asset.quantity++;
      qtyDisplay.innerHTML = `<b>${asset.quantity}</b>`;
      updateTotalAmount();
    });
    
    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      asset.quantity--;
      if (asset.quantity <= 0) {
        hardwareAssets.splice(index, 1);
        renderHardwareAssets();
      } else {
        qtyDisplay.innerHTML = `<b>${asset.quantity}</b>`;
      }
      updateTotalAmount();
    });

    hardwareContainer.appendChild(assetWrapper);
  });
}


function placeTechAssetAboveTable(assetData) {
  const width = 60;
  const maxItems = 8;
  if (techAssets.length >= maxItems) {
    console.log("Table is full. No more Tech items can be added.");
    return;
  }
  const img = new Image();
  img.src = assetData.src;
  img.onload = () => {
    const assetObj = {
      img,
      width: width,
      height: width,
      selected: false,
      quantity: 1,
      name: assetData.name,
      price: parseFloat(assetData.price),
      description: assetData.description
    };
    techAssets.push(assetObj);
    renderTechAssets();
    updateTotalAmount();
  };
}

function renderTechAssets() {
  techContainer.innerHTML = '';
  techAssets.forEach((asset, index) => {
    
    const assetWrapper = document.createElement('div');
    assetWrapper.style.position = 'relative';
    assetWrapper.style.display = 'inline-block';

    
    const assetElem = document.createElement('div');
    assetElem.style.width = `${asset.width}px`;
    assetElem.style.height = `${asset.height}px`;
    assetElem.style.backgroundImage = `url(${asset.img.src})`;
    assetElem.style.backgroundSize = 'contain';
    assetElem.style.backgroundRepeat = 'no-repeat';
    assetElem.style.backgroundPosition = 'center';
    assetElem.classList.add('cursor-pointer');



    
    const controlDiv = document.createElement('div');
    controlDiv.style.position = 'absolute';
    controlDiv.style.top = '-20px'; 
    controlDiv.style.width = '60px';
    controlDiv.style.left = '50%';
    controlDiv.style.transform = 'translateX(-50%)';
    controlDiv.style.display = 'flex';
    controlDiv.style.alignItems = 'center';
    controlDiv.style.justifyContent = 'center';
    controlDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    controlDiv.style.padding = '2px 5px';
    controlDiv.style.borderRadius = '4px';
    controlDiv.style.visibility = 'hidden';
    controlDiv.style.opacity = '0';
    controlDiv.style.transition = 'opacity 0.2s, visibility 0.2s';



    
    const plusBtn = document.createElement('img');
    plusBtn.src = 'icons/plus.svg';
    plusBtn.style.width = '16px';
    plusBtn.style.height = '16px';
    plusBtn.style.cursor = 'pointer';
    plusBtn.style.marginRight = '5px';

    
    const qtyDisplay = document.createElement('p');
    qtyDisplay.innerHTML = `<b>${asset.quantity}</b>`;
    qtyDisplay.style.margin = '0 5px';
    qtyDisplay.style.color = 'white';
    qtyDisplay.style.fontSize = '14px';

    
    const minusBtn = document.createElement('img');
    minusBtn.src = 'icons/minus.svg';
    minusBtn.style.width = '16px';
    minusBtn.style.height = '16px';
    minusBtn.style.cursor = 'pointer';
    minusBtn.style.marginLeft = '5px';

    
    controlDiv.appendChild(plusBtn);
    controlDiv.appendChild(qtyDisplay);
    controlDiv.appendChild(minusBtn);

    
    assetWrapper.appendChild(assetElem);
    assetWrapper.appendChild(controlDiv);

    
    assetWrapper.addEventListener('mouseenter', () => {
      controlDiv.style.visibility = 'visible';
      controlDiv.style.opacity = '1';
    });
    assetWrapper.addEventListener('mouseleave', () => {
      controlDiv.style.visibility = 'hidden';
      controlDiv.style.opacity = '0';
    });

    
    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      asset.quantity++;
      qtyDisplay.innerHTML = `<b>${asset.quantity}</b>`;
      updateTotalAmount();
    });
    
    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      asset.quantity--;
      if (asset.quantity <= 0) {
        techAssets.splice(index, 1);
        renderTechAssets();
      } else {
        qtyDisplay.innerHTML = `<b>${asset.quantity}</b>`;
      }
      updateTotalAmount();
    });

    techContainer.appendChild(assetWrapper);
  });
}



function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  let drawWidth, drawHeight, offsetX, offsetY;
  if (floorLoaded && floorImage) {
    const aspectCanvas = canvas.width / canvas.height;
    const aspectFloor = floorImage.width / floorImage.height;

    if (aspectFloor > aspectCanvas) {
      drawHeight = canvas.height;
      drawWidth = aspectFloor * drawHeight;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / aspectFloor;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }
  }

  const anchorX = canvas.width / 2;
  const anchorY = canvas.height / 2;
  globalAnchorX = anchorX;
  globalAnchorY = anchorY;
  const effectiveAnchorX = anchorX + panOffsetX;
  const effectiveAnchorY = anchorY + panOffsetY;

  ctx.translate(effectiveAnchorX, effectiveAnchorY);
  ctx.scale(canvasZoom, canvasZoom);
  ctx.translate(-effectiveAnchorX, -effectiveAnchorY);

  if (floorLoaded && floorImage) {
    ctx.drawImage(floorImage.image, offsetX, offsetY, drawWidth, drawHeight);
  }

  assetsOnCanvas.forEach((asset, index) => {
    ctx.save();
    ctx.translate(asset.x, asset.y);
    let flipHScale = asset.flippedH ? -1 : 1;
    let flipVScale = asset.flippedV ? -1 : 1;
    ctx.scale(flipHScale * asset.scaleX, flipVScale * asset.scaleY);
    ctx.drawImage(asset.img, -asset.width / 2, -asset.height / 2, asset.width, asset.height);

    if (selectedAssetIndices.includes(index)) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.setLineDash([]);
      ctx.strokeRect(-asset.width / 2, -asset.height / 2, asset.width, asset.height);
    } else if (index === hoveredAssetIndex) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'blue';
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(-asset.width / 2, -asset.height / 2, asset.width, asset.height);
    }
    ctx.restore();
  });
  ctx.restore();
}

function createAsset(img, x, y) {
  return {
    img,
    x,
    y,
    width: img.width,
    height: img.height,
    scaleX: 1,
    scaleY: 1,
    flippedH: false,
    flippedV: false
  };
}

function getAssetAt(x, y) {
  const minHitSize = 30;
  for (let i = assetsOnCanvas.length - 1; i >= 0; i--) {
    const asset = assetsOnCanvas[i];
    const dx = x - asset.x;
    const dy = y - asset.y;
    const localX = dx / asset.scaleX;
    const localY = dy / asset.scaleY;
    const halfWidth = Math.max(asset.width / 2, minHitSize / 2);
    const halfHeight = Math.max(asset.height / 2, minHitSize / 2);
    if (Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfHeight) {
      return i;
    }
  }
  return -1;
}

function getTransformedCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const effectiveAnchorX = globalAnchorX + panOffsetX;
  const effectiveAnchorY = globalAnchorY + panOffsetY;
  const transformedX = (x - effectiveAnchorX) / canvasZoom + effectiveAnchorX;
  const transformedY = (y - effectiveAnchorY) / canvasZoom + effectiveAnchorY;
  return { x: transformedX, y: transformedY };
}

toggleLeftBtn.addEventListener('click', () => {
  leftSidebar.classList.toggle('hidden');
});
toggleRightBtn.addEventListener('click', () => {
  rightSidebar.classList.toggle('hidden');
});

window.addEventListener('DOMContentLoaded', () => {
  hardwareContainer.classList.add('flex', 'items-center', 'justify-start', 'flex-wrap');
  techContainer.classList.add('flex', 'items-center', 'justify-start');
  renderAssets('Audio', assets);

  updatePanButtons();
});

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    renderAssets(category, assets);
  });
});

floorImages.forEach(imgEl => {
  imgEl.addEventListener('click', () => {
    const src = imgEl.getAttribute('src');
    const newFloorImage = new Image();
    newFloorImage.src = src;
    newFloorImage.onload = () => {
      floorImage = { image: newFloorImage, width: newFloorImage.width, height: newFloorImage.height, src };
      floorLoaded = true;
      drawCanvas();
    };
  });
});

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    const assetData = {
      src: e.target.src,
      name: e.target.dataset.name,
      price: e.target.dataset.price,
      description: e.target.dataset.description,
      category: e.target.dataset.category
    };
    e.dataTransfer.setData('application/json', JSON.stringify(assetData));
  }
});


function handleDrop(e) {
  e.preventDefault();
  if (!floorLoaded) {
    alert("Please load a floor plan before dropping assets.");
    return;
  }
  const assetDataStr = e.dataTransfer.getData('application/json');
  if (!assetDataStr) {
    console.log("No asset data found in drag data.");
    return;
  }
  const assetData = JSON.parse(assetDataStr);
  if (assetData.category === "Cable Trunk Hardware" || assetData.category === "Tech Table Items") {
    alert("Items from Hardware or Tech categories cannot be dropped on the canvas.");
    return;
  }
  const img = new Image();
  img.src = assetData.src;
  img.onload = () => {
    const coords = getTransformedCoordinates(e);
    const assetObj = {
      img,
      x: coords.x,
      y: coords.y,
      width: img.width,
      height: img.height,
      scaleX: 1,
      scaleY: 1,
      flippedH: false,
      flippedV: false,
      name: assetData.name,
      price: parseFloat(assetData.price),
      description: assetData.description,
      quantity: 1
    };
    assetsOnCanvas.push(assetObj);
    selectedAssetIndices = [assetsOnCanvas.length - 1];
    selectedAssetIndex = assetsOnCanvas.length - 1;
    drawCanvas();
    updateTotalAmount();
  };
}
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

canvas.addEventListener('mousedown', (e) => {
  const { x: mouseX, y: mouseY } = getTransformedCoordinates(e);
  const idx = getAssetAt(mouseX, mouseY);
  if (idx >= 0) {
    if (e.ctrlKey) {
      if (!selectedAssetIndices.includes(idx)) {
        selectedAssetIndices.push(idx);
      }
    } else {
      if (!selectedAssetIndices.includes(idx)) {
        selectedAssetIndices = [idx];
      }
    }
    dragOffsets = {};
    selectedAssetIndices.forEach(index => {
      const asset = assetsOnCanvas[index];
      dragOffsets[index] = {
        offsetX: mouseX - asset.x,
        offsetY: mouseY - asset.y
      };
    });
    isDragging = true;
  } else {
    selectedAssetIndices = [];
  }
  drawCanvas();
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedAssetIndices.length > 0) {
    const { x: mouseX, y: mouseY } = getTransformedCoordinates(e);
    selectedAssetIndices.forEach(index => {
      const asset = assetsOnCanvas[index];
      const offsets = dragOffsets[index];
      asset.x = mouseX - offsets.offsetX;
      asset.y = mouseY - offsets.offsetY;
    });
    drawCanvas();
    return;
  }
  if (isDragging) return;
  const { x, y } = getTransformedCoordinates(e);
  const idx = getAssetAt(x, y);
  if (hoveredAssetIndex !== idx) {
    hoveredAssetIndex = idx;
    drawCanvas();
  }
  canvas.style.cursor = idx >= 0 ? 'pointer' : 'default';
});

canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    dragOffsets = {};
  }
});

canvas.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    dragOffsets = {};
  }
});


btnScaleUp.addEventListener('click', () => {
  if (selectedAssetIndices.length === 0) return;
  selectedAssetIndices.forEach(index => {
    const asset = assetsOnCanvas[index];
    asset.scaleX = Math.min(asset.scaleX + 0.1, 1.4);
    asset.scaleY = Math.min(asset.scaleY + 0.1, 1.4);
  });
  drawCanvas();
});

btnScaleDown.addEventListener('click', () => {
  if (selectedAssetIndices.length === 0) return;
  selectedAssetIndices.forEach(index => {
    const asset = assetsOnCanvas[index];
    asset.scaleX = Math.max(asset.scaleX - 0.1, 0.4);
    asset.scaleY = Math.max(asset.scaleY - 0.1, 0.4);
  });
  drawCanvas();
});

btnFlipV.addEventListener('click', () => {
  if (selectedAssetIndices.length === 0) return;
  selectedAssetIndices.forEach(index => {
    const asset = assetsOnCanvas[index];
    asset.flippedV = !asset.flippedV;
  });
  drawCanvas();
});

btnFlipH.addEventListener('click', () => {
  if (selectedAssetIndices.length === 0) return;
  selectedAssetIndices.forEach(index => {
    const asset = assetsOnCanvas[index];
    asset.flippedH = !asset.flippedH;
  });
  drawCanvas();
});

btnSendBack.addEventListener('click', () => {
  if (selectedAssetIndices.length !== 1) return;
  let idx = selectedAssetIndices[0];
  if (idx > 0) {
    const temp = assetsOnCanvas[idx - 1];
    assetsOnCanvas[idx - 1] = assetsOnCanvas[idx];
    assetsOnCanvas[idx] = temp;
    selectedAssetIndices = [idx - 1];
    drawCanvas();
  }
});

btnBringForward.addEventListener('click', () => {
  if (selectedAssetIndices.length !== 1) return;
  let idx = selectedAssetIndices[0];
  if (idx < assetsOnCanvas.length - 1) {
    const temp = assetsOnCanvas[idx + 1];
    assetsOnCanvas[idx + 1] = assetsOnCanvas[idx];
    assetsOnCanvas[idx] = temp;
    selectedAssetIndices = [idx + 1];
    drawCanvas();
  }
});

btnZoomIn.addEventListener('click', () => {
  canvasZoom += 0.1;
  drawCanvas();
  updatePanButtons();
});

btnZoomOut.addEventListener('click', () => {
  canvasZoom = Math.max(1.0, canvasZoom - 0.1);
  if (canvasZoom === 1.0) {
    panOffsetX = 0;
    panOffsetY = 0;
  }
  drawCanvas();
  updatePanButtons();
});


btnSave.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final-canvas.png';
  link.click();
});

btnInfo.addEventListener('click', () => {
  infoModal.classList.remove('hidden');
});
closeInfo.addEventListener('click', () => {
  infoModal.classList.add('hidden');
});

btnMaximize.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

function updatePanButtons() {
  const enabled = canvasZoom > 1.0;
  btnPanLeft.disabled = !enabled;
  btnPanRight.disabled = !enabled;
}

const panStep = 40;

btnPanLeft.addEventListener('click', () => {
  if (canvasZoom > 1.0) {
    panOffsetX -= panStep;
    drawCanvas();
  }
});

btnPanRight.addEventListener('click', () => {
  if (canvasZoom > 1.0) {
    panOffsetX += panStep;
    drawCanvas();
  }
});

btnDelete.addEventListener('click', () => {
  if (selectedAssetIndices.length === 0) return;
  assetsOnCanvas = assetsOnCanvas.filter((asset, index) => !selectedAssetIndices.includes(index));
  selectedAssetIndices = [];
  drawCanvas();
  updateTotalAmount();
});


function debounce(func, wait) {
  let timeout;
  return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


function resizeCanvas() {
  const canvas = document.getElementById('myCanvas');
  const container = canvas.parentElement;
  const ctx = canvas.getContext('2d');


  const tempData = canvas.toDataURL();
  const savedImage = new Image();
  savedImage.src = tempData;

  savedImage.onload = function () {

      const newWidth = container.clientWidth * 0.9;
      const newHeight = newWidth * 0.5625;


      canvas.width = newWidth;
      canvas.height = newHeight;


      ctx.drawImage(savedImage, 0, 0, newWidth, newHeight);
  };
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('get_settings.php')
        .then(response => response.json())
        .then(data => {
            
            document.getElementById('topLogo').src = data.top_logo;

            
            document.getElementById('hardwareLogo').src = data.hardware_logo;

            
            document.getElementById('caseLogo').src = data.case_logo;

            
            document.getElementById('floorHeading').textContent = data.headings.Floor;
            document.getElementById('equipmentHeading').textContent = data.headings.Equipment;

            
            const categoryButtons = document.querySelectorAll('.category-btn');
            const categories = data.categories;
            const staticCategories = ['Audio', 'Video', 'Lighting', 'Tech Table Items', 'Cable Trunk Hardware'];

            categoryButtons[0].textContent = categories.tab1;
            categoryButtons[0].dataset.category = staticCategories[0]; 

            categoryButtons[1].textContent = categories.tab2;
            categoryButtons[1].dataset.category = staticCategories[1]; 

            categoryButtons[2].textContent = categories.tab3;
            categoryButtons[2].dataset.category = staticCategories[2]; 

            categoryButtons[3].textContent = categories.tab4;
            categoryButtons[3].dataset.category = staticCategories[3]; 

            categoryButtons[4].textContent = categories.tab5;
            categoryButtons[4].dataset.category = staticCategories[4]; 
        })
        .catch(error => console.error('Error fetching settings:', error));
});




  document.addEventListener('DOMContentLoaded', function() {
        const nav = document.getElementById('categoriesNav');
        const leftFade = document.getElementById('leftFade');
        
        nav.addEventListener('scroll', function() {
            
            if (nav.scrollLeft > 20) {
                leftFade.classList.remove('opacity-0');
            } else {
                leftFade.classList.add('opacity-0');
            }
        });
    });
    

function initializeSummaryPopup() {
    
    const viewSummaryBtn = document.getElementById('viewSummary');
    const numberOfDaysInput = document.getElementById('numberOfDays');


    const popup = document.createElement('div');
    popup.id = 'summaryPopup';
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center hidden';
    popup.innerHTML = `
        <div class="bg-gray-100 border-2 border-black rounded-lg p-4 w-3/4 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">Estimate Official Quote</h2>
                <img src="icons/cross.svg" alt="Close" class="w-5 h-5 cursor-pointer close-btn">
            </div>
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-white">
                        <th class="border border-black p-2 font-bold text-center">Item#</th>
                        <th class="border border-black p-2 font-bold text-center">Image</th>
                        <th class="border border-black p-2 font-bold text-center">Name</th>
                        <th class="border border-black p-2 font-bold text-center w-80">Description</th>
                        <th class="border border-black p-2 font-bold text-center">Unit Price</th>
                        <th class="border border-black p-2 font-bold text-center">Qty</th>
                        <th class="border border-black p-2 font-bold text-center w-64">total unit price (per day)</th>
                        <th class="border border-black p-2 font-bold text-center w-64">Total Price (Days of rental)</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="mt-4 p-4 bg-white border border-black rounded">
                <p><strong>Equipment Total:</strong> <span id="equipmentTotal"></span></p>
                <p><strong>Number of Days:</strong> <span id="summaryNumberOfDays"></span></p>
                <p><strong>Total Event Estimate:</strong> <span id="totalEventEstimate"></span></p>
            </div>
        </div>
    `;
    document.body.appendChild(popup);


    viewSummaryBtn.addEventListener('click', function() {
        const numberOfDays = parseInt(numberOfDaysInput.value) || 1; 
        const tbody = popup.querySelector('tbody');
        const summaryAssets = {};
        let equipmentTotal = 0; 
        let totalEventEstimate = 0; 


        assetsOnCanvas.forEach(asset => {
            if (!summaryAssets[asset.name]) {
                summaryAssets[asset.name] = {
                    image: asset.img.src,
                    description: asset.description,
                    unitPrice: asset.price,
                    totalQuantity: 0
                };
            }
            summaryAssets[asset.name].totalQuantity += 1;
        });


        techAssets.forEach(asset => {
            if (!summaryAssets[asset.name]) {
                summaryAssets[asset.name] = {
                    image: asset.img.src,
                    description: asset.description,
                    unitPrice: asset.price,
                    totalQuantity: 0
                };
            }
            summaryAssets[asset.name].totalQuantity += asset.quantity;
        });


        hardwareAssets.forEach(asset => {
            if (!summaryAssets[asset.name]) {
                summaryAssets[asset.name] = {
                    image: asset.img.src,
                    description: asset.description,
                    unitPrice: asset.price,
                    totalQuantity: 0
                };
            }
            summaryAssets[asset.name].totalQuantity += asset.quantity;
        });


        const summaryArray = Object.entries(summaryAssets)
            .map(([name, data], index) => ({
                id: index + 1,
                name,
                ...data
            }))
            .sort((a, b) => a.name.localeCompare(b.name));


        tbody.innerHTML = '';
        summaryArray.forEach(asset => {
            const totalPricePerDay = asset.unitPrice * asset.totalQuantity;
            const totalPriceForDays = totalPricePerDay * numberOfDays;
            equipmentTotal += totalPricePerDay; 
            totalEventEstimate += totalPriceForDays; 

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border border-black p-2 text-center">${asset.id}</td>
                <td class="border border-black p-2 text-center">
                    <img src="${asset.image}" alt="${asset.name}" class="w-10 h-10 object-contain">
                </td>
                <td class="border border-black p-2 text-center">${asset.name}</td>
                <td class="border border-black p-2 text-center">${asset.description}</td>
                <td class="border border-black p-2 text-center">$${asset.unitPrice.toFixed(2)}</td>
                <td class="border border-black p-2 text-center">${asset.totalQuantity}</td>
                <td class="border border-black p-2 text-center">$${totalPricePerDay.toFixed(2)}</td>
                <td class="border border-black p-2 text-center">$${totalPriceForDays.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });


        document.getElementById('equipmentTotal').textContent = `$${equipmentTotal.toFixed(2)}`;
        document.getElementById('summaryNumberOfDays').textContent = numberOfDays;
        document.getElementById('totalEventEstimate').textContent = `$${totalEventEstimate.toFixed(2)}`;


        popup.classList.remove('hidden');
    });


    popup.querySelector('.close-btn').addEventListener('click', function() {
        popup.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', initializeSummaryPopup);


resizeCanvas();
updateTotalAmount();


window.addEventListener('resize', debounce(resizeCanvas, 200));