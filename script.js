const categoryLabels = {
  tshirt: "T-shirt",
  shirt: "Shirt",
  pants: "Pants",
  sweatpants: "Sweatpants",
  jacket: "Jacket",
  shorts: "Shorts",
  hoodies: "Hoodies",
  vests: "Vests",
  hats: "Hats",
  shoes: "Shoes",
  sandals: "Sandals",
  accessories: "Accessories",
  other: "Other"
};

let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];
let editingIndex = null;
let isGridView = false;

function saveWardrobe() { localStorage.setItem("wardrobe", JSON.stringify(wardrobe)); updateStats(); }

function addItem() {
  let name = document.getElementById("itemName").value.trim();
  let type = document.getElementById("itemType").value;
  let colorHex = document.getElementById("itemColorHex").value.trim();
  let colorName = document.getElementById("itemColorName").value.trim().toLowerCase();
  let imageFile = document.getElementById("itemImage").files[0];
  if(!name||!colorName){alert("Enter both name and color name!"); return;}

  if(imageFile){
    let reader = new FileReader();
    reader.onload = e => saveItem({name,type,colorHex,colorName,imgData:e.target.result});
    reader.readAsDataURL(imageFile);
  } else saveItem({name,type,colorHex,colorName,imgData:null});
}

function saveItem(item){ item.favorite=false; wardrobe.push(item); saveWardrobe(); displayClothes(wardrobe); clearInputs(); }

function displayClothes(items){
  let list=document.getElementById("clothesList");
  list.innerHTML="";
  let categories={};
  items.forEach((item,index)=>{ if(!categories[item.type]) categories[item.type]=[]; categories[item.type].push({...item,index}); });

  for(let type in categories){
    let categoryDiv=document.createElement("div");
    categoryDiv.innerHTML=`<h3>${categoryLabels[type]||type}</h3>`;
    categories[type].forEach(item=>{
      let div=document.createElement("div");
      div.className="item";
      div.innerHTML=`
        <div>${item.name} (${item.colorName}) 
          <span class="color-box" style="background:${item.colorHex};"></span>
          ${item.imgData?`<img src="${item.imgData}" alt="${item.name}">`:''}
        </div>
        <div>
          <button class="favorite-btn" onclick="toggleFavorite(${item.index})">${item.favorite?"⭐":"☆"}</button>
          <button class="edit-btn" onclick="openEdit(${item.index})">✏️</button>
          <button class="delete-btn" onclick="deleteItem(${item.index})">❌</button>
        </div>
      `;
      categoryDiv.appendChild(div);
    });
    list.appendChild(categoryDiv);
  }
}

function deleteItem(index){ wardrobe.splice(index,1); saveWardrobe(); displayClothes(wardrobe); }
function toggleFavorite(index){ wardrobe[index].favorite=!wardrobe[index].favorite; saveWardrobe(); displayClothes(wardrobe); }

function openEdit(index){
  editingIndex=index;
  let item=wardrobe[index];
  document.getElementById("editName").value=item.name;
  document.getElementById("editType").value=item.type;
  document.getElementById("editColorHex").value=item.colorHex;
  document.getElementById("editColorName").value=item.colorName;
  document.getElementById("editImage").value="";
  document.getElementById("editModal").style.display="block";
}

function saveEdit(){
  let newName=document.getElementById("editName").value.trim();
  let newType=document.getElementById("editType").value;
  let newHex=document.getElementById("editColorHex").value.trim();
  let newColorName=document.getElementById("editColorName").value.trim().toLowerCase();
  let imageFile=document.getElementById("editImage").files[0];
  if(!newName||!newColorName){alert("Enter both name and color name!"); return;}

  function updateItem(imgData=null){
    let item=wardrobe[editingIndex];
    item.name=newName;
    item.type=newType;
    item.colorHex=newHex;
    item.colorName=newColorName;
    if(imgData!==null) item.imgData=imgData;
    saveWardrobe(); displayClothes(wardrobe); closeModal();
  }

  if(imageFile){
    let reader=new FileReader();
    reader.onload=e=>updateItem(e.target.result);
    reader.readAsDataURL(imageFile);
  } else updateItem();
}

function closeModal(){ document.getElementById("editModal").style.display="none"; editingIndex=null; }

function searchByColor(){
  let color=document.getElementById("searchColor").value.trim().toLowerCase();
  let filtered=wardrobe.filter(item=>item.colorName.includes(color));
  applyFilters(filtered);
}

function showAll(){ document.getElementById("searchColor").value=""; applyFilters(); }
function showFavorites(){ applyFilters(wardrobe.filter(item=>item.favorite)); }

function applyFilters(filteredItems=null){
  let type=document.getElementById("filterType").value;
  let items=filteredItems||wardrobe;
  if(type!=="all") items=items.filter(item=>item.type===type);
  displayClothes(items);
}

function clearInputs(){
  document.getElementById("itemName").value="";
  document.getElementById("itemColorHex").value="#000000";
  document.getElementById("itemColorName").value="";
  document.getElementById("itemImage").value="";
}

function updateStats(){
  document.getElementById("totalItems").innerText=`Total Items: ${wardrobe.length}`;
  let typesCount={};
  wardrobe.forEach(item=>typesCount[item.type]=(typesCount[item.type]||0)+1);
  document.getElementById("itemsByType").innerText=
    `Items by Type: ${Object.keys(typesCount).map(t=>`${categoryLabels[t]||t}:${typesCount[t]}`).join(", ")}`;
  let colorCount={};
  wardrobe.forEach(item=>colorCount[item.colorName]=(colorCount[item.colorName]||0)+1);
  let mostCommon=Object.keys(colorCount).reduce((a,b)=>colorCount[a]>colorCount[b]?a:b,"N/A");
  document.getElementById("mostCommonColor").innerText=`Most Common Color: ${mostCommon}`;
}

function toggleView(){
  const results=document.getElementById("results");
  isGridView=!isGridView;
  const button=event.currentTarget;
  if(isGridView){ results.classList.add("grid-view"); button.innerText="Switch to List View"; }
  else { results.classList.remove("grid-view"); button.innerText="Switch to Grid View"; }
}

window.addEventListener("resize", ()=>{
  if(isGridView) document.getElementById("results").classList.add("grid-view");
  else document.getElementById("results").classList.remove("grid-view");
});

function toggleDarkMode(){ document.body.classList.toggle("dark-mode"); }

window.onload=()=>{ displayClothes(wardrobe);