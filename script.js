// Get DOM Elements
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');

// Track Edit Mode
let isEditMode = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', displayItems);
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);

// Display items from localStorage on page load
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));
  checkUI();
}

// Handle form submission
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for duplicates
  if (!isEditMode && checkIfItemExists(newItem)) {
    alert('That item already exists');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
    isEditMode = false;
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();

  // Reset form
  itemInput.value = '';
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
}

// Add item to DOM
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

// Create button with icon
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-xmark';
  button.appendChild(icon);

  return button;
}

// Add item to localStorage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Get items from localStorage
function getItemsFromStorage() {
  return localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
}

// Remove item from localStorage
function removeItemFromStorage(itemText) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter(i => i !== itemText);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Handle item click for edit and delete
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

// Remove item from DOM and storage
function removeItem(item) {
  if (confirm('Are you sure?')) {
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

// Set item to edit mode
function setItemToEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll('li').forEach(li => li.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

// Clear all items
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem('items');
  checkUI();
}

// Filter items
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('#item-list li').forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.includes(text) ? 'flex' : 'none';
  });
}

// Check UI state and update elements
function checkUI() {
  itemInput.value = '';
  const items = document.querySelectorAll('#item-list li');
  itemFilter.style.display = items.length > 0 ? 'block' : 'none';
  clearBtn.style.display = items.length > 0 ? 'block' : 'none';
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Check if an item already exists
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}
