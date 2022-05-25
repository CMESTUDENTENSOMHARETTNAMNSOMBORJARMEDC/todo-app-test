const listHead = document.querySelector("ul");
const createButton = document.querySelector(".cbutton");
const form = document.querySelector("form");
const text = document.querySelector(".textBox");
const errorLine = document.querySelector(".error");
let lastResponse = 0; //time when last response message event was started

const getTodos = async (num, page) => {
  const url = "http://0.0.0.0:5001/todos";
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    const todoList = data.map((todo) => createTodoElement(todo));
    todoList.forEach((e) => listHead.append(e.item));
  } catch (error) {
    console.log(error);
    printStatus(error);
  }
};

const createNewTodo = async (todoText) => {
  printStatus("");
  const url = `http://0.0.0.0:5001/todos`;
  const payload = JSON.stringify({ text: todoText });
  let resToPrint = {};
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
    const data = await response.json();
    console.log(data);
    resToPrint = { ok: response.ok, status: response.status, msg: data };
    if (!response.ok) throw "error";
    const todo = createTodoElement(data);
    listHead.append(todo.item);
  } catch (error) {
    console.log(error);
    // resToPrint ={ok: false, status: 'unknown', msg: 'unknown'}
  } finally {
    printStatus(resToPrint);
  }
};

const removeTodo = async (id) => {
  printStatus("");
  const url = `http://0.0.0.0:5001/todos/${id}`;
  let resToPrint = {};
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    console.log(response);
    resToPrint = { ok: response.ok, status: response.status, msg: "deleted" };
    if (!response.ok) throw "error";
    const item = document.getElementById(id);
    item.remove();
  } catch (error) {
    resToPrint.msg = "not deleted";
    console.log(e);
  } finally {
    printStatus(resToPrint);
  }
  return;
};

const toggleTodo = async (id, element, setText) => {
  printStatus("");
  const url = `http://0.0.0.0:5001/todos/${id}`;
  const payload = JSON.stringify({ done: element.checked });
  let resToPrint = {};
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
    const data = await response.json();
    resToPrint = { ok: response.ok, status: response.status, msg: data };
    if (!response.ok) throw "error";
    setText();
  } catch (error) {
    console.log(e);
    element.checked = !element.checked;
  } finally {
    printStatus(resToPrint);
  }
  return;
};

const printStatus = (res) => {
  console.log(res);
  errorLine.classList.remove("green");
  errorLine.classList.remove("red");
  errorLine.classList.add(res.ok ? "green" : "red");
  if (res !== "") {
    errorLine.textContent = res.status + ": " + res.msg;
    startClearTimer();
  } else {
    errorLine.textContent = "";
  }
};

const startClearTimer = () => {
  const initTime = new Date().getMilliseconds();
  lastResponse = initTime;
  window.setTimeout(() => {
    if (initTime === lastResponse) errorLine.textContent = "";
  }, 3000);
};

const createTodoElement = ({ id, text, done }) => {
  const listItem = document.createElement("li");
  listItem.classList.add("todoContainer");

  const taskText = document.createElement("p");
  taskText.textContent = text;
  taskText.classList.add("textBox");
  taskText.classList.add(done ? "completedTodoText" : "todoText");

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.checked = done;
  toggle.addEventListener("change", () => {
    toggleTodo(id, toggle, () =>
      taskText.classList.toggle("completedTodoText")
    );
  });

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "remove";
  removeButton.classList.add("button");
  removeButton.addEventListener("click", () => {
    removeTodo(id);
  });

  listItem.append(toggle);
  listItem.append(taskText);
  listItem.append(removeButton);
  listItem.setAttribute("id", id);
  return { id: id, item: listItem };
};

text.addEventListener("change", () => {
  console.log("change");
});

// createButton.addEventListener('click', () => {
//   const todoText = text.value;
// 	 createNewTodo(todoText);
// })

form.addEventListener("submit", (event) => {
  const todoText = text.value;
  createNewTodo(todoText);
});

getTodos();
