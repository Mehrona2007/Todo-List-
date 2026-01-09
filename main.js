const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const stats = document.getElementById("stats");
const filterBox = document.getElementById("filter");
const empty = document.getElementById("empty");
const clearCompleted = document.getElementById("clearCompleted");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function render() {
  list.innerHTML = "";

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filteredTodos.forEach(todo => {
    const item = document.createElement("div");
    item.className =
      "flex gap-3 justify-between items-center bg-slate-800 px-4 py-3 rounded-xl";

    const text = document.createElement("span");
    text.textContent = todo.text;
    text.className = todo.completed
      ? "line-through text-slate-500 cursor-pointer"
      : "cursor-pointer";
    text.onclick = () => toggleTodo(todo.id);

    const del = document.createElement("button");
    del.textContent = "✕";
    del.className = "text-red-400 hover:text-red-500";
    del.onclick = () => deleteTodo(todo.id);

    item.append(text, del);
    list.appendChild(item);
  });

  stats.classList.toggle("hidden", todos.length === 0);
  filterBox.classList.toggle("hidden", todos.length === 0);
  empty.classList.toggle("hidden", filteredTodos.length !== 0);

  stats.textContent =
    `Total: ${todos.length} | Completed: ${todos.filter(t => t.completed).length}`;
}

function addTodo() {
  if (!input.value.trim()) return;

  todos.push({
    id: Date.now(),
    text: input.value,
    completed: false,
  });

  input.value = "";
  save();
  render();
}

function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  );
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  save();
  render();
}

addBtn.onclick = addTodo;

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("[data-filter]").forEach(b =>
      b.classList.remove("bg-primary")
    );
    btn.classList.add("bg-primary");
    filter = btn.dataset.filter;
    render();
  };
});

clearCompleted.onclick = () => {
  todos = todos.filter(todo => !todo.completed);
  save();
  render();
};

render();
