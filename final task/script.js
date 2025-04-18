const taskListElement = document.getElementById('taskList');
const input = document.getElementById('taskInput');
const filterButtons = document.querySelectorAll('[data-filter]');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');

const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
let editIndex = null;
let recentlyEditedIndex = null;
let currentFilter = 'all';

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = getTasks();
  taskListElement.innerHTML = '';

  tasks.forEach((task, index) => {
    if (currentFilter === 'completed' && !task.completed) return;
    if (currentFilter === 'pending' && task.completed) return;

    const li = document.createElement('li');
    li.className = `task-appear flex justify-between items-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 bg-white/70 backdrop-blur-sm ${
        task.completed ? 'bg-purple-200/80 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm hover:bg-white/80'
    }`;

    if (index === recentlyEditedIndex) {
      li.classList.add('task-glow');
    }

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = `flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`;

    const controls = document.createElement('div');
    controls.className = 'flex items-center gap-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'w-5 h-5 accent-indigo-600 cursor-pointer transition-all duration-200';
    checkbox.onchange = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.title = 'Edit Task';
    editBtn.className = 'text-blue-500 hover:text-blue-700 text-sm transition-all duration-200';
    editBtn.onclick = () => {
      editIndex = index;
      editInput.value = task.text;
      editModal.classList.remove('hidden');
      setTimeout(() => editInput.focus(), 50);
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.title = 'Delete Task';
    delBtn.className = 'text-red-500 hover:text-red-700 text-sm transition-all duration-200';
    delBtn.onclick = () => {
      li.classList.add('task-disappear');
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      }, 300);
    };

    controls.appendChild(checkbox);
    controls.appendChild(editBtn);
    controls.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(controls);
    taskListElement.appendChild(li);
  });

  recentlyEditedIndex = null;
}

function addTask() {
  const taskText = input.value.trim();
  if (taskText !== '') {
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);
    renderTasks();
    input.value = '';
  } else {
    alert('Please enter a task!');
  }
}

function saveEdit() {
  const newText = editInput.value.trim();
  if (newText && editIndex !== null) {
    const tasks = getTasks();
    tasks[editIndex].text = newText;
    recentlyEditedIndex = editIndex;
    saveTasks(tasks);
    renderTasks();
    closeModal();
  }
}

function closeModal() {
  editModal.classList.add('hidden');
  editIndex = null;
}

function clearCompletedTasks() {
  const tasks = getTasks().filter(task => !task.completed);
  saveTasks(tasks);
  renderTasks();
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove('bg-indigo-600', 'text-white'));
    button.classList.add('bg-indigo-600', 'text-white');
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

renderTasks();
