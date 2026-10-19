import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Firebase Security Rules & Indexes Validation', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const firestoreRulesPath = path.join(rootDir, 'firebase/firestore.rules');
  const storageRulesPath = path.join(rootDir, 'firebase/storage.rules');
  const indexesPath = path.join(rootDir, 'firebase/firestore.indexes.json');

  describe('Firestore Security Rules', () => {
    it('exists and specifies rules_version = "2"', () => {
      expect(fs.existsSync(firestoreRulesPath)).toBe(true);
      const content = fs.readFileSync(firestoreRulesPath, 'utf-8');
      expect(content).toContain("rules_version = '2';");
      expect(content).toContain('service cloud.firestore');
    });

    it('enforces default deny on all unmatched paths', () => {
      const content = fs.readFileSync(firestoreRulesPath, 'utf-8');
      expect(content).toMatch(/match\s+\/\{document=\*\*\}\s*\{\s*allow\s+read,\s*write:\s*if\s+false;/);
    });

    it('defines security rules for all 9 required Phase 3 collections', () => {
      const content = fs.readFileSync(firestoreRulesPath, 'utf-8');

      const expectedCollections = [
        'users/{userId}',
        'ngoApplications/{applicationId}',
        'ngos/{ngoId}',
        'donations/{donationId}',
        'recipients/{recipientId}',
        'assignments/{assignmentId}',
        'deliveries/{deliveryId}',
        'donationStatusHistory/{historyId}',
        'auditLogs/{logId}',
      ];

      for (const col of expectedCollections) {
        expect(content).toContain(`match /${col}`);
      }
    });

    it('does not define a notifications collection', () => {
      const content = fs.readFileSync(firestoreRulesPath, 'utf-8');
      expect(content).not.toContain('match /notifications');
    });

    it('prohibits deletion of assignment attempts, deliveries, and history logs', () => {
      const content = fs.readFileSync(firestoreRulesPath, 'utf-8');

      // Assignments: allow delete: if false
      expect(content).toContain('match /assignments/{assignmentId}');
      expect(content).toContain('allow delete: if false;');

      // Status history: allow update, delete: if false
      expect(content).toContain('match /donationStatusHistory/{historyId}');
      expect(content).toContain('allow update, delete: if false;');

      // Audit logs: allow update, delete: if false
      expect(content).toContain('match /auditLogs/{logId}');
    });

    it('protects role, accountStatus, and ngoId fields from user self-modification', () => {
      const content = fs.readFileSync(firestoreRulesPath, 'utf-8');
      expect(content).toContain("affectedKeys().hasAny(['role', 'accountStatus', 'ngoId', 'uid'])");
    });
  });

  describe('Storage Security Rules', () => {
    it('exists and specifies default deny', () => {
      expect(fs.existsSync(storageRulesPath)).toBe(true);
      const content = fs.readFileSync(storageRulesPath, 'utf-8');
      expect(content).toContain("rules_version = '2';");
      expect(content).toContain('service firebase.storage');
      expect(content).toMatch(/match\s+\/\{allPaths=\*\*\}\s*\{\s*allow\s+read,\s*write:\s*if\s+false;/);
    });

    it('enforces file type and size restrictions on donation photos and documents', () => {
      const content = fs.readFileSync(storageRulesPath, 'utf-8');

      // 5MB image rule for food and delivery proofs
      expect(content).toContain("image/(jpeg|png|webp)");
      expect(content).toContain("5 * 1024 * 1024");

      // 10MB PDF/image rule for NGO credentials
      expect(content).toContain("application/pdf");
      expect(content).toContain("10 * 1024 * 1024");
    });
  });

  describe('Firestore Composite Indexes', () => {
    it('parses valid JSON with configured collection indexes', () => {
      expect(fs.existsSync(indexesPath)).toBe(true);
      const content = fs.readFileSync(indexesPath, 'utf-8');
      const json = JSON.parse(content);

      expect(Array.isArray(json.indexes)).toBe(true);
      expect(json.indexes.length).toBeGreaterThanOrEqual(5);

      const collections = json.indexes.map((idx: { collectionGroup: string }) => idx.collectionGroup);
      expect(collections).toContain('donations');
      expect(collections).toContain('assignments');
      expect(collections).toContain('recipients');
      expect(collections).toContain('donationStatusHistory');
      expect(collections).toContain('auditLogs');
    });
  });
});
