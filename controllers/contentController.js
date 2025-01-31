const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Content = require('../models/Content');
const { put } = require('@vercel/blob');

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
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded',
        body: req.body,
        files: req.files
      });
    }

    const { title, description, chapterId } = req.body;

    // First verify that the chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Upload to Vercel Blob with unique filename
    const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
    const blob = await put(uniqueFilename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
      addRandomSuffix: false // Prevent random suffix addition
    });

    const content = new Content({
      title,
      description,
      chapter: chapterId,
      videoUrl: blob.url,
      createdBy: req.admin.id,
    });

    await content.save();
    const populatedContent = await Content.findById(content._id)
      .populate('chapter', 'name');

    res.json(populatedContent);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      message: 'Server Error',
      error: err.message,
      stack: err.stack
    });
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

// Get All Chapters
exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find()
      .populate('subject', 'name')
      .populate('contents', 'title description videoUrl duration')
      .select('name description createdAt');
      
    res.json(chapters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .select('name description createdAt')
      .populate({
        path: 'chapters',
        select: 'name description',
        options: { sort: { createdAt: -1 } }
      });
    
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Subject Content
exports.getSubjectContent = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId)
      .populate({
        path: 'chapters',
        select: 'name description createdAt',
        options: { sort: { createdAt: 1 } },
        populate: {
          path: 'contents',
          select: 'title description videoUrl duration createdAt',
          options: { sort: { createdAt: 1 } }
        }
      })
      .select('name description createdAt');

    if (!subject) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subject not found' 
      });
    }

    // Transform the data into a more organized structure
    const response = {
      success: true,
      subject: {
        id: subject._id,
        name: subject.name,
        description: subject.description,
        chaptersCount: subject.chapters.length,
        totalVideos: subject.chapters.reduce((sum, chapter) => sum + chapter.contents.length, 0),
        chapters: subject.chapters.map(chapter => ({
          id: chapter._id,
          name: chapter.name,
          description: chapter.description,
          videosCount: chapter.contents.length,
          videos: chapter.contents.map(content => ({
            id: content._id,
            title: content.title,
            description: content.description,
            videoUrl: content.videoUrl,
            duration: content.duration,
            uploadDate: content.createdAt
          }))
        }))
      }
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid subject ID format' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: err.message 
    });
  }
}; 