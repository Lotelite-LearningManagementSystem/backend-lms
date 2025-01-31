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

    // First verify that the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const chapter = new Chapter({
      name,
      description,
      subject: subjectId,
      createdBy: req.admin.id,
    });

    await chapter.save();

    // Populate the chapter with its subject details before sending response
    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('subject', 'name');

    res.json(populatedChapter);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }
    res.status(500).send('Server Error');
  }
};

// Upload Content
exports.uploadContent = async (req, res) => {
  try {
    const { title, description, chapterId } = req.body;
    const videoUrl = `/uploads/${req.file.filename}`;

    // First verify that the chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const content = new Content({
      title,
      description,
      chapter: chapterId,
      videoUrl,
      createdBy: req.admin.id,
    });

    await content.save();

    // Populate the content with its chapter details before sending response
    const populatedContent = await Content.findById(content._id)
      .populate('chapter', 'name');

    res.json(populatedContent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }
    res.status(500).send('Server Error');
  }
};

// Get Content Structure
exports.getContentStructure = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path: 'chapters',
        select: 'name description createdAt',
        populate: {
          path: 'contents',
          select: 'title description videoUrl duration'
        }
      });
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 