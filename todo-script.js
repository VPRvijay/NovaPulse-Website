// To-Do List Application with Local Storage

const STORAGE_KEY = 'novapulse_todos';
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearBtn = document.getElementById('clearBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  renderTodos();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  addBtn.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  clearBtn.addEventListener('click', clearCompletedTodos);
  deleteAllBtn.addEventListener('click', deleteAllTodos);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });
}

// Add a new to-do
function addTodo() {
  const text = todoInput.value.trim();

  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toLocaleString()
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

// Toggle todo completion
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

// Delete a specific todo
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

// Clear all completed todos
function clearCompletedTodos() {
  if (todos.some(t => t.completed)) {
    if (confirm('Delete all completed tasks?')) {
      todos = todos.filter(t => !t.completed);
      saveTodos();
      renderTodos();
    }
  } else {
    alert('No completed tasks to clear!');
  }
}

// Delete all todos
function deleteAllTodos() {
  if (todos.length > 0) {
    if (confirm('Delete all tasks? This cannot be undone!')) {
      todos = [];
      saveTodos();
      renderTodos();
    }
  } else {
    alert('No tasks to delete!');
  }
}

// Render todos based on filter
function renderTodos() {
  todoList.innerHTML = '';

  let filteredTodos = todos;

  if (currentFilter === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <p>📭 No tasks ${currentFilter !== 'all' ? `(${currentFilter})` : 'yet'}</p>
        <p style="font-size: 0.9em; color: #666;">Add a new task to get started!</p>
      </div>
    `;
  } else {
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input 
          type="checkbox" 
          class="checkbox" 
          ${todo.completed ? 'checked' : ''}
          onchange="toggleTodo(${todo.id})"
        >
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
      `;
      todoList.appendChild(li);
    });
  }

  updateStats();
}

// Update statistics
function updateStats() {
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;

  totalTasksSpan.textContent = `Total: ${total}`;
  completedTasksSpan.textContent = `Completed: ${completed}`;
}

// Save todos to local storage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Load todos from local storage
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  todos = stored ? JSON.parse(stored) : [];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export todos as JSON (for backup)
function exportTodos() {
  const dataStr = JSON.stringify(todos, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

// Import todos from JSON
function importTodos(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        todos = imported;
        saveTodos();
        renderTodos();
        alert('Todos imported successfully!');
      } else {
        alert('Invalid file format!');
      }
    } catch (error) {
      alert('Error reading file: ' + error.message);
    }
  };
  reader.readAsText(file);
}
