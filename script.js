const correctPassword = 'w';

// Function to load the bucket list from localStorage
function loadBucketList() {
    const bucketList = JSON.parse(localStorage.getItem('bucketList')) || [];
    const completedList = JSON.parse(localStorage.getItem('completedList')) || [];

    // Clear existing list items to avoid duplication
    document.getElementById('bucket-list').innerHTML = '';
    document.getElementById('completed-list').innerHTML = '';

    bucketList.forEach(item => {
        addItemToDOM(item, false);
    });

    completedList.forEach(item => {
        addItemToDOM(item, true);
    });
}

function checkPassword() {
    const inputPassword = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');

    if (inputPassword === correctPassword) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('bucketlist-section').style.display = 'block';
        loadBucketList(); // Load items on successful login
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
    }
}

function addItem() {
    const newItem = document.getElementById('new-item').value.trim(); // Trim whitespace
    if (newItem) {
        addItemToDOM(newItem, false);
        saveItemToLocalStorage(newItem, false);
        document.getElementById('new-item').value = '';
    }
}

function addItemToDOM(item, completed) {
    const list = completed ? document.getElementById('completed-list') : document.getElementById('bucket-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${item}
        ${completed ? '' : '<button class="completed-button" onclick="markAsCompleted(this)">Completed</button>'}
        <button class="delete-button" onclick="deleteItem(this)">Delete</button>
    `;
    if (completed) {
        listItem.classList.add('completed');
    }
    list.appendChild(listItem);
}

function markAsCompleted(button) {
    const listItem = button.parentElement;
    const itemText = listItem.childNodes[0].textContent.trim(); // Trim whitespace

    // Move item to completed list
    listItem.classList.add('completed');
    button.remove(); // Remove the "Completed" button once it's clicked

    const completedList = document.getElementById('completed-list');
    completedList.appendChild(listItem);

    // Update localStorage
    removeItemFromLocalStorage(itemText, false);
    saveItemToLocalStorage(itemText, true);
}

function deleteItem(button) {
    const listItem = button.parentElement;
    const itemText = listItem.childNodes[0].textContent.trim(); // Trim whitespace
    const isCompleted = listItem.classList.contains('completed'); // Check if the item is completed

    // Remove from localStorage
    removeItemFromLocalStorage(itemText, isCompleted);

    // Remove the item from the DOM
    listItem.remove();
}

function saveItemToLocalStorage(item, completed) {
    const key = completed ? 'completedList' : 'bucketList';
    const list = JSON.parse(localStorage.getItem(key)) || [];

    // Check if the item already exists to prevent duplicates
    if (!list.includes(item)) {
        list.push(item);
        localStorage.setItem(key, JSON.stringify(list));
    }
}

function removeItemFromLocalStorage(item, completed) {
    const key = completed ? 'completedList' : 'bucketList';
    const list = JSON.parse(localStorage.getItem(key)) || [];

    // Filter out the item to be removed
    const updatedList = list.filter(i => i !== item);
    localStorage.setItem(key, JSON.stringify(updatedList));
}

// Function to reset the bucket list
function resetBucketList() {
    const confirmation = confirm("Are you sure you want to reset your bucket list? This action cannot be undone.");
    if (confirmation) {
        // Clear localStorage
        localStorage.removeItem('bucketList');
        localStorage.removeItem('completedList');
        
        // Clear the UI
        document.getElementById('bucket-list').innerHTML = '';
        document.getElementById('completed-list').innerHTML = '';
    }
}

// Load the bucket list when the page is loaded
window.onload = loadBucketList;
