const fs = require('fs');

const NOTES_FILE_NAME = 'notes.json';

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNotes = notes.filter((note) => note.title === title);

  if (duplicateNotes.length === 0) {
    notes.push({ title, body });
    saveNotes(notes);
  } else {
    console.error('Note title taken');
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync(NOTES_FILE_NAME, dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync(NOTES_FILE_NAME);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = {
  addNote,
};
