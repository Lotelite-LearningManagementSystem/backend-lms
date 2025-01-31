const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Content = require('../models/Content');

// Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const subject = new Subject({
      name,
      description,
      createdBy: req.admin.id,
    });

    await subject.save();
    res.json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create Chapter
exports.createChapter = async (req, res) => {
  try {
    const { name, description, subjectId } = req.body;

    const chapter = new Chapter({
      name,
      description,
      subject: subjectId,
      createdBy: req.admin.id,
    });

    await chapter.save();
    res.json(chapter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Upload Content
exports.uploadContent = async (req, res) => {
  try {
    const { title, description, chapterId } = req.body;
    const videoUrl = `/uploads/${req.file.filename}`;

    const content = new Content({
      title,
      description,
      chapter: chapterId,
      videoUrl,
      createdBy: req.admin.id,
    });

    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Content Structure
exports.getContentStructure = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path: 'chapters',
        populate: {
          path: 'contents',
        },
      });
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 