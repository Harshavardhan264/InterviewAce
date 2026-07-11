const Company = require('../models/Company');

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving companies list' });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const { companyName, topics, interviewQuestions, interviewExperiences, difficultyLevel, preparationTips } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const companyExists = await Company.findOne({ companyName });
    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = await Company.create({
      companyName,
      topics: topics || [],
      interviewQuestions: interviewQuestions || [],
      interviewExperiences: interviewExperiences || [],
      difficultyLevel: difficultyLevel || 'Medium',
      preparationTips: preparationTips || []
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating company listing' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { companyName, topics, interviewQuestions, interviewExperiences, difficultyLevel, preparationTips } = req.body;
    
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company listing not found' });
    }

    const updatedData = {};
    if (companyName !== undefined) updatedData.companyName = companyName;
    if (topics !== undefined) updatedData.topics = topics;
    if (interviewQuestions !== undefined) updatedData.interviewQuestions = interviewQuestions;
    if (interviewExperiences !== undefined) updatedData.interviewExperiences = interviewExperiences;
    if (difficultyLevel !== undefined) updatedData.difficultyLevel = difficultyLevel;
    if (preparationTips !== undefined) updatedData.preparationTips = preparationTips;

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating company listing' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company listing not found' });
    }

    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting company listing' });
  }
};
