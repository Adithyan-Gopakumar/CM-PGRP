const https = require('https');
const db = require('../config/db');

/**
 * Standard Kerala Government Departments & Categories Knowledge Map
 */
const DEPARTMENT_KNOWLEDGE_BASE = [
  {
    code: 'PWD',
    name: 'Public Works Department',
    categories: ['Pothole Repair', 'Road Maintenance', 'Bridge & Culvert Damage', 'Drainage Overflow', 'Public Building Maintenance'],
    keywords: ['road', 'pothole', 'bridge', 'tarring', 'highway', 'culvert', 'crater', 'asphalt', 'divider', 'flyover', 'pavement', 'street', 'footpath', 'traffic signal', 'pwd']
  },
  {
    code: 'KWA',
    name: 'Kerala Water Authority',
    categories: ['Drinking Water Shortage', 'Pipeline Leakage / Burst', 'Contaminated Water', 'Billing Issues', 'New Connection Delay'],
    keywords: ['water', 'pipe', 'pipeline', 'leak', 'burst', 'tap', 'drinking water', 'contamination', 'kwa', 'tanker', 'chlorine', 'pressure', 'sewage', 'meter']
  },
  {
    code: 'KSEB',
    name: 'Kerala State Electricity Board',
    categories: ['Power Outage / Blackout', 'Low Voltage', 'Fallen Electrical Poles / Live Wire', 'Faulty Transformer', 'Electric Shock Hazard'],
    keywords: ['electricity', 'power', 'current', 'transformer', 'pole', 'live wire', 'shock', 'spark', 'blackout', 'kseb', 'voltage', 'meter', 'substation', 'cable', 'fuse']
  },
  {
    code: 'HEALTH',
    name: 'Health & Family Welfare',
    categories: ['Hospital Facilities & Medicines', 'Epidemic / Dengue / Fever Outbreak', 'Medical Negligence', 'PHC / CHC Doctor Shortage', 'Food Safety & Hygiene'],
    keywords: ['hospital', 'doctor', 'medicine', 'health', 'clinic', 'phc', 'chc', 'nurse', 'ambulance', 'fever', 'dengue', 'food poisoning', 'treatment', 'patient', 'pharmacy']
  },
  {
    code: 'EDUCATION',
    name: 'General Education',
    categories: ['School Infrastructure Damage', 'Mid-Day Meal Scheme', 'Teacher Vacancy', 'Textbook Shortage', 'Student Transport Safety'],
    keywords: ['school', 'teacher', 'education', 'student', 'class', 'classroom', 'midday meal', 'textbook', 'syllabus', 'college', 'headmaster', 'uniform', 'campus']
  },
  {
    code: 'REVENUE',
    name: 'Revenue & Land Records',
    categories: ['Land Encroachment', 'Title Deed (Pattayam) Delay', 'Survey & Boundary Dispute', 'Disaster Relief Compensation', 'Village Office Delay'],
    keywords: ['land', 'pattayam', 'village office', 'survey', 'deed', 'revenue', 'encroachment', 'boundary', 'taluk', 'compensation', 'flood relief', 'land records', 'pokkuvarav']
  },
  {
    code: 'POLICE',
    name: 'Police & Public Safety',
    categories: ['Law & Order / Harassment', 'Traffic Congestion', 'Noise Pollution', 'Cyber Crime & Online Fraud', 'FIR Non-Registration'],
    keywords: ['police', 'crime', 'fir', 'theft', 'harassment', 'safety', 'assault', 'traffic', 'noise', 'drugs', 'cyber', 'fraud', 'patrol', 'station', 'threat']
  },
  {
    code: 'LSGD',
    name: 'Local Self Government (Panchayat / Municipality)',
    categories: ['Garbage & Waste Disposal', 'Street Lights Not Working', 'Drainage Stagnation', 'Building Permit Delay', 'Stray Dog Menace'],
    keywords: ['panchayat', 'municipality', 'corporation', 'waste', 'garbage', 'street light', 'stray dog', 'cleaning', 'drain', 'mosquito', 'waste bin', 'lsgd', 'building permit']
  },
  {
    code: 'CIVIL_SUPPLIES',
    name: 'Civil Supplies & Consumer Affairs',
    categories: ['Ration Card Issues', 'Ration Shop Irregularity', 'Food Grain Quality', 'Overpricing / Black Marketing', 'LPG Subsidy Issue'],
    keywords: ['ration', 'food grains', 'rice', 'wheat', 'ration shop', 'civil supplies', 'kerosene', 'ration card', 'dealer', 'supplyco', 'maveli']
  },
  {
    code: 'TRANSPORT',
    name: 'Transport Department (KSRTC / RTO)',
    categories: ['KSRTC Bus Service Deficiency', 'Reckless Driving', 'Driving License Delay', 'Bus Stop / Route Cancellation', 'Auto Overcharging'],
    keywords: ['bus', 'ksrtc', 'transport', 'rto', 'driving license', 'fare', 'conductor', 'driver', 'route', 'depot', 'ticket', 'vehicle', 'permit']
  }
];

