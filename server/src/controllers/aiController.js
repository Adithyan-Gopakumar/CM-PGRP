const { analyzeGrievance } = require('../services/aiService');

exports.analyzeComplaintText = async (req, res) => {
  try {
    const { description, subject, district } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Complaint description is required for AI analysis.'
      });
    }

    const analysis = await analyzeGrievance({
      description,
      subject: subject || '',
      district: district || ''
    });

    return res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('AI Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete AI grievance analysis.',
      error: error.message
    });
  }
};
