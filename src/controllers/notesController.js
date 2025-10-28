import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 10;
  const { tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const filter = {};

  if (tag) {
    filter.tag = tag;
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

  const [notes, totalNotes] = await Promise.all([
    Note.find({ userId: req.user._id, ...filter }).skip(skip).limit(perPage).exec(),
    Note.countDocuments({ userId: req.user._id, ...filter }),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId, userId: req.user._id }, req.body, {
    new: true,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