// High Urgency Keywords
const HIGH_PRIORITY_TRIGGERS = [
  'danger', 'death', 'casualty', 'shock', 'live wire', 'collapsed', 'burst', 'accident',
  'urgent', 'emergency', 'poison', 'epidemic', 'drowning', 'landslide', 'flooding',
  'fire', 'hazard', 'life-threatening', 'sparking', 'critical', 'severe', 'hospitalized'
];

const LOW_PRIORITY_TRIGGERS = [
  'inquiry', 'general', 'routine', 'information', 'slow', 'suggestion', 'feature',
  'name change', 'clarification', 'receipt', 'future', 'portal'
];

/**
 * Text Tokenizer & Stopword Filter
 */
function tokenize(text) {
  if (!text) return [];
  const stopwords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
    'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in',
    'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not',
    'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over',
    'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
    'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
    'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
    'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'please', 'sir', 'madam', 'kindly'
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !stopwords.has(token));
}

/**
 * Duplicate Grievance Detector
 * Calculates similarity between current complaint and active grievances in the same district/department.
 */
function checkDuplicateGrievance(text, district, candidateList) {
  const inputTokens = new Set(tokenize(text));
  if (inputTokens.size === 0) return { isDuplicate: false, similarityScore: 0, matchedRef: null };

  let maxSimilarity = 0;
  let matchedGrievance = null;

  for (const item of candidateList) {
    // Only compare within same district if district is known
    if (district && item.district && item.district.toLowerCase() !== district.toLowerCase()) {
      continue;
    }

    const itemTokens = new Set(tokenize(`${item.subject} ${item.description}`));
    if (itemTokens.size === 0) continue;

    // Jaccard similarity
    let intersection = 0;
    for (const t of inputTokens) {
      if (itemTokens.has(t)) intersection++;
    }
    const union = inputTokens.size + itemTokens.size - intersection;
    const similarity = union > 0 ? (intersection / union) : 0;

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      matchedGrievance = item;
    }
  }

  // Threshold for duplicate alert: >= 0.45 Jaccard overlap
  const isDuplicate = maxSimilarity >= 0.45;
  return {
    isDuplicate,
    similarityScore: Math.round(maxSimilarity * 100),
    matchedRef: isDuplicate ? matchedGrievance.reference_id : null,
    matchedSubject: isDuplicate ? matchedGrievance.subject : null
  };
}

/**
 * Intelligent Offline Rule & Semantic Analysis Engine (Labelled Fallback)
 */
function fallbackAnalyzeComplaint(description, subject = '', district = '') {
  const combinedText = `${subject} ${description}`.toLowerCase();
  const tokens = tokenize(combinedText);

  // Score each department
  let bestDept = DEPARTMENT_KNOWLEDGE_BASE[0];
  let bestScore = -1;
  let matchedCategory = bestDept.categories[0];

  for (const dept of DEPARTMENT_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of dept.keywords) {
      if (combinedText.includes(kw)) {
        score += 3;
      }
    }
    for (const token of tokens) {
      if (dept.keywords.includes(token)) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestDept = dept;
    }
  }

  // Determine best matching category within bestDept
  let categoryScores = bestDept.categories.map(cat => {
    const catWords = cat.toLowerCase().split(/\s+/);
    let s = 0;
    for (const w of catWords) {
      if (combinedText.includes(w)) s += 2;
    }
    return { cat, s };
  });
  categoryScores.sort((a, b) => b.s - a.s);
  if (categoryScores.length > 0 && categoryScores[0].s > 0) {
    matchedCategory = categoryScores[0].cat;
  } else {
    matchedCategory = bestDept.categories[0];
  }

  // Calculate priority
  let highUrgencyMatches = 0;
  for (const trig of HIGH_PRIORITY_TRIGGERS) {
    if (combinedText.includes(trig)) highUrgencyMatches++;
  }

  let lowUrgencyMatches = 0;
  for (const trig of LOW_PRIORITY_TRIGGERS) {
    if (combinedText.includes(trig)) lowUrgencyMatches++;
  }

  let priority = 'Medium';
  let priorityReason = 'Standard redressal priority according to normal department SLAs.';
  if (highUrgencyMatches > 0) {
    priority = 'High';
    priorityReason = `Urgent keywords detected (${highUrgencyMatches} hazard/safety factors found). Immediate CMO intervention required.`;
  } else if (lowUrgencyMatches > 1 && tokens.length < 30) {
    priority = 'Low';
    priorityReason = 'Routine public enquiry or standard administrative service request.';
  }

  // Confidence calculation
  const confidence = Math.min(0.95, Math.max(0.65, 0.60 + (bestScore * 0.04)));

  // Generate executive summary for CMO
  let summary = '';
  const cleanSentences = description
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  if (cleanSentences.length > 0) {
    summary = cleanSentences.slice(0, 2).join('. ') + '.';
  } else {
    summary = `Citizen reports issue regarding ${subject || matchedCategory} in ${district || 'Kerala'}.`;
  }

  if (summary.length > 250) {
    summary = summary.substring(0, 247) + '...';
  }

  // Query recent grievances in DB to check for duplicates
  let duplicateInfo = { isDuplicate: false, similarityScore: 0, matchedRef: null };
  try {
    const recentGrievances = db.prepare(`
      SELECT reference_id, subject, description, district 
      FROM grievances 
      ORDER BY id DESC LIMIT 100
    `).all();
    duplicateInfo = checkDuplicateGrievance(combinedText, district, recentGrievances);
  } catch (err) {
    // Non-fatal if DB not yet loaded
  }

  // Lookup department ID from database
  let deptRecord = null;
  try {
    deptRecord = db.prepare('SELECT id, name FROM departments WHERE code = ?').get(bestDept.code);
  } catch (e) {}

  return {
    source: 'Intelligent NLP Engine (Labelled Fallback)',
    isFallback: true,
    department: {
      id: deptRecord ? deptRecord.id : null,
      code: bestDept.code,
      name: bestDept.name
    },
    category: matchedCategory,
    priority,
    priorityReason,
    confidence: Math.round(confidence * 100) / 100,
    summary,
    duplicateDetection: duplicateInfo,
    suggestedAction: priority === 'High' 
      ? 'Forward immediately to Nodal Officer with 24-hour escalation flag.'
      : 'Route to respective Taluk/District section officer for site inspection.'
  };
}

/**
 * Call Google Gemini API (if GEMINI_API_KEY is configured)
 */
async function callGeminiApi(apiKey, description, subject = '', district = '') {
  return new Promise((resolve, reject) => {
    const prompt = `You are the AI Grievance Assistant for the Chief Minister's Public Grievance Redressal Portal (CM-PGRP), Government of Kerala.
Analyze the following citizen complaint and return ONLY a valid, raw JSON object (with NO markdown backticks, NO code block markers, NO commentary):

Complaint Subject: "${subject}"
District: "${district}"
Complaint Description: "${description}"

Allowed Department Codes:
- PWD: Road, bridges, culverts, drainage, street tarring
- KWA: Drinking water, pipeline leak/burst, contamination, sewage
- KSEB: Power outage, low voltage, fallen poles, live wire, electric shock hazard
- HEALTH: Hospitals, PHCs, medicine shortage, fever/dengue outbreaks, food safety
- EDUCATION: School infrastructure, midday meals, teachers, textbook shortage
- REVENUE: Land records, pattayam, encroachment, survey disputes, flood relief
- POLICE: Law & order, harassment, cyber crime, public safety, traffic
- LSGD: Panchayat/Municipality waste management, street lights, stray dogs, drains
- CIVIL_SUPPLIES: Ration cards, ration shops, food grains, overpricing
- TRANSPORT: KSRTC buses, reckless driving, driving licenses, route cancellations

JSON Schema to return:
{
  "departmentCode": "PWD" | "KWA" | "KSEB" | "HEALTH" | "EDUCATION" | "REVENUE" | "POLICE" | "LSGD" | "CIVIL_SUPPLIES" | "TRANSPORT",
  "category": "String category name",
  "priority": "Low" | "Medium" | "High",
  "priorityReason": "Brief explanation of why this priority was assigned",
  "confidence": 0.85 to 0.99,
  "summary": "1 to 2 crisp executive sentences summarizing key facts for CMO",
  "suggestedAction": "Recommended next step for administrative officer"
}`;

    const requestData = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        maxOutputTokens: 600
      }
    });

    const modelName = 'gemini-1.5-flash';
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const candidateText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!candidateText) {
              return reject(new Error('Empty Gemini response'));
            }
            // Strip code fence if present
            const cleanJson = candidateText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
            const result = JSON.parse(cleanJson);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse Gemini output: ${e.message}`));
          }
        } else {
          reject(new Error(`Gemini API error status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API call timed out'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(requestData);
    req.end();
  });
}

/**
 * Main AI Analysis Interface
 */
async function analyzeGrievance({ description, subject = '', district = '' }) {
  if (!description || description.trim().length === 0) {
    throw new Error('Description is required for grievance analysis.');
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiResult = await callGeminiApi(apiKey.trim(), description, subject, district);
      
      // Match department in DB
      let deptRecord = null;
      try {
        deptRecord = db.prepare('SELECT id, name FROM departments WHERE code = ?').get(geminiResult.departmentCode);
      } catch (e) {}

      // Check duplicates in DB
      let duplicateInfo = { isDuplicate: false, similarityScore: 0, matchedRef: null };
      try {
        const recentGrievances = db.prepare(`
          SELECT reference_id, subject, description, district 
          FROM grievances 
          ORDER BY id DESC LIMIT 100
        `).all();
        duplicateInfo = checkDuplicateGrievance(`${subject} ${description}`, district, recentGrievances);
      } catch (e) {}

      return {
        source: 'Google Gemini AI (Active Model: gemini-1.5-flash)',
        isFallback: false,
        department: {
          id: deptRecord ? deptRecord.id : null,
          code: geminiResult.departmentCode,
          name: deptRecord ? deptRecord.name : geminiResult.departmentCode
        },
        category: geminiResult.category || 'General Grievance',
        priority: ['Low', 'Medium', 'High'].includes(geminiResult.priority) ? geminiResult.priority : 'Medium',
        priorityReason: geminiResult.priorityReason || 'Assessed by Gemini LLM',
        confidence: typeof geminiResult.confidence === 'number' ? geminiResult.confidence : 0.92,
        summary: geminiResult.summary,
        duplicateDetection: duplicateInfo,
        suggestedAction: geminiResult.suggestedAction || 'Review and forward to department officer.'
      };
    } catch (apiError) {
      console.warn(`[AI Engine] Gemini API unavailable (${apiError.message}). Seamlessly engaging labelled fallback engine.`);
      // Seamlessly fall through to labelled fallback
    }
  }

  // Labelled fallback NLP engine
  return fallbackAnalyzeComplaint(description, subject, district);
}

module.exports = {
  analyzeGrievance,
  DEPARTMENT_KNOWLEDGE_BASE
};
