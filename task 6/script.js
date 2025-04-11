const taskListElement = document.getElementById('taskList');
const input = document.getElementById('taskInput');

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
    const li = document.createElement('li');
    li.className = `flex justify-between items-center px-4 py-2 rounded-lg shadow-sm bg-white/60 backdrop-blur-sm ${task.completed ? 'bg-pink-200' : ''}`;

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = `flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`;

    const controls = document.createElement('div');
    controls.className = "flex items-center gap-2";

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "w-4 h-4 accent-purple-600 cursor-pointer";
    checkbox.onchange = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = "❌";
    delBtn.className = "text-red-500 hover:text-red-700 text-sm no-underline";
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    };

    controls.appendChild(checkbox);
    controls.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(controls);
    taskListElement.appendChild(li);
  });
}

function addTask() {
  const taskText = input.value.trim();
  if (taskText !== "") {
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);
    renderTasks();
    input.value = "";
  } else {
    alert("Please enter a task!");
  }
}

// Initialize on load
renderTasks();
