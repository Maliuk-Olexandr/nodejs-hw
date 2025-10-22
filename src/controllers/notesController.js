import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const { tag, search } = req.query;
  const skip = (page - 1) * perPage;


  const filter = {};

  if (tag) {
    filter.tags = tag;
  }
  if (search && search.trim() !== '') {
    filter.$text = { $search: search };
  }

  // if (search && search.trim() !== '') {
  //   filter.$or = [
  //     { title: { $regex: search, $options: 'i' } },
  //     { content: { $regex: search, $options: 'i' } },
  //   ];
  // }

  const [notes, totalItems] = await Promise.all([
    Note.find(filter).skip(skip).limit(perPage).exec(),
    Note.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    notes,
    page,
    perPage,
    totalItems,
    totalPages,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
