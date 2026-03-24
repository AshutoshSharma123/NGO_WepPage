import { GalleryImage } from "../models/GalleryImage.js";
import { Impact } from "../models/Impact.js";
import { Involvement } from "../models/Involvement.js";
import { Program } from "../models/Program.js";

export async function getNgoOverview(req, res) {
  const [impact, programs, involvement, images] = await Promise.all([
    Impact.find().sort({ createdAt: -1 }).lean(),
    Program.find().sort({ createdAt: -1 }).lean(),
    Involvement.find().sort({ createdAt: -1 }).lean(),
    GalleryImage.find().sort({ createdAt: -1 }).lean()
  ]);

  res.json({
    impact: impact.map(({ _id, __v, createdAt, updatedAt, ...item }) => item),
    programs: programs.map(({ _id, __v, createdAt, updatedAt, ...item }) => item),
    involvement: involvement.map((item) => item.text),
    images: images.map(({ _id, __v, createdAt, updatedAt, ...item }) => item)
  });
}

export async function createImpact(req, res) {
  const item = await Impact.create(req.body);
  res.status(201).json(item);
}

export async function editImpact(req, res) {
  const item = await Impact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!item) {
    return res.status(404).json({ message: "Impact item not found" });
  }

  return res.json(item);
}

export async function removeImpact(req, res) {
  await Impact.findByIdAndDelete(req.params.id);
  res.status(204).send();
}

export async function createProgram(req, res) {
  const item = await Program.create(req.body);
  res.status(201).json(item);
}

export async function editProgram(req, res) {
  const item = await Program.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!item) {
    return res.status(404).json({ message: "Program not found" });
  }

  return res.json(item);
}

export async function removeProgram(req, res) {
  await Program.findByIdAndDelete(req.params.id);
  res.status(204).send();
}

export async function createInvolvement(req, res) {
  const item = await Involvement.create({ text: req.body.text });
  res.status(201).json(item);
}

export async function editInvolvement(req, res) {
  const item = await Involvement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!item) {
    return res.status(404).json({ message: "Involvement item not found" });
  }

  return res.json(item);
}

export async function removeInvolvement(req, res) {
  await Involvement.findByIdAndDelete(req.params.id);
  res.status(204).send();
}
