function popUp() {
  const popUpContainer = document.createElement("div");
  popUpContainer.id = "popUpContainer";
  popUpContainer.innerHTML = `
        <h1>New Note</h1>
        <textarea id="note-text" placeholder="Enter your note"></textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Create Note</button>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
    `;
  document.body.appendChild(popUpContainer);
}

function closePopup() {
  const popUpContainer = document.getElementById("popUpContainer");
  if (popUpContainer) {
    popUpContainer.remove();
  }
}

function createNote() {
  const noteText = document.getElementById("note-text").value;
  if (noteText.trim() !== "") {
    const note = {
      id: new Date().getTime(),
      text: noteText,
    };
    const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    existingNotes.push(note);
    localStorage.setItem("notes", JSON.stringify(existingNotes));
    document.getElementById("note-text").value = "";
    closePopup();
    displayNotes();
  }
}

function displayNotes() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((note) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <span>${note.text}</span>
            <div id="notesBtns-container">
                <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
                <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    notesList.appendChild(listItem);
  });
}

function editNote(noteId) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const noteToEdit = notes.find((note) => note.id == noteId);
  const noteText = noteToEdit ? noteToEdit.text : "";
  const editingPopUp = document.createElement("div");
  editingPopUp.innerHTML = `
        <div id="editing-container" data-note-id="${noteId}">
            <h1>Edit Note</h1>
            <textarea id="edit-note-text">${noteText}</textarea>
            <div id="btn-container">
                <button id="updateBtn" onclick="updateNote()">Done</button>
                <button id="cancelBtn" onclick="closeEditPopup()">Cancel</button>
            </div>
        </div>
    `;
  document.body.appendChild(editingPopUp);
}

function closeEditPopup() {
  const editingPopUp = document.getElementById("editing-container");
  if (editingPopUp) {
    editingPopUp.remove();
  }
}

function updateNote() {
  const noteText = document.getElementById("edit-note-text").value.trim();
  const editingPopUp = document.getElementById("editing-container");
  if (noteText !== "") {
    const noteId = editingPopUp.getAttribute("data-note-id");
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedNotes = notes.map((note) => {
      if (note.id == noteId) {
        return { id: note.id, text: noteText };
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    editingPopUp.remove();
    displayNotes();
  }
}

function deleteNote(noteId) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter((note) => note.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

document.addEventListener("DOMContentLoaded", displayNotes);
