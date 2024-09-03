import './activity.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
        <h1>To-Do List</h1>
        <form id="task-form">
            <input type="text" id="task-input" placeholder="Enter a new task" required>
            <button type="submit" id="add-task">Add Task</button>
        </form>
        <ul id="task-list"></ul>
        <div id="task-stats"></div>
    </div>
`

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input') as HTMLInputElement;
  const taskList = document.getElementById('task-list');
  const taskStats = document.getElementById('task-stats');
  const tasksLocalStorage = localStorage.getItem('tasks');
  let tasks = JSON.parse(tasksLocalStorage!) || [];

  function renderTasks() {
      taskList!.innerHTML = '';
      tasks.forEach((task: Record<string, string>, index: number) => {
          const li = document.createElement('li');
          li.className = `task-item ${task.completed ? 'completed' : ''}`;
          li.innerHTML = `
              <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
              <span class="task-text">${task.text}</span>
              <div class="task-actions">
                  <button class="edit-btn"><i class="fas fa-edit"></i></button>
                  <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
              </div>
          `;
          li.querySelector('.task-checkbox')!.addEventListener('change', () => toggleComplete(index));
          li.querySelector('.edit-btn')!.addEventListener('click', () => editTask(index));
          li.querySelector('.delete-btn')!.addEventListener('click', () => deleteTask(index));
          taskList!.appendChild(li);
      });
      updateStats();
      saveTasks();
  }

  function addTask(text: string) {
      tasks.push({ text, completed: false });
      renderTasks();
  }

  function toggleComplete(index: any) {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
  }

  function editTask(index: any) {
      const newText = prompt('Edit task:', tasks[index].text);
      if (newText !== null) {
          tasks[index].text = newText.trim();
          renderTasks();
      }
  }

  function deleteTask(index: any) {
      tasks.splice(index, 1);
      renderTasks();
  }

  function updateStats() {
      const total = tasks.length;
      const completed = tasks.filter((task: any) => task.completed).length;
      taskStats!.textContent = `Total tasks: ${total} | Completed: ${completed} | Remaining: ${total - completed}`;
      
  }

  function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  taskForm!.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (text) {
          addTask(text);
          taskInput!.value = '';
      }
  });

  renderTasks();
});