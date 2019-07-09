class Render {
    constructor(
      taskContainer,
      errorContainer,
      deleteTaskFunction,
      toggleTaskFunction
    ) {
      this._taskContainer = taskContainer;
      this._errorContainer = errorContainer;
  
      this._deleteTaskFunction = deleteTaskFunction;
      this._toggleTaskFunction = toggleTaskFunction;
    }
  
    renderTask(task) {
  
    }
  
    updateTask(task) {
  
    }
  
    destroyTask(id) {
    }
  
    displayError(error) {
  
    }
  
    dispose() {
  
    }
  }
  
  class Store {
    constructor() {
      this._storage = [];
    }
  
    saveTask(task) {
      return new Promise((resolve) => {
        this._storage.push(task);
        resolve(task);
      });
    }
  
    deleteTask(id) {
      return new Promise((resolve, reject) => {
        const task = this._storage.find((task) => task.id === id);
        if (!task) {
          reject(new Error(`task with id = ${id} does not exists`));
        }
        this._storage = this._storage.filter(task => task.id === id);
        resolve({});
      });
    }
  
    async updateTask(updatedTask) {
      return new Promise((resolve, reject) => {
        const task = this._storage.find((task) => task.id === updatedTask.id);
        if (!task) {
          reject(new Error(`task with id = ${updatedTask.id} does not exists`));
        }
        await this.deleteTask(task.id);
        const savedUpdatedTask = await this.saveTask(updatedTask);
        resolve(savedUpdatedTask);
      });
    }
  
    getTask(id) {
  
    }
  
    getTasks() {
  
    }
  }
  
  class StoreLS {
    constructor() { }
  
    saveTask(task) {
      return new Promise((resolve) => {
        const json = JSON.stringify(task);
        localStorage.setItem(task.id, json)
        resolve(task);
      });
    }
  
    deleteTask(id) {
      return new Promise((resolve, reject) => {
        const task = localStorage.getItem(id);
        if (!task) {
          reject(new Error(`task with id = ${id} does not exists`));
        }
        localStorage.removeItem(id);
        resolve({});
      });
    }
  
    updateTask(task) {
  
    }
  
    getTask(id) {
  
    }
  
    getTasks() {
    }
  }
  
  class StoreJS {
    constructor() {
      this._url = '';
    }
  
    async saveTask(task) {
      return new Promise((resolve, reject) => {
        const json = JSON.stringify(task);
        try {
          const response = await fetch(this._url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: json
          });
          const taskFromServer = await response.json();
          resolve(taskFromServer);
        } catch (error) {
          reject(error);
        }
      });
    }
  
    deleteTask(id) {
      return new Promise((resolve, reject) => {
        try {
          const response = await fetch(`${this._url}/${id}`, {
            method: "DELETE"
          });
          const taskFromServer = await response.json();
          resolve(taskFromServer);
        } catch (error) {
          reject(error);
        }
      })
    }
  
    updateTask(task) {
  
    }
  
    getTask(id) {
  
    }
  
    getTasks() {
  
    }
  }
  
  class Task {
    constructor(id, title, isDone = false) {
      this._id = id;
      this._title = title;
      this._isDone = isDone;
    }
  
    get title() {
      return this._title;
    }
  
    get isDone() {
      return this._isDone;
    }
  
    toggle() {
      this._isDone = !this._isDone;
    }
  }
  
  class TaskManager {
    constructor(store) {
      this._store = store;
      this._getUniqueId = () => {
        const uniqueId = Math.random().toString(36).substr(2, 16);
        return uniqueId;
      }
    }
  
    createTask(title) {
      const id = this._getUniqueId();
      const task = new Task(id, title);
      const savedTaskPromise = this._store.saveTask(task);
      return savedTaskPromise;
    }
  
    removeTask(id) {
      const deletePromise = this._store.deleteTask(id);
      return deletePromise;
    }
  
    async toggleTask(id) {
      const task = await this._store.getTask(id);
      task.toggle();
      const taskPromise = this._store.updateTask(task);
      return taskPromise;
    }
  }
  
  class TODO {
    constructor(taskManager, render) {
      this._taskManager = taskManager;
      this._render = render;
    }
  
    addTask(title) {
      this._taskManager.createTask(title)
        .then(task => {
          this._render.renderTask(task);
        })
        .catch(error => {
          this._render.displayError(error);
        });
    }
  
    deleteTask(id) {
      this._taskManager.removeTask(id)
        .then(() => {
          this._render.destroyTask(id);
        })
        .catch(error => {
          this._render.displayError(error);
        });
    }
  
    toggleTask(id) {
      this._taskManager.toggleTask(id)
        .then(task => {
          this._render.updateTask(task);
        })
        .catch(error => {
          this._render.displayError(error);
        });
    }
  
    destroy() {
      this._render.dispose();
    }
  }
  
  class TODOApp {
    constructor() { }
  
    execute() {
      const store = new Store();
      const taskManager = new TaskManager(store);
  
      const taskContainerRef;
      const errorContainerRef;
  
      let deleteTaskFunctionStub = () => {
        throw new Error('not implemented')
      };
  
      let toggleTaskFunctionStub = () => {
        throw new Error('not implemented')
      };
  
      const render = new Render(
        taskContainerRef,
        errorContainerRef,
        deleteTaskFunctionStub,
        toggleTaskFunctionStub
      );
  
      this._todo = new TODO(taskManager, render);
  
      deleteTaskFunctionStub = this._todo.deleteTask.bind(this._todo);
      toggleTaskFunctionStub = this._todo.toggleTask.bind(this._todo);
  
      this._addTaskButtonRef;
      this._titleInputRef;
  
      const addTaskButtonOnClick = function () {
        const title = this._titleInputRef.value;
        todo.addTask(title);
      };
  
      this._addTaskButtonOnClickBind = addTaskButtonOnClick.bind(this);
  
      this._addTaskButtonRef.addEventListener('click', this._addTaskButtonOnClickBind);
    }
  
    destroy() {
      this._addTaskButtonRef.removeEventListener('click', this._addTaskButtonOnClickBind);
      this._todo.destroy();
    }
  }
  
  const app = new TODOApp();
  app.execute();