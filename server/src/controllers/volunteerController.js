import { Volunteer } from "../models/Volunteer.js";

export async function createVolunteer(req, res) {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getVolunteers(req, res) {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateVolunteer(req, res) {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    return res.json(volunteer);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteVolunteer(req, res) {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
