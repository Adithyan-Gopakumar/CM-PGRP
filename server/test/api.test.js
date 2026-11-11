const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/index');

test('CM-PGRP API Integration Test Suite', async (t) => {
  let citizenToken = '';
  let cmoToken = '';
  let officerToken = '';
  let createdRefId = '';
  let createdGrievanceId = null;
  let targetDeptId = 1;

  await t.test('1. Health Check Endpoint', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'online');
    assert.strictEqual(res.body.state, 'Kerala');
  });

  await t.test('2. Retrieve Departments List', async () => {
    const res = await request(app).get('/api/departments');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.departments.length >= 10);
    targetDeptId = res.body.departments[0].id;
  });

  await t.test('3. Citizen Login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'citizen@kerala.gov.in', password: 'Password@123' });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'citizen');
    assert.ok(res.body.token);
    citizenToken = res.body.token;
  });

  await t.test('4. CMO Admin Login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cmo.admin@kerala.gov.in', password: 'Password@123' });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'cmo_admin');
    assert.ok(res.body.token);
    cmoToken = res.body.token;
  });

  await t.test('5. Officer Login (PWD)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pwd.officer@kerala.gov.in', password: 'Password@123' });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'officer');
    assert.ok(res.body.token);
    officerToken = res.body.token;
  });

  await t.test('6. AI Grievance Assistant Analysis', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({
        description: 'Dangerous electric pole tilted near bus stop with live wire sparking during heavy rain.',
        subject: 'Sparking wire near bus stop',
        district: 'Ernakulam'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.analysis.department.code, 'KSEB');
    assert.strictEqual(res.body.analysis.priority, 'High');
    assert.ok(res.body.analysis.summary.length > 10);
  });

  await t.test('7. Citizen Submits Grievance with AI Triage', async () => {
    const res = await request(app)
      .post('/api/grievances')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        district: 'Ernakulam',
        taluk: 'Kochi',
        category: 'Faulty Transformer',
        subject: 'Test Live Wire Sparking on MG Road',
        description: 'Sparking electric wire hanging low right above the pedestrian footpath near metro station.',
        priority: 'High',
        ai_priority_recommendation: 'High',
        ai_summary: 'Test summary from AI assistant'
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.referenceId.startsWith('KL-CMO-2026-'));
    createdRefId = res.body.referenceId;
    createdGrievanceId = res.body.grievance.id;
  });

  await t.test('8. Public Tracking by Reference ID', async () => {
    const res = await request(app).get(`/api/grievances/track/${createdRefId}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.grievance.reference_id, createdRefId);
    assert.strictEqual(res.body.grievance.status, 'Submitted');
    assert.ok(res.body.grievance.history.length >= 1);
  });

  await t.test('9. CMO Admin Reviews and Forwards Grievance', async () => {
    const res = await request(app)
      .post(`/api/grievances/${createdGrievanceId}/forward`)
      .set('Authorization', `Bearer ${cmoToken}`)
      .send({
        department_id: targetDeptId,
        remarks: 'Priority intervention ordered by Chief Minister cell.',
        priority: 'High'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('10. Officer Updates Status to In Progress', async () => {
    const res = await request(app)
      .patch(`/api/grievances/${createdGrievanceId}/status`)
      .set('Authorization', `Bearer ${cmoToken}`) // Or officer
      .send({
        status: 'In Progress',
        remarks: 'Lineman team dispatched to site with bucket truck.'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.grievance.status, 'In Progress');
  });

  await t.test('11. Submit Action Taken Report (ATR) & Mark Resolved', async () => {
    const res = await request(app)
      .post(`/api/grievances/${createdGrievanceId}/atr`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        action_taken_report: 'Conductor replaced, insulator bracket re-fixed. Hazard eliminated.',
        mark_resolved: true,
        remarks: 'Field inspection completed.'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.status, 'Resolved');
  });

  await t.test('12. Citizen Submits 5-Star Feedback', async () => {
    const res = await request(app)
      .post(`/api/grievances/${createdGrievanceId}/feedback`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        rating: 5,
        comments: 'Outstanding turnaround by the KSEB team and CMO monitoring!'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('13. Citizen Reopens Grievance Workflow', async () => {
    const res = await request(app)
      .post(`/api/grievances/${createdGrievanceId}/reopen`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        remarks: 'Loose wire branch still dangling on nearby tree branch.'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('14. CMO Dashboard Statistics', async () => {
    const res = await request(app)
      .get('/api/cmo/stats')
      .set('Authorization', `Bearer ${cmoToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.summary.total > 0);
    assert.strictEqual(res.body.data.districtStats.length, 14);
  });

  await t.test('15. Contact Enquiry Submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Gopakumar Pillai',
        email: 'gopakumar@gmail.com',
        phone: '9847554433',
        subject: 'Toll free helpline query',
        message: 'Is the 1076 helpline available on second Saturdays?'
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
  });
});
