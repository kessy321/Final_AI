// Beginner-friendly Todo app (HTML + CSS + JS only)

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');

/** @type {{ id: string, text: string, completed: boolean }[]} */
let todos = [];

function createId() {
    // Good enough for a small demo app; avoids collisions on quick adds.
    return `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function render() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    for (const todo of todos) {
        const li = document.createElement('li');
        li.className = `todo-item${todo.completed ? ' todo-item--completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
      <input
        class="todo-item__checkbox"
        type="checkbox"
        ${todo.completed ? 'checked' : ''}
        aria-label="Mark task as completed"
      />
      <span class="todo-item__text">${escapeHtml(todo.text)}</span>
      <button class="btn btn--danger todo-item__delete" type="button" aria-label="Delete task">
        Delete
      </button>
    `;

        todoList.appendChild(li);
    }
}

function escapeHtml(str) {
    // Prevents a user from injecting HTML into the task text.
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();
    if (!text) return;

    todos.unshift({
        id: createId(),
        text,
        completed: false,
    });

    todoInput.value = '';
    render();
    todoInput.focus();
});

// Event delegation: one listener handles check + delete for all items.
todoList.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;

    const id = li.dataset.id;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    if (e.target.closest('.todo-item__delete')) {
        todos = todos.filter((t) => t.id !== id);
        render();
    }
});

todoList.addEventListener('change', (e) => {
    const checkbox = e.target;
    if (!(checkbox instanceof HTMLInputElement)) return;
    if (checkbox.type !== 'checkbox') return;

    const li = checkbox.closest('.todo-item');
    if (!li) return;

    const id = li.dataset.id;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    todo.completed = checkbox.checked;
    render();
});

// Initial UI state
render();

