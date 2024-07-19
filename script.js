const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Function to fetch todos from the JSON file and display them
function fetchTodos() {
  fetch("http://localhost:3000/todos") // Adjust the URL if necessary
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched data:", data); // Debugging: Check the fetched data
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
  listContainer.innerHTML = ""; // Clear existing todos
  todos.forEach((todo) => {
    if (todo && todo.id && todo.todo !== undefined) {
      const li = document.createElement("li");
      li.dataset.id = todo.id;
      // Ensure the 'completed' property is a boolean
      li.classList.toggle("checked", todo.completed);
      li.innerHTML = `
                <span>${todo.todo}</span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
      listContainer.appendChild(li);
    } else {
      console.error("Todo item is missing required properties:", todo);
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
    time: "",
    duration: "",
    completed: false,
  };

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then(() => {
      fetchTodos(); // Refresh the list of todos
      inputBox.value = ""; // Clear input box
    })
    .catch((error) => console.error("Error adding task:", error));
}

// Function to handle click events for editing, deleting, and marking tasks
listContainer.addEventListener("click", function (e) {
  const target = e.target;
  const li = target.closest("li");
  if (!li) return; // If no <li> found, exit

  const todoId = li.dataset.id;

  if (target.classList.contains("edit-btn")) {
    // Handle editing
    const newTodoText = prompt(
      "Edit your task:",
      li.querySelector("span").textContent
    );
    if (newTodoText) {
      fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: newTodoText }),
      })
        .then((response) => response.json())
        .then(() => fetchTodos()) // Refresh the list
        .catch((error) => console.error("Error updating task:", error));
    }
  } else if (target.classList.contains("delete-btn")) {
    // Handle deleting
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => fetchTodos()) // Refresh the list
      .catch((error) => console.error("Error deleting task:", error));
  } else if (target.tagName === "LI") {
    // Handle marking as completed
    const isChecked = !li.classList.contains("checked");
    li.classList.toggle("checked", isChecked);
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: isChecked }),
    })
      .then((response) => response.json())
      .then(() => fetchTodos()) // Refresh the list
      .catch((error) => console.error("Error toggling task status:", error));
  }
});

// Fetch todos when the page loads
document.addEventListener("DOMContentLoaded", fetchTodos);
