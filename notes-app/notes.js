const fs = require('fs');

const NOTES_FILE_NAME = 'notes.json';

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNotes = notes.filter((note) => note.title === title);

  debugger;

  if (duplicateNotes.length === 0) {
    notes.push({ title, body });
    saveNotes(notes);
  } else {
    console.error('Note title taken');
  }
};

const removeNote = (title) => {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => note.title !== title);

  if (notes.length > notesToKeep.length) {
    console.log('Note removed');
    saveNotes(notesToKeep);
  } else console.log('No note found');
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
  removeNote,
};
