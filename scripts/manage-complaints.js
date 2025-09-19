#!/usr/bin/env node
/**
 * manage-complaints.js
 *
 * Archives resolved complaints into ops/complaints/archive/<pod>/ and keeps the CEO complaint list
 * in sync with active critical issues.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const TEAM_DIR = path.join(REPO_ROOT, 'TEAM');
const ARCHIVE_ROOT = path.join(REPO_ROOT, 'ops', 'complaints', 'archive');
const CEO_COMPLAINT_PATH = path.join(TEAM_DIR, 'CEO', 'complaint.json');

const ISO_NOW = new Date().toISOString();

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) {
    return { complaints: [] };
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const parsed = JSON.parse(raw || '{}');
    if (!Array.isArray(parsed.complaints)) {
      parsed.complaints = [];
    }
    return parsed;
  } catch (err) {
    throw new Error(`Failed to parse JSON from ${filePath}: ${err.message}`);
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function manageComplaints() {
  ensureDir(ARCHIVE_ROOT);

  const teamPods = fs
    .readdirSync(TEAM_DIR)
    .filter((entry) => fs.statSync(path.join(TEAM_DIR, entry)).isDirectory());

  const activeCritical = [];

  for (const pod of teamPods) {
    const complaintPath = path.join(TEAM_DIR, pod, 'complaint.json');
    if (!fs.existsSync(complaintPath)) {
      continue;
    }

    const data = readJsonSafe(complaintPath);
    const remaining = [];
    let changed = false;

    for (const complaint of data.complaints) {
      const status = (complaint.status || '').toLowerCase();
      const severity = (complaint.severity || '').toLowerCase();

      if (status === 'resolved') {
        const archiveDir = path.join(ARCHIVE_ROOT, pod);
        ensureDir(archiveDir);

        const archived = deepClone(complaint);
        if (!Array.isArray(archived.history)) {
          archived.history = [];
        }
        archived.history.push({
          ts: ISO_NOW,
          note: 'Archived to ops/complaints/archive via scripts/manage-complaints.js',
        });
        archived.archived_at = ISO_NOW;
        archived.source_pod = pod;

        const archiveFileName = `${archived.id || `complaint-${ISO_NOW}`}.json`;
        const archivePath = path.join(archiveDir, archiveFileName);
        writeJson(archivePath, archived);
        changed = true;
      } else {
        remaining.push(complaint);
        if (severity === 'critical') {
          activeCritical.push({ pod, complaint });
        }
      }
    }

    if (changed || remaining.length !== data.complaints.length) {
      writeJson(complaintPath, { complaints: remaining });
    }
  }

  const ceoData = readJsonSafe(CEO_COMPLAINT_PATH);
  const seenKeys = new Set();
  const updatedComplaints = [];

  for (const { pod, complaint } of activeCritical) {
    const key = `${pod}::${complaint.id}`;
    seenKeys.add(key);

    const entry = deepClone(complaint);
    entry.source_pod = pod;
    entry.escalated_at = entry.escalated_at || ISO_NOW;

    const existing = (ceoData.complaints || []).find(
      (item) => item.source_pod === pod && item.id === complaint.id
    );

    if (existing && Array.isArray(existing.history)) {
      entry.history = existing.history;
    }
    if (!Array.isArray(entry.history)) {
      entry.history = [];
    }
    const alreadyLogged = entry.history.some((record) => record.note?.includes('Escalated to CEO'));
    if (!alreadyLogged) {
      entry.history.push({
        ts: ISO_NOW,
        note: `Escalated to CEO from ${pod} via scripts/manage-complaints.js`,
      });
    }

    updatedComplaints.push(entry);
  }

  const existingKeys = new Set(
    (ceoData.complaints || []).map((item) => `${item.source_pod}::${item.id}`)
  );

  const keysChanged =
    existingKeys.size !== seenKeys.size ||
    [...existingKeys].some((key) => !seenKeys.has(key));

  if (keysChanged || activeCritical.length > 0 || (ceoData.complaints || []).length > 0) {
    writeJson(CEO_COMPLAINT_PATH, { complaints: updatedComplaints });
  }
}

try {
  manageComplaints();
  console.log('Complaint archive + escalation complete.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}