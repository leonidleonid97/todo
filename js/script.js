'use strict';

const form = document.querySelector('.form'),
      formInput = form.querySelector('.form__inp'),
      taskList = document.querySelector('.task-list');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = (JSON.parse(localStorage.getItem('tasks')));
}

tasks.forEach(task => {
  renderTask(task);
  numberOfTasks();
});

checkTaskList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', completeTask);

function checkTaskList() {

  if (tasks.length === 0) {

    const taskWrapper = document.querySelector('.tasks-wrapper');
    const emptyHeader = `
      <div class="tasks-empty">Task list is empty</div>
    `;
    taskWrapper.insertAdjacentHTML('afterbegin', emptyHeader);
  }

  if (tasks.length > 0) {

    const emptyHeader = document.querySelector('.tasks-empty');
    emptyHeader ? emptyHeader.remove() : null;
  }
}

function addTask(e) {
  e.preventDefault();

  const taskDescr = formInput.value;
  if (taskDescr !== '') {

    const newTask = {
      id: Date.now(),
      descr: taskDescr,
      status: false
    };
  
    tasks.push(newTask);
    saveLocalStorage();
    
    renderTask(newTask);
    
    formInput.value = '';
    formInput.focus();
  
    checkTaskList();

    numberOfTasks();

  }
}

function deleteTask(e) {

  if (e.target.classList.contains('btn_del')) {
    const parent = e.target.closest('li');
    const id = +parent.id;

    tasks = tasks.filter(task => task.id !== id);
    saveLocalStorage();

    parent.remove();
  }
  numberOfTasks();
  checkTaskList();
}

function completeTask(e) {

  if (e.target.classList.contains('btn_done')) {
    const parent = e.target.closest('li');
    const id = +parent.id;
    const task = tasks.find(task => task.id === id);
    task.status = !task.status;
    saveLocalStorage();
    numberOfTasks();

    const title = parent.querySelector('.task-list__title');
    title.classList.toggle('task-list__title_done');
    const btn = parent.querySelector('.btn_done');
    btn.classList.toggle('btn_done-true');
  }
}

function renderTask(task) {
  const classTaskTitle = task.status ? 'task-list__title task-list__title_done' : 'task-list__title';
  const classBtnDone = task.status ? 'btn_done btn_done-true' : 'btn_done';

  taskList.innerHTML += `
    <li id="${task.id}" class="task-list__item">
      <div class="task-list__left">
        <button class="${classBtnDone}"></button>
        <span class="${classTaskTitle}">${task.descr}</span>
      </div>
      <button class="btn btn_del">Delete</button>
    </li>
  `;
}

function saveLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function numberOfTasks() {

  const div = document.querySelector('.tasks-num');
  
  if (tasks.length > 0) {
  div.style.display = 'flex';
  const newArr = tasks.filter(item => item.status);
  const numDone = newArr.length;
  const num = tasks.length;
  div.innerHTML = `<div class="number">Tasks: ${num}</div>
                   <div class="done">Done: ${numDone}</div>
  `;
  if (num <= 0) {
    div.innerHTML = '';
  }
} else {
  div.style.display = 'none';
}
}