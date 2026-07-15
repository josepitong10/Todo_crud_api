// Get HTML elements from the page
const todoList = document.getElementById("todoList");   
const todoInput = document.getElementById("todoInput"); 
const addBtn = document.getElementById("addBtn");       

// Headers required for every request
const headers = {
  Authorization: TOKEN,
  "Content-Type": "application/json"
};

// GET ALL TODOS
// This function gets all todos
// from the API and displays them
async function getTodos() {

  try {

    // Send GET request
    const response = await fetch(BASE_URL + "/todos", {
      headers
    });

    console.log(response);

    // Convert JSON response into JavaScript object
    const todos = await response.json();

    console.log(todos);

    // Display todos on the page
    displayTodos(todos);

  } catch (error) {

    console.error(error);

  }
}

// Load todos immediately when the page opens
getTodos();


// DISPLAY TODOS
// Creates HTML for every todo
function displayTodos(todos) {

  // Remove old todos before displaying updated ones
  todoList.innerHTML = "";

  // Loop through every todo from the API
  todos.forEach(todo => {

    // Create a new div for one todo
    const todoItem = document.createElement("div");

    todoItem.className = "todo";

    // Add HTML inside the div
    todoItem.innerHTML = `
      <div>

        <input
          type="checkbox"
          ${todo.completed ? "checked" : ""}
        >

        <span class="${todo.completed ? "completed" : ""}">
          ${todo.title}
        </span>

      </div>

      <div class="option">

        <button class="editbtn">Edit</button>

        <button class="deletebtn">Delete</button>

      </div>
    `;

    // Checkbox Event
    // Update completed status
    const checkbox = todoItem.querySelector("input");

    checkbox.addEventListener("change", () => {

      updateTodo(todo.id, checkbox.checked);

    });

  
    // Delete Button Event
    const deleteButton = todoItem.querySelector(".deletebtn");

    deleteButton.addEventListener("click", () => {

      deleteTodo(todo.id);

    });

   
    // Edit Button Event
 
    const editButton = todoItem.querySelector(".editbtn");

    editButton.addEventListener("click", () => {

      editTodo(todo.id, todo.title);

    });

    // Add this todo to the page
    todoList.appendChild(todoItem);

  });

}

// ADD NEW TODO
// Sends POST request
async function addTodo() {

  // Get text from input field
  const title = todoInput.value.trim();

  // Prevent empty todo
  if (title === "") {

    alert("Please enter a todo.");

    return;

  }

  console.log(title);

  try {

    // Send POST request
    const response = await fetch(BASE_URL + "/todos", {

      method: "POST",

      headers,

      body: JSON.stringify({

        title: title

      })

    });

    // Check if request failed
    if (!response.ok) {

      throw new Error("Failed to create todo.");

    }

    const newTodo = await response.json();

    console.log(newTodo);

    // Clear input field
    todoInput.value = "";

    // Reload todos
    getTodos();

  } catch (error) {

    console.error(error);

    alert("Something went wrong.");

  }

}

// Add button click event
addBtn.addEventListener("click", addTodo);


// EDIT TODO TITLE
// Sends PUT request
async function editTodo(id, currentTitle) {

  // Ask user for a new title
  const newTitle = prompt("Edit your todo:", currentTitle);

  // User clicked Cancel
  if (newTitle === null) {

    return;

  }

  // Prevent empty title
  if (newTitle.trim() === "") {

    alert("Title cannot be empty.");

    return;

  }

  try {

    const response = await fetch(`${BASE_URL}/todos/${id}`, {

      method: "PUT",

      headers,

      body: JSON.stringify({

        title: newTitle.trim()

      })

    });

    if (!response.ok) {

      throw new Error("Failed to update title.");

    }

    // Refresh todo list
    getTodos();

  } catch (error) {

    console.error(error);

  }
}


// UPDATE TODO STATUS
// Mark todo as completed or pending
async function updateTodo(id, completed) {

  try {

    const response = await fetch(`${BASE_URL}/todos/${id}`, {

      method: "PUT",

      headers,

      body: JSON.stringify({

        completed: completed

      })

    });

    if (!response.ok) {

      throw new Error("Failed to update todo.");

    }

    // Reload updated todos
    getTodos();

  } catch (error) {

    console.error(error);

  }

}

// DELETE TODO
// Sends DELETE request
async function deleteTodo(id) {

  // Ask user before deleting
  const confirmDelete = confirm("Delete this Todo?");

  if (!confirmDelete) return;

  try {

    const response = await fetch(`${BASE_URL}/todos/${id}`, {

      method: "DELETE",

      headers

    });

    if (!response.ok) {

      throw new Error("Delete failed.");

    }

    // Reload todo list
    getTodos();

  } catch (error) {

    console.error(error);

  }

}


// Press Enter to add todo
todoInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {

    addTodo();

  }

});