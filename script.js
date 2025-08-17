let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];
let editingIndex = null;

function saveWardrobe() {
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
}

function displayClothes(list) {
  const container = document.getElementById("clothesList");
  container.innerHTML = "";
  list.forEach((item, index) => {
    let div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>Category: ${item.type}</p>
      <p>Color: ${item.colorName} <span class="color-box" style="background:${item.colorHex}"></span></p>
      ${item.imgData ? `<img src="${item.imgData}" alt="${item.name}">` : ""}
      <button onclick="openEdit(${index})">✏️ Edit</button>
      <button onclick="deleteItem(${index})">🗑️ Delete</button>
      <button class="favorite-btn" onclick="toggleFavorite(${index})">${item.favorite ? "⭐" : "☆"}</button>
    `;
    container.appendChild(div);
  });
}

function addClothing() {
  let name = document.getElementById("itemName").value.trim();
  let type = document.getElementById("itemType").value;
  let hex = document.getElementById("itemColorHex").value.trim();
  let colorName = document.getElementById("itemColorName").value.trim().toLowerCase();
  let file = document.getElementById("itemImage").files[0];
  let url = document.getElementById("itemImageUrl").value.trim();
  let preview = document.getElementById("itemPreview");

  if (!name || !colorName) {
    alert("Please enter name and color!");
    return;
  }

  function addItem(imgData) {
    wardrobe.push({ name, type, colorHex: hex, colorName, imgData, favorite: false });
    saveWardrobe();
    displayClothes(wardrobe);
    document.getElementById("itemName").value = "";
    document.getElementById("itemColorName").value = "";
    document.getElementById("itemImage").value = "";
    document.getElementById("itemImageUrl").value = "";
    if (preview) preview.src = "";
  }

  if (file) {
    let reader = new FileReader();
    reader.onload = e => {
      if (preview) preview.src = e.target.result;
      addItem(e.target.result);
    };
    reader.readAsDataURL(file);
  } else if (url) {
    let img = new Image();
    img.onload = () => {
      if (preview) preview.src = url;
      addItem(url);
    };
    img.onerror = () => alert("Invalid image URL. Please check the link.");
    img.src = url;
  } else {
    addItem("");
  }
}

function openEdit(index) {
  editingIndex = index;
  let item = wardrobe[index];
  document.getElementById("editName").value = item.name;
  document.getElementById("editType").value = item.type;
  document.getElementById("editColorHex").value = item.colorHex;
  document.getElementById("editColorName").value = item.colorName;
  document.getElementById("editImage").value = "";
  document.getElementById("editImageUrl").value = "";

  let preview = document.getElementById("editPreview");
  if(preview) preview.src = item.imgData || "";

  document.getElementById("editModal").style.display = "flex";
}

function saveEdit() {
  let newName = document.getElementById("editName").value.trim();
  let newType = document.getElementById("editType").value;
  let newHex = document.getElementById("editColorHex").value.trim();
  let newColorName = document.getElementById("editColorName").value.trim().toLowerCase();
  let imageFile = document.getElementById("editImage").files[0];
  let imageUrl = document.getElementById("editImageUrl").value.trim();
  let preview = document.getElementById("editPreview");

  if (!newName || !newColorName) {
    alert("Enter both name and color name!");
    return;
  }

  function updateItem(imgData = undefined) {
    let item = wardrobe[editingIndex];
    item.name = newName;
    item.type = newType;
    item.colorHex = newHex;
    item.colorName = newColorName;
    if (imgData !== undefined && imgData !== null && imgData !== "") {
      item.imgData = imgData;
    }
    saveWardrobe();
    displayClothes(wardrobe);
    if(preview) preview.src = "";
    closeModal();
  }

  if (imageFile) {
    let reader = new FileReader();
    reader.onload = e => {
      if(preview) preview.src = e.target.result;
      updateItem(e.target.result);
    };
    reader.readAsDataURL(imageFile);
  } else if (imageUrl) {
    let img = new Image();
    img.onload = () => {
      if(preview) preview.src = imageUrl;
      updateItem(imageUrl);
    };
    img.onerror = () => alert("Invalid image URL. Please check the link.");
    img.src = imageUrl;
  } else {
    updateItem(); // keep old image if nothing new
  }
}

function deleteItem(index) {
  if (confirm("Delete this item?")) {
    wardrobe.splice(index, 1);
    saveWardrobe();
    displayClothes(wardrobe);
  }
}

function toggleFavorite(index) {
  wardrobe[index].favorite = !wardrobe[index].favorite;
  saveWardrobe();
  displayClothes(wardrobe);
}

function showFavorites() {
  let favs = wardrobe.filter(item => item.favorite);
  displayClothes(favs);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function toggleView() {
  document.body.classList.toggle("grid-view");
}

function toggleSection(id) {
  let sec = document.getElementById(id);
  sec.style.display = sec.style.display === "block" ? "none" : "block";
}

function applySearch() {
  let name = document.getElementById("searchInput").value.toLowerCase();
  let type = document.getElementById("searchType").value;
  let color = document.getElementById("searchColor").value.toLowerCase();

  let filtered = wardrobe.filter(item =>
    (name === "" || item.name.toLowerCase().includes(name)) &&
    (type === "" || item.type === type) &&
    (color === "" || item.colorName.includes(color))
  );
  displayClothes(filtered);
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

displayClothes(wardrobe);