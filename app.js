const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const search = document.querySelector(".search input");

// Function to generate a todo template
const generateTemplate = (todo, completed = false) => {
  const html = `
        <li class="list-group-item d-flex justify-content-between align-items-center ${completed ? 'completed' : ''}">
        <span>${todo}</span>
        <div>
          <i class="far fa-check-circle complete" aria-label="Mark as completed"></i>
          <i class="far fa-edit edit" aria-label="Edit todo"></i>
          <i class="far fa-trash-alt delete" aria-label="Delete todo"></i>
        </div>
        </li>
        `;
  list.innerHTML += html;
};

// Load todos from local storage
const loadTodos = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => generateTemplate(todo.text, todo.completed));
};

// Save todos to local storage
const saveTodos = () => {
  const todos = Array.from(list.children).map(todo => ({
    text: todo.querySelector('span').textContent.trim(),
    completed: todo.classList.contains('completed')
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
};

// Show notification
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`; // Use the type to set the class
  notification.innerText = message;
  document.body.prepend(notification);
  setTimeout(() => notification.remove(), 2000);
};





// Add new todos
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = addForm.add.value.trim();

  if (todo.length) {
    const confirmation = confirm(`Are you sure you want to add "${todo}"?`);
    if (confirmation) {
      generateTemplate(todo);
      saveTodos();
      showNotification(`Added: "${todo}"`, 'success');
      addForm.reset();
    }
  }
});

// Delete todos
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const todoText = e.target.parentElement.parentElement.querySelector('span').textContent;
    e.target.parentElement.parentElement.remove();
    saveTodos(); // Update local storage after deletion
    showNotification(`Deleted: "${todoText}"`, 'danger'); // Pass 'danger' for red alert
  }
});


// Complete todos
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("complete")) {
    const li = e.target.closest('li');
    li.classList.toggle('completed');
    saveTodos(); // Update local storage after completion toggle
    showNotification(`Marked as ${li.classList.contains('completed') ? 'completed' : 'not completed'}`,'success');
  }
});

// Edit todos
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const li = e.target.closest('li');
    const span = li.querySelector('span');
    const currentText = span.textContent.trim();
    const newText = prompt("Edit todo:", currentText);
    if (newText !== null && newText.trim().length) {
      span.textContent = newText.trim();
      saveTodos(); // Update local storage after editing
      showNotification(`Edited: "${currentText}" to "${newText}"`,'success');
    }
  }
});

// Filter todos
const filterTodos = (term) => {
  Array.from(list.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.add("filtered"));

  Array.from(list.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.remove("filtered"));
};

// Keyup event for searching
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});

// Load todos when the page is loaded
document.addEventListener("DOMContentLoaded", loadTodos);