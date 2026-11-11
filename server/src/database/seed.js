const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seedDatabase() {
  console.log('--- Seeding CM-PGRP Kerala Database ---');

  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('Password@123', saltRounds);

  // Clear existing data for fresh reproducible demo
  db.exec(`
    DELETE FROM citizen_feedback;
    DELETE FROM attachments;
    DELETE FROM grievance_history;
    DELETE FROM grievances;
    DELETE FROM contact_enquiries;
    DELETE FROM users;
    DELETE FROM departments;
  `);

  // 1. Seed Departments
  const departments = [
    {
      code: 'PWD',
      name: 'Public Works Department (Roads & Bridges)',
      name_ml: 'പൊതുമരാമത്ത് വകുപ്പ്',
      description: 'Responsible for construction, maintenance, and upkeep of state highways, major district roads, bridges, and government infrastructure across Kerala.',
      minister: 'Shri. P. A. Mohamed Riyas (Minister for Public Works and Tourism)',
      nodal_officer: 'Er. George Thomas (Chief Engineer, PWD Roads)',
      email: 'pwd.grievance@kerala.gov.in',
      phone: '0471-2322300'
    },
    {
      code: 'KWA',
      name: 'Kerala Water Authority',
      name_ml: 'കേരള വാട്ടർ അതോറിറ്റി',
      description: 'Autonomous state utility ensuring supply of clean potable drinking water, sewerage treatment, urban pipeline networks, and Jal Jeevan Mission projects.',
      minister: 'Shri. Roshy Augustine (Minister for Water Resources)',
      nodal_officer: 'Er. Jayasree S. (Chief Engineer, Southern Region)',
      email: 'kwa.grievance@kerala.gov.in',
      phone: '1916 / 0471-2328654'
    },
    {
      code: 'KSEB',
      name: 'Kerala State Electricity Board Ltd.',
      name_ml: 'കേരള സംസ്ഥാന വൈദ്യുതി ബോർഡ്',
      description: 'State-owned public sector power generation, transmission, and distribution company powering commercial and domestic consumers across 14 districts.',
      minister: 'Shri. K. Krishnankutty (Minister for Electricity)',
      nodal_officer: 'Er. Radhakrishnan V. (Director of Distribution)',
      email: 'kseb.grievance@kerala.gov.in',
      phone: '1912 / 0471-2555544'
    },
    {
      code: 'HEALTH',
      name: 'Health & Family Welfare Department',
      name_ml: 'ആരോഗ്യ കുടുംബക്ഷേമ വകുപ്പ്',
      description: 'Overseeing primary health centres, taluk hospitals, medical colleges, public health surveillance, epidemic control, and medicine availability in Kerala.',
      minister: 'Smt. Veena George (Minister for Health and Family Welfare)',
      nodal_officer: 'Dr. Reena Mary (Director of Health Services)',
      email: 'health.grievance@kerala.gov.in',
      phone: '1056 (Disha) / 0471-2321284'
    },
    {
      code: 'EDUCATION',
      name: 'General Education Department',
      name_ml: 'പൊതുവിദ്യാഭ്യാസ വകുപ്പ്',
      description: 'Managing government and aided schools, curriculum standards, mid-day meal scheme, free textbook distribution, and high-tech classroom initiatives.',
      minister: 'Shri. V. Sivankutty (Minister for General Education & Labour)',
      nodal_officer: 'Shri. Shanavas S. IAS (Director of General Education)',
      email: 'education.grievance@kerala.gov.in',
      phone: '0471-2580500'
    },
    {
      code: 'REVENUE',
      name: 'Revenue & Land Records Department',
      name_ml: 'റവന്യൂ ഭൂരേഖ വകുപ്പ്',
      description: 'Administering taluk and village offices, land pattayams, land survey demarcation, mutation (pokkuvarav), and state disaster relief funds.',
      minister: 'Shri. K. Rajan (Minister for Revenue and Housing)',
      nodal_officer: 'Shri. K. Biju IAS (Land Revenue Commissioner)',
      email: 'revenue.grievance@kerala.gov.in',
      phone: '1800-425-5255'
    },
    {
      code: 'POLICE',
      name: 'Kerala Police & Public Safety',
      name_ml: 'കേരള പോലീസ്',
      description: 'Law enforcement, law and order, highway patrol, cyber dome cybercrime monitoring, women and child protection, and public emergency response.',
      minister: 'Chief Minister (Home & Vigilance Portfolio)',
      nodal_officer: 'Shri. Manoj Abraham IPS (ADGP, Law & Order)',
      email: 'police.grievance@kerala.gov.in',
      phone: '112 / 0471-2722215'
    },
    {
      code: 'LSGD',
      name: 'Local Self Government Department (LSGD)',
      name_ml: 'തദ്ദേശ സ്വയംഭരണ വകുപ്പ്',
      description: 'Gram Panchayats, Municipalities, and Municipal Corporations responsible for solid waste management, sanitation, street lighting, and local permits.',
      minister: 'Shri. M. B. Rajesh (Minister for Local Self Governments)',
      nodal_officer: 'Shri. S. Harikishore IAS (Principal Director, LSGD)',
      email: 'lsgd.grievance@kerala.gov.in',
      phone: '0471-2324950'
    },
    {
      code: 'CIVIL_SUPPLIES',
      name: 'Civil Supplies & Consumer Affairs',
      name_ml: 'ഭക്ഷ്യ പൊതുവിതരണ വകുപ്പ്',
      description: 'Public Distribution System (PDS), ration card administration, Supplyco supermarkets, price stabilization, and consumer dispute redressal.',
      minister: 'Shri. G. R. Anil (Minister for Food and Civil Supplies)',
      nodal_officer: 'Dr. D. Sajith Babu IAS (Commissioner of Food Safety & Supplies)',
      email: 'civilsupplies.grievance@kerala.gov.in',
      phone: '1967 / 0471-2322155'
    },
    {
      code: 'TRANSPORT',
      name: 'Transport Department (KSRTC & Motor Vehicles)',
      name_ml: 'ഗതാഗത വകുപ്പ്',
      description: 'KSRTC bus operations, public transport connectivity, road safety enforcement, Regional Transport Offices (RTO), and licensing services.',
      minister: 'Shri. K. B. Ganesh Kumar (Minister for Transport)',
      nodal_officer: 'Shri. Biju Prabhakar IAS (Transport Secretary)',
      email: 'transport.grievance@kerala.gov.in',
      phone: '0471-2327759'
    }
  ];

  const insertDept = db.prepare(`
    INSERT INTO departments (code, name, name_ml, description, minister, nodal_officer, email, phone)
    VALUES (@code, @name, @name_ml, @description, @minister, @nodal_officer, @email, @phone)
  `);

  const deptMap = {};
  for (const dept of departments) {
    const res = insertDept.run(dept);
    deptMap[dept.code] = res.lastInsertRowid;
  }
  console.log(`Inserted ${departments.length} departments.`);

  // 2. Seed Users
  const users = [
    {
      name: 'Shri. K. Narayanan (Principal Secretary to CM)',
      email: 'cmo.admin@kerala.gov.in',
      mobile: '9847012345',
      password: defaultPassword,
      role: 'cmo_admin',
      district: 'Thiruvananthapuram',
      department_id: null
    },
    {
      name: 'Ananya Nair',
      email: 'citizen@kerala.gov.in',
      mobile: '9447123456',
      password: defaultPassword,
      role: 'citizen',
      district: 'Thiruvananthapuram',
      department_id: null
    },
    {
      name: 'Mathew Joseph',
      email: 'mathew.citizen@gmail.com',
      mobile: '9447998877',
      password: defaultPassword,
      role: 'citizen',
      district: 'Kottayam',
      department_id: null
    },
    {
      name: 'Er. Rajesh Kumar (Executive Engineer, PWD Roads)',
      email: 'pwd.officer@kerala.gov.in',
      mobile: '9846123456',
      password: defaultPassword,
      role: 'officer',
      district: 'Thiruvananthapuram',
      department_id: deptMap['PWD']
    },
    {
      name: 'Er. Mini Varghese (Assistant Executive Engineer, KWA)',
      email: 'kwa.officer@kerala.gov.in',
      mobile: '9846234567',
      password: defaultPassword,
      role: 'officer',
      district: 'Ernakulam',
      department_id: deptMap['KWA']
    },
    {
      name: 'Dr. Sujatha Pillai (District Medical Officer)',
      email: 'health.officer@kerala.gov.in',
      mobile: '9846345678',
      password: defaultPassword,
      role: 'officer',
      district: 'Wayanad',
      department_id: deptMap['HEALTH']
    },
    {
      name: 'Er. Suresh Babu (Assistant Engineer, KSEB Electrical Section)',
      email: 'kseb.officer@kerala.gov.in',
      mobile: '9846456789',
      password: defaultPassword,
      role: 'officer',
      district: 'Ernakulam',
      department_id: deptMap['KSEB']
    },
    {
      name: 'Shri. Vinod K. (Secretary, Grama Panchayat)',
      email: 'lsgd.officer@kerala.gov.in',
      mobile: '9846567890',
      password: defaultPassword,
      role: 'officer',
      district: 'Kozhikode',
      department_id: deptMap['LSGD']
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, mobile, password, role, district, department_id)
    VALUES (@name, @email, @mobile, @password, @role, @district, @department_id)
  `);

  const userMap = {};
  for (const u of users) {
    const res = insertUser.run(u);
    userMap[u.email] = { id: res.lastInsertRowid, ...u };
  }
  console.log(`Inserted ${users.length} users with standard credentials.`);

  // 3. Seed Realistic Grievances in different stages
  const grievances = [
    {
      reference_id: 'KL-CMO-2026-00101',
      citizen_id: userMap['citizen@kerala.gov.in'].id,
      department_id: deptMap['PWD'],
      district: 'Kottayam',
      taluk: 'Meenachil',
      category: 'Pothole Repair',
      subject: 'Severe craters and broken culvert on MC Road near Ettumanoor junction',
      description: 'Due to recent heavy monsoon showers, a stretch of 500 meters on Main Central (MC) Road near Ettumanoor Temple junction has developed dangerous potholes over 1 foot deep. Multiple two-wheelers have skidded and met with accidents in the last 48 hours. Urgent bituminous re-tarring and warning barricades are critically needed.',
      priority: 'High',
      status: 'Submitted',
      is_escalated: 0,
      escalation_reason: null,
      ai_suggested_dept_id: deptMap['PWD'],
      ai_suggested_category: 'Pothole Repair',
      ai_priority_recommendation: 'High',
      ai_confidence: 0.94,
      ai_summary: 'Citizen reports severe 1-foot craters on MC Road near Ettumanoor causing frequent two-wheeler skids. Recommends immediate bituminous patching and warning signs.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: '2026-11-10 09:30:00'
    },
    {
      reference_id: 'KL-CMO-2026-00102',
      citizen_id: userMap['citizen@kerala.gov.in'].id,
      department_id: deptMap['KWA'],
      district: 'Thiruvananthapuram',
      taluk: 'Thiruvananthapuram',
      category: 'Pipeline Leakage / Burst',
      subject: 'Major 300mm drinking water main pipeline burst at Pattom Marappalam Road',
      description: 'A 300mm cast iron main drinking water line has burst near Marappalam, Pattom. Millions of litres of treated drinking water are flooding the main road and entering nearby residential compounds. Over 400 households in Pattom and Kesavadasapuram have had zero water supply for 36 hours.',
      priority: 'High',
      status: 'Under Review',
      is_escalated: 1,
      escalation_reason: 'Drinking water outage exceeding 36 hours affecting 400+ residents in state capital.',
      ai_suggested_dept_id: deptMap['KWA'],
      ai_suggested_category: 'Pipeline Leakage / Burst',
      ai_priority_recommendation: 'High',
      ai_confidence: 0.97,
      ai_summary: 'Major 300mm pipe burst in Pattom Marappalam flooding roads; 400+ homes without drinking water for 36 hours. Immediate valve closure and welding needed.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: '2026-11-09 14:15:00'
    },
    {
      reference_id: 'KL-CMO-2026-00103',
      citizen_id: userMap['mathew.citizen@gmail.com'].id,
      department_id: deptMap['KSEB'],
      district: 'Ernakulam',
      taluk: 'Aluva',
      category: 'Faulty Transformer',
      subject: 'Sparking distribution transformer and severe low voltage in Desom, Aluva',
      description: 'The 100 kVA distribution transformer adjacent to Desom SNDP Hall is sparking continuously during evening peak hours. Voltage drops below 140V, damaging domestic refrigerators and water pump motors. Residents fear a potential fire explosion.',
      priority: 'Medium',
      status: 'In Progress',
      is_escalated: 0,
      escalation_reason: null,
      ai_suggested_dept_id: deptMap['KSEB'],
      ai_suggested_category: 'Faulty Transformer',
      ai_priority_recommendation: 'High',
      ai_confidence: 0.93,
      ai_summary: 'Overloaded 100kVA transformer sparking in Desom Aluva with 140V drop damaging appliances and posing fire hazard.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: 'Electrical section team inspected the site on 11 Nov 2026. Phase load unbalance identified. Replacement 160 kVA transformer requisitioned from Angamaly central stores. Installation scheduled for tomorrow 10:00 AM.',
      resolution_notes: null,
      resolved_at: null,
      created_at: '2026-11-08 11:20:00'
    },
    {
      reference_id: 'KL-CMO-2026-00104',
      citizen_id: userMap['citizen@kerala.gov.in'].id,
      department_id: deptMap['HEALTH'],
      district: 'Wayanad',
      taluk: 'Mananthavady',
      category: 'Hospital Facilities & Medicines',
      subject: 'Anti-venom serum and pediatric antibiotic shortage at Taluk Headquarters Hospital',
      description: 'The emergency pharmacy at Taluk Headquarters Hospital Mananthavady was completely out of polyvalent anti-snake venom vials and critical IV antibiotics during plantation harvesting season when bite risks peak. Poor tribal families were being directed to private pharmacies 15 km away.',
      priority: 'High',
      status: 'Resolved',
      is_escalated: 0,
      escalation_reason: null,
      ai_suggested_dept_id: deptMap['HEALTH'],
      ai_suggested_category: 'Hospital Facilities & Medicines',
      ai_priority_recommendation: 'High',
      ai_confidence: 0.98,
      ai_summary: 'Critical stockout of polyvalent snake anti-venom and pediatric antibiotics at Mananthavady Taluk Hospital during peak hazard season.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: 'Kerala Medical Services Corporation (KMSCL) Kozhikode warehouse dispatched an emergency consignment of 150 vials of lyophilized polyvalent anti-snake venom and emergency pediatric stock. Stock safely received and verified by DMO Wayanad on 10 Nov 2026.',
      resolution_notes: 'Stocks verified and 24x7 emergency buffer established. Hospital superintendent instructed to maintain a minimum 30-day buffer.',
      resolved_at: '2026-11-10 16:45:00',
      created_at: '2026-11-06 08:45:00'
    },
    {
      reference_id: 'KL-CMO-2026-00105',
      citizen_id: userMap['mathew.citizen@gmail.com'].id,
      department_id: deptMap['LSGD'],
      district: 'Kozhikode',
      taluk: 'Kozhikode',
      category: 'Garbage & Waste Disposal',
      subject: 'Illegal municipal solid waste dumping and open burning on South Beach promenade',
      description: 'Commercial waste from nearby restaurants and fish markets is being systematically dumped near the lighthouse section of Kozhikode beach and burned after midnight, causing toxic plastic smoke choking morning walkers.',
      priority: 'Medium',
      status: 'Reopened',
      is_escalated: 1,
      escalation_reason: 'Citizen reported that waste was merely pushed into sand dunes without actual clearance.',
      ai_suggested_dept_id: deptMap['LSGD'],
      ai_suggested_category: 'Garbage & Waste Disposal',
      ai_priority_recommendation: 'Medium',
      ai_confidence: 0.89,
      ai_summary: 'Illegal waste dumping and nocturnal plastic burning at Kozhikode South Beach promenade impacting public health.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: 'Initial sanitisation carried out on 9 Nov 2026. However citizen flagged that hotel waste dumping resumed the following night. Reopened for night squad enforcement and CCTV installation.',
      resolution_notes: null,
      resolved_at: null,
      created_at: '2026-11-05 18:00:00'
    },
    {
      reference_id: 'KL-CMO-2026-00106',
      citizen_id: userMap['citizen@kerala.gov.in'].id,
      department_id: deptMap['EDUCATION'],
      district: 'Palakkad',
      taluk: 'Chittur',
      category: 'School Infrastructure Damage',
      subject: 'Dangerous ceiling plaster collapse in Class 7 classroom at GHSS Chittur',
      description: 'Heavy seepage from the terrace caused a large section of ceiling plaster to detach and fall in the Class 7 room. Fortunately it occurred during recess, but the entire school building roof requires urgent waterproofing and structural stability certification.',
      priority: 'High',
      status: 'In Progress',
      is_escalated: 0,
      escalation_reason: null,
      ai_suggested_dept_id: deptMap['EDUCATION'],
      ai_suggested_category: 'School Infrastructure Damage',
      ai_priority_recommendation: 'High',
      ai_confidence: 0.95,
      ai_summary: 'Ceiling plaster fall at GHSS Chittur due to water seepage. Classroom cordoned off; structural inspection in progress.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: 'Assistant Engineer PWD Buildings inspected the site. Class 7 shifted to new smart block. Administrative sanction of Rs. 4.8 Lakhs issued for immediate terrace polymer waterproofing and ceiling re-plastering.',
      resolution_notes: null,
      resolved_at: null,
      created_at: '2026-11-07 10:10:00'
    },
    {
      reference_id: 'KL-CMO-2026-00107',
      citizen_id: userMap['mathew.citizen@gmail.com'].id,
      department_id: deptMap['REVENUE'],
      district: 'Alappuzha',
      taluk: 'Kuttanad',
      category: 'Disaster Relief Compensation',
      subject: 'Unexplained 9-month delay in disbursement of 2025 flood crop damage financial aid',
      description: 'Our paddy field in Nedumudi padasekharam suffered complete inundation in the September floods. Revenue agricultural assessment was completed in November 2025 (File No. REV/ALPY/6721). However, the DBT grant of Rs. 35,000 has still not been credited to our bank account despite multiple visits to the taluk office.',
      priority: 'Medium',
      status: 'Submitted',
      is_escalated: 0,
      escalation_reason: null,
      ai_suggested_dept_id: deptMap['REVENUE'],
      ai_suggested_category: 'Disaster Relief Compensation',
      ai_priority_recommendation: 'Medium',
      ai_confidence: 0.92,
      ai_summary: 'Citizen requests expediting pending Rs. 35,000 flood crop loss DBT assistance delayed by 9 months in Kuttanad.',
      ai_duplicate_flag: 0,
      ai_duplicate_ref: null,
      action_taken_report: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: '2026-11-11 11:00:00'
    }
  ];

  const insertGrievance = db.prepare(`
    INSERT INTO grievances (
      reference_id, citizen_id, department_id, district, taluk, category, subject, description,
      priority, status, is_escalated, escalation_reason, ai_suggested_dept_id, ai_suggested_category,
      ai_priority_recommendation, ai_confidence, ai_summary, ai_duplicate_flag, ai_duplicate_ref,
      action_taken_report, resolution_notes, resolved_at, created_at, updated_at
    ) VALUES (
      @reference_id, @citizen_id, @department_id, @district, @taluk, @category, @subject, @description,
      @priority, @status, @is_escalated, @escalation_reason, @ai_suggested_dept_id, @ai_suggested_category,
      @ai_priority_recommendation, @ai_confidence, @ai_summary, @ai_duplicate_flag, @ai_duplicate_ref,
      @action_taken_report, @resolution_notes, @resolved_at, @created_at, @created_at
    )
  `);

  const grievanceIdMap = {};
  for (const g of grievances) {
    const res = insertGrievance.run(g);
    grievanceIdMap[g.reference_id] = res.lastInsertRowid;
  }
  console.log(`Inserted ${grievances.length} grievances across all mandatory workflow states.`);

  // 4. Seed Grievance Lifecycle History
  const insertHistory = db.prepare(`
    INSERT INTO grievance_history (
      grievance_id, user_id, user_name, user_role, action, previous_status, new_status, remarks, created_at
    ) VALUES (
      @grievance_id, @user_id, @user_name, @user_role, @action, @previous_status, @new_status, @remarks, @created_at
    )
  `);

  // History for #101
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00101'],
    user_id: userMap['citizen@kerala.gov.in'].id,
    user_name: userMap['citizen@kerala.gov.in'].name,
    user_role: 'citizen',
    action: 'SUBMITTED',
    previous_status: null,
    new_status: 'Submitted',
    remarks: 'Grievance submitted online via CM-PGRP Portal with AI assistance.',
    created_at: '2026-11-10 09:30:00'
  });

  // History for #102
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00102'],
    user_id: userMap['citizen@kerala.gov.in'].id,
    user_name: userMap['citizen@kerala.gov.in'].name,
    user_role: 'citizen',
    action: 'SUBMITTED',
    previous_status: null,
    new_status: 'Submitted',
    remarks: 'Grievance registered. Ref ID generated.',
    created_at: '2026-11-09 14:15:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00102'],
    user_id: userMap['cmo.admin@kerala.gov.in'].id,
    user_name: userMap['cmo.admin@kerala.gov.in'].name,
    user_role: 'cmo_admin',
    action: 'CMO_REVIEW',
    previous_status: 'Submitted',
    new_status: 'Under Review',
    remarks: 'CMO cell reviewed complaint. Urgent public utility hazard recognized. Flagged as escalated.',
    created_at: '2026-11-09 15:00:00'
  });

  // History for #103
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00103'],
    user_id: userMap['mathew.citizen@gmail.com'].id,
    user_name: userMap['mathew.citizen@gmail.com'].name,
    user_role: 'citizen',
    action: 'SUBMITTED',
    previous_status: null,
    new_status: 'Submitted',
    remarks: 'Grievance registered.',
    created_at: '2026-11-08 11:20:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00103'],
    user_id: userMap['cmo.admin@kerala.gov.in'].id,
    user_name: userMap['cmo.admin@kerala.gov.in'].name,
    user_role: 'cmo_admin',
    action: 'FORWARDED_TO_DEPT',
    previous_status: 'Submitted',
    new_status: 'Under Review',
    remarks: 'Assigned to KSEB Executive Engineer Ernakulam for field inspection within 24 hrs.',
    created_at: '2026-11-08 12:45:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00103'],
    user_id: userMap['kseb.officer@kerala.gov.in'].id,
    user_name: userMap['kseb.officer@kerala.gov.in'].name,
    user_role: 'officer',
    action: 'STATUS_UPDATED',
    previous_status: 'Under Review',
    new_status: 'In Progress',
    remarks: 'Officer initiated line patrol. Requisitioned 160 kVA transformer from central stores.',
    created_at: '2026-11-09 10:00:00'
  });

  // History for #104 (Resolved)
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00104'],
    user_id: userMap['citizen@kerala.gov.in'].id,
    user_name: userMap['citizen@kerala.gov.in'].name,
    user_role: 'citizen',
    action: 'SUBMITTED',
    previous_status: null,
    new_status: 'Submitted',
    remarks: 'Emergency hospital grievance filed.',
    created_at: '2026-11-06 08:45:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00104'],
    user_id: userMap['cmo.admin@kerala.gov.in'].id,
    user_name: userMap['cmo.admin@kerala.gov.in'].name,
    user_role: 'cmo_admin',
    action: 'FORWARDED_TO_DEPT',
    previous_status: 'Submitted',
    new_status: 'In Progress',
    remarks: 'Direct intervention by Principal Secretary. Immediate order issued to KMSCL.',
    created_at: '2026-11-06 09:30:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00104'],
    user_id: userMap['health.officer@kerala.gov.in'].id,
    user_name: userMap['health.officer@kerala.gov.in'].name,
    user_role: 'officer',
    action: 'ATR_SUBMITTED',
    previous_status: 'In Progress',
    new_status: 'Resolved',
    remarks: '150 polyvalent anti-venom vials received, verified, and placed in cold storage. Problem fully resolved.',
    created_at: '2026-11-10 16:45:00'
  });

  // Feedback for #104
  db.prepare(`
    INSERT INTO citizen_feedback (grievance_id, citizen_id, rating, comments, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    grievanceIdMap['KL-CMO-2026-00104'],
    userMap['citizen@kerala.gov.in'].id,
    5,
    'Exceptional response from the Chief Minister Office! Within 48 hours the emergency medicine stocks were replenished. Lives will be saved. Gratitude to the entire team!',
    '2026-11-10 18:30:00'
  );

  // History for #105 (Reopened)
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00105'],
    user_id: userMap['mathew.citizen@gmail.com'].id,
    user_name: userMap['mathew.citizen@gmail.com'].name,
    user_role: 'citizen',
    action: 'SUBMITTED',
    previous_status: null,
    new_status: 'Submitted',
    remarks: 'Grievance submitted regarding coastal waste.',
    created_at: '2026-11-05 18:00:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00105'],
    user_id: userMap['lsgd.officer@kerala.gov.in'].id,
    user_name: userMap['lsgd.officer@kerala.gov.in'].name,
    user_role: 'officer',
    action: 'STATUS_UPDATED',
    previous_status: 'In Progress',
    new_status: 'Resolved',
    remarks: 'Sanitation squad completed clearance.',
    created_at: '2026-11-08 17:00:00'
  });
  insertHistory.run({
    grievance_id: grievanceIdMap['KL-CMO-2026-00105'],
    user_id: userMap['mathew.citizen@gmail.com'].id,
    user_name: userMap['mathew.citizen@gmail.com'].name,
    user_role: 'citizen',
    action: 'REOPENED',
    previous_status: 'Resolved',
    new_status: 'Reopened',
    remarks: 'Clearance was incomplete. Waste was only buried under sand and night burning restarted. Requesting police squad surveillance.',
    created_at: '2026-11-09 09:15:00'
  });

  // 5. Seed Contact Enquiries
  const enquiries = [
    {
      name: 'Sunil Panicker',
      email: 'sunil.panicker@outlook.com',
      phone: '9847112233',
      subject: 'Inquiry regarding CMO public hearing dates in Kannur',
      message: 'Respected Sir, could you please share the upcoming schedule for the Chief Minister’s Janasannidhi / District Mass Contact Programme in Kannur district? We have a community drinking water petition to submit.',
      status: 'New',
      created_at: '2026-11-11 16:20:00'
    },
    {
      name: 'Dr. Radhika Menon',
      email: 'radhika.menon@amrita.edu',
      phone: '9847223344',
      subject: 'Suggestion for automated SMS updates in Malayalam on grievance milestones',
      message: 'Greetings from Amrita University. The CM-PGRP portal is an excellent initiative. We recommend providing bilingual SMS notifications in Malayalam Unicode for rural citizens who do not have continuous smartphone access.',
      status: 'Read',
      created_at: '2026-11-10 11:45:00'
    }
  ];

  const insertEnquiry = db.prepare(`
    INSERT INTO contact_enquiries (name, email, phone, subject, message, status, created_at)
    VALUES (@name, @email, @phone, @subject, @message, @status, @created_at)
  `);

  for (const enq of enquiries) {
    insertEnquiry.run(enq);
  }
  console.log(`Inserted ${enquiries.length} contact enquiries.`);

  console.log('--- Database Seeding Completed Successfully! ---');
}

seedDatabase().catch(err => {
  console.error('Database seeding failed:', err);
  process.exit(1);
});
