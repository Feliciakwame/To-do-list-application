const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Function to fetch todos from the JSON file and display them
function fetchTodos() {
  fetch("https://codingbackend-2.vercel.app/todos")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched data:", data);
      if (Array.isArray(data)) {
        displayTodos(data);
      } else if (Array.isArray(data.todos)) {
        displayTodos(data.todos);
      } else {
        console.error("Data format is incorrect:", data);
      }
    })
    .catch((error) => console.error("Error fetching todos:", error));
}

// Function to display todos on the page
function displayTodos(todos) {
  listContainer.innerHTML = "";
  todos.forEach((todo) => {
    if (todo && todo.id && todo.todo !== undefined) {
      const li = document.createElement("li");
      li.dataset.id = todo.id;
      li.classList.toggle("checked", todo.completed);
      li.innerHTML = `
                <span>${todo.todo}</span>
                <div class="style-btn">
                    <button class="mark-as-done">Completed</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
      listContainer.appendChild(li);
    } else {
      console.error("Todo item is missing some properties:", todo);
    }
  });
}

// Function to add a new task
function addTask() {
  if (inputBox.value === "") {
    alert("Please enter a task");
    return;
  }

  const newTodo = {
    todo: inputBox.value,
    completed: false,
  };

  fetch("https://codingbackend-2.vercel.app/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then(() => {
      fetchTodos();
      inputBox.value = "";
    })
    .catch((error) => console.error("Error adding task:", error));
}

// Function to handle marking a task as done/undone
function markAsDone(todoId, li) {
  const isChecked = !li.classList.contains("checked");
  li.classList.toggle("checked", isChecked);
  fetch(`https://codingbackend-2.vercel.app/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: isChecked }),
  })
    .then((response) => response.json())
    .then(() => fetchTodos())
    .catch((error) => console.error("Error marking tasks:", error));
}

// Function to handle deleting a task
function handleDelete(todoId) {
  if (confirm("Are you sure you want to delete this task?")) {
    fetch(`https://codingbackend-2.vercel.app/todos/${todoId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return;
          response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then(() => fetchTodos())
      .catch((error) => console.error("Error deleting task", error));
  }
}

// Event listener for clicks on the list container
listContainer.addEventListener("click", function (e) {
  const target = e.target;
  const li = target.closest("li");
  if (!li) return;

  const todoId = li.dataset.id;

  if (target.classList.contains("mark-as-done")) {
    markAsDone(todoId, li);
  } else if (target.classList.contains("delete-btn")) {
    handleDelete(todoId);
  }
});

document.addEventListener("DOMContentLoaded", fetchTodos);
