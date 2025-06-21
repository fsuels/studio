// Firestore Integration for A/B Testing System
// Complete data persistence layer with real-time synchronization

import React from 'react';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  type Experiment,
  type ExperimentResults,
  type ExperimentEvent,
} from './experiment-engine';
import {
  type MonitoringAlert,
  type ExperimentHealth,
} from './monitoring-service';
import {
  type AutomationRule,
  type AutomationPolicy,
  type ExperimentQueue,
} from './automation-engine';

// Collection names
const COLLECTIONS = {
  EXPERIMENTS: 'ab_experiments',
  EXPERIMENT_EVENTS: 'ab_experiment_events',
  EXPERIMENT_RESULTS: 'ab_experiment_results',
  MONITORING_ALERTS: 'ab_monitoring_alerts',
  EXPERIMENT_HEALTH: 'ab_experiment_health',
  AUTOMATION_RULES: 'ab_automation_rules',
  AUTOMATION_POLICY: 'ab_automation_policy',
  EXPERIMENT_QUEUE: 'ab_experiment_queue',
  USER_ASSIGNMENTS: 'ab_user_assignments',
  GROWTH_METRICS: 'ab_growth_metrics',
} as const;

// Firestore document interfaces
interface FirestoreExperiment
  extends Omit<Experiment, 'createdAt' | 'updatedAt'> {
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

interface FirestoreExperimentEvent extends Omit<ExperimentEvent, 'eventData'> {
  eventData: {
    metric: string;
    value: number;
    timestamp: any; // Firestore Timestamp
    metadata?: Record<string, any>;
  };
}

interface UserAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: any; // Firestore Timestamp
  deviceId?: string;
  sessionId?: string;
}

interface GrowthMetricsSnapshot {
  date: string;
  timeframe: '24h' | '7d' | '30d';
  totalRevenue: number;
  revenueImpact: number;
  conversionLift: number;
  experimentsRunning: number;
  experimentsCompleted: number;
  statisticallySignificantWins: number;
  createdAt: any; // Firestore Timestamp
}

class FirestoreABTestingService {
  // Experiment Management
  async saveExperiment(experiment: Experiment): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENTS, experiment.id);
    const firestoreDoc: FirestoreExperiment = {
      ...experiment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, firestoreDoc);
  }

  async getExperiment(experimentId: string): Promise<Experiment | null> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENTS, experimentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as FirestoreExperiment;
    return {
      ...data,
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt:
        data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  }

  async updateExperiment(
    experimentId: string,
    updates: Partial<Experiment>,
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENTS, experimentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteExperiment(experimentId: string): Promise<void> {
    const batch = writeBatch(db);

    // Delete experiment
    const experimentRef = doc(db, COLLECTIONS.EXPERIMENTS, experimentId);
    batch.delete(experimentRef);

    // Delete related events
    const eventsQuery = query(
      collection(db, COLLECTIONS.EXPERIMENT_EVENTS),
      where('experimentId', '==', experimentId),
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    eventsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // Delete results
    const resultsRef = doc(db, COLLECTIONS.EXPERIMENT_RESULTS, experimentId);
    batch.delete(resultsRef);

    // Delete user assignments
    const assignmentsQuery = query(
      collection(db, COLLECTIONS.USER_ASSIGNMENTS),
      where('experimentId', '==', experimentId),
    );
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    assignmentsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
  }

  async getAllExperiments(): Promise<Experiment[]> {
    const q = query(
      collection(db, COLLECTIONS.EXPERIMENTS),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreExperiment;
      return {
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  }

  async getRunningExperiments(): Promise<Experiment[]> {
    const q = query(
      collection(db, COLLECTIONS.EXPERIMENTS),
      where('status', '==', 'running'),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreExperiment;
      return {
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  }

  async getExperimentsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Experiment[]> {
    const q = query(
      collection(db, COLLECTIONS.EXPERIMENTS),
      where('createdAt', '>=', new Date(startDate)),
      where('createdAt', '<=', new Date(endDate)),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreExperiment;
      return {
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  }

  // Event Tracking
  async trackEvent(event: ExperimentEvent): Promise<void> {
    const docRef = doc(collection(db, COLLECTIONS.EXPERIMENT_EVENTS));
    const firestoreEvent: FirestoreExperimentEvent = {
      ...event,
      eventData: {
        ...event.eventData,
        timestamp: serverTimestamp(),
      },
    };

    await setDoc(docRef, firestoreEvent);

    // Update experiment statistics in real-time
    await this.updateExperimentStatistics(
      event.experimentId,
      event.variantId,
      event.eventType,
    );
  }

  private async updateExperimentStatistics(
    experimentId: string,
    variantId: string,
    eventType: string,
  ): Promise<void> {
    const experimentRef = doc(db, COLLECTIONS.EXPERIMENTS, experimentId);

    // Increment counters based on event type
    const updates: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (eventType === 'assignment') {
      updates[`statistics.${variantId}.assignments`] = increment(1);
    } else if (eventType === 'conversion') {
      updates[`statistics.${variantId}.conversions`] = increment(1);
    }

    await updateDoc(experimentRef, updates);
  }

  async getExperimentEvents(
    experimentId: string,
    variantId?: string,
    eventType?: string,
    limitCount = 1000,
  ): Promise<ExperimentEvent[]> {
    let q = query(
      collection(db, COLLECTIONS.EXPERIMENT_EVENTS),
      where('experimentId', '==', experimentId),
      orderBy('eventData.timestamp', 'desc'),
      limit(limitCount),
    );

    if (variantId) {
      q = query(q, where('variantId', '==', variantId));
    }

    if (eventType) {
      q = query(q, where('eventType', '==', eventType));
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreExperimentEvent;
      return {
        ...data,
        eventData: {
          ...data.eventData,
          timestamp:
            data.eventData.timestamp?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        },
      };
    });
  }

  // User Assignment Management
  async assignUserToExperiment(
    userId: string,
    experimentId: string,
    variantId: string,
    deviceId?: string,
    sessionId?: string,
  ): Promise<void> {
    const docId = `${userId}_${experimentId}`;
    const docRef = doc(db, COLLECTIONS.USER_ASSIGNMENTS, docId);

    const assignment: UserAssignment = {
      userId,
      experimentId,
      variantId,
      assignedAt: serverTimestamp(),
      deviceId,
      sessionId,
    };

    await setDoc(docRef, assignment);
  }

  async getUserAssignment(
    userId: string,
    experimentId: string,
  ): Promise<string | null> {
    const docId = `${userId}_${experimentId}`;
    const docRef = doc(db, COLLECTIONS.USER_ASSIGNMENTS, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as UserAssignment;
    return data.variantId;
  }

  async getUserExperiments(userId: string): Promise<Record<string, string>> {
    const q = query(
      collection(db, COLLECTIONS.USER_ASSIGNMENTS),
      where('userId', '==', userId),
    );
    const querySnapshot = await getDocs(q);

    const assignments: Record<string, string> = {};
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data() as UserAssignment;
      assignments[data.experimentId] = data.variantId;
    });

    return assignments;
  }

  // Results Storage
  async saveExperimentResults(
    experimentId: string,
    results: ExperimentResults,
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENT_RESULTS, experimentId);
    await setDoc(docRef, {
      ...results,
      updatedAt: serverTimestamp(),
    });
  }

  async getExperimentResults(
    experimentId: string,
  ): Promise<ExperimentResults | null> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENT_RESULTS, experimentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as ExperimentResults;
  }

  // Monitoring and Alerts
  async saveAlert(alert: MonitoringAlert): Promise<void> {
    const docRef = doc(db, COLLECTIONS.MONITORING_ALERTS, alert.id);
    await setDoc(docRef, {
      ...alert,
      createdAt: serverTimestamp(),
    });
  }

  async getUnacknowledgedAlerts(): Promise<MonitoringAlert[]> {
    const q = query(
      collection(db, COLLECTIONS.MONITORING_ALERTS),
      where('acknowledged', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as MonitoringAlert;
    });
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.MONITORING_ALERTS, alertId);
    await updateDoc(docRef, {
      acknowledged: true,
      acknowledgedAt: serverTimestamp(),
    });
  }

  async saveExperimentHealth(health: ExperimentHealth): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENT_HEALTH, health.experimentId);
    await setDoc(docRef, {
      ...health,
      lastChecked: serverTimestamp(),
    });
  }

  async getExperimentHealth(
    experimentId: string,
  ): Promise<ExperimentHealth | null> {
    const docRef = doc(db, COLLECTIONS.EXPERIMENT_HEALTH, experimentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      ...data,
      lastChecked:
        data.lastChecked?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as ExperimentHealth;
  }

  async getAllExperimentHealth(): Promise<ExperimentHealth[]> {
    const q = query(
      collection(db, COLLECTIONS.EXPERIMENT_HEALTH),
      orderBy('lastChecked', 'desc'),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        lastChecked:
          data.lastChecked?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      } as ExperimentHealth;
    });
  }

  // Automation Configuration
  async saveAutomationRules(rules: AutomationRule[]): Promise<void> {
    const batch = writeBatch(db);

    rules.forEach((rule) => {
      const docRef = doc(db, COLLECTIONS.AUTOMATION_RULES, rule.id);
      batch.set(docRef, {
        ...rule,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    const q = query(collection(db, COLLECTIONS.AUTOMATION_RULES));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as AutomationRule);
  }

  async saveAutomationPolicy(policy: AutomationPolicy): Promise<void> {
    const docRef = doc(db, COLLECTIONS.AUTOMATION_POLICY, 'default');
    await setDoc(docRef, {
      ...policy,
      updatedAt: serverTimestamp(),
    });
  }

  async getAutomationPolicy(): Promise<AutomationPolicy | null> {
    const docRef = doc(db, COLLECTIONS.AUTOMATION_POLICY, 'default');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as AutomationPolicy;
  }

  // Experiment Queue
  async saveExperimentQueue(queue: ExperimentQueue[]): Promise<void> {
    const batch = writeBatch(db);

    // Clear existing queue
    const existingQuery = query(collection(db, COLLECTIONS.EXPERIMENT_QUEUE));
    const existingSnapshot = await getDocs(existingQuery);
    existingSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // Add new queue items
    queue.forEach((item) => {
      const docRef = doc(collection(db, COLLECTIONS.EXPERIMENT_QUEUE));
      batch.set(docRef, {
        ...item,
        createdAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  async getExperimentQueue(): Promise<ExperimentQueue[]> {
    const q = query(
      collection(db, COLLECTIONS.EXPERIMENT_QUEUE),
      orderBy('priority', 'desc'),
      orderBy('scheduledStart', 'asc'),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as ExperimentQueue);
  }

  // Growth Metrics Storage
  async saveGrowthMetricsSnapshot(
    timeframe: '24h' | '7d' | '30d',
    metrics: {
      totalRevenue: number;
      revenueImpact: number;
      conversionLift: number;
      experimentsRunning: number;
      experimentsCompleted: number;
      statisticallySignificantWins: number;
    },
  ): Promise<void> {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const docId = `${date}_${timeframe}`;
    const docRef = doc(db, COLLECTIONS.GROWTH_METRICS, docId);

    const snapshot: GrowthMetricsSnapshot = {
      date,
      timeframe,
      ...metrics,
      createdAt: serverTimestamp(),
    };

    await setDoc(docRef, snapshot);
  }

  async getGrowthMetricsHistory(
    timeframe: '24h' | '7d' | '30d',
    days = 30,
  ): Promise<GrowthMetricsSnapshot[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const q = query(
      collection(db, COLLECTIONS.GROWTH_METRICS),
      where('timeframe', '==', timeframe),
      where('date', '>=', startDateStr),
      orderBy('date', 'desc'),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as GrowthMetricsSnapshot;
    });
  }

  // Real-time Subscriptions
  subscribeToExperiment(
    experimentId: string,
    callback: (experiment: Experiment | null) => void,
  ): () => void {
    const docRef = doc(db, COLLECTIONS.EXPERIMENTS, experimentId);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as FirestoreExperiment;
        callback({
          ...data,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
          updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        });
      } else {
        callback(null);
      }
    });
  }

  subscribeToExperimentResults(
    experimentId: string,
    callback: (results: ExperimentResults | null) => void,
  ): () => void {
    const docRef = doc(db, COLLECTIONS.EXPERIMENT_RESULTS, experimentId);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as ExperimentResults);
      } else {
        callback(null);
      }
    });
  }

  subscribeToAlerts(callback: (alerts: MonitoringAlert[]) => void): () => void {
    const q = query(
      collection(db, COLLECTIONS.MONITORING_ALERTS),
      where('acknowledged', '==', false),
      orderBy('createdAt', 'desc'),
      limit(20),
    );

    return onSnapshot(q, (querySnapshot) => {
      const alerts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        } as MonitoringAlert;
      });
      callback(alerts);
    });
  }

  // Batch Operations
  async bulkUpdateExperiments(
    updates: Array<{ id: string; data: Partial<Experiment> }>,
  ): Promise<void> {
    const batch = writeBatch(db);

    updates.forEach(({ id, data }) => {
      const docRef = doc(db, COLLECTIONS.EXPERIMENTS, id);
      batch.update(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  }

  async bulkTrackEvents(events: ExperimentEvent[]): Promise<void> {
    const batch = writeBatch(db);

    events.forEach((event) => {
      const docRef = doc(collection(db, COLLECTIONS.EXPERIMENT_EVENTS));
      const firestoreEvent: FirestoreExperimentEvent = {
        ...event,
        eventData: {
          ...event.eventData,
          timestamp: serverTimestamp(),
        },
      };
      batch.set(docRef, firestoreEvent);
    });

    await batch.commit();
  }

  // Data Export/Import
  async exportAllData(): Promise<{
    experiments: Experiment[];
    events: ExperimentEvent[];
    results: ExperimentResults[];
    alerts: MonitoringAlert[];
    automationRules: AutomationRule[];
    automationPolicy: AutomationPolicy | null;
  }> {
    const [
      experiments,
      events,
      results,
      alerts,
      automationRules,
      automationPolicy,
    ] = await Promise.all([
      this.getAllExperiments(),
      this.getAllEvents(),
      this.getAllResults(),
      this.getAllAlerts(),
      this.getAutomationRules(),
      this.getAutomationPolicy(),
    ]);

    return {
      experiments,
      events,
      results,
      alerts,
      automationRules,
      automationPolicy,
    };
  }

  private async getAllEvents(): Promise<ExperimentEvent[]> {
    const q = query(
      collection(db, COLLECTIONS.EXPERIMENT_EVENTS),
      limit(10000),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreExperimentEvent;
      return {
        ...data,
        eventData: {
          ...data.eventData,
          timestamp:
            data.eventData.timestamp?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        },
      };
    });
  }

  private async getAllResults(): Promise<ExperimentResults[]> {
    const q = query(collection(db, COLLECTIONS.EXPERIMENT_RESULTS));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as ExperimentResults);
  }

  private async getAllAlerts(): Promise<MonitoringAlert[]> {
    const q = query(collection(db, COLLECTIONS.MONITORING_ALERTS), limit(1000));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as MonitoringAlert;
    });
  }
}

// Singleton instance
export const firestoreABTesting = new FirestoreABTestingService();

// React hooks for real-time data
export function useFirestoreExperiment(experimentId: string) {
  const [experiment, setExperiment] = React.useState<Experiment | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = firestoreABTesting.subscribeToExperiment(
      experimentId,
      (exp) => {
        setExperiment(exp);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [experimentId]);

  return { experiment, loading };
}

export function useFirestoreExperimentResults(experimentId: string) {
  const [results, setResults] = React.useState<ExperimentResults | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = firestoreABTesting.subscribeToExperimentResults(
      experimentId,
      (res) => {
        setResults(res);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [experimentId]);

  return { results, loading };
}

export function useFirestoreAlerts() {
  const [alerts, setAlerts] = React.useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = firestoreABTesting.subscribeToAlerts((alertList) => {
      setAlerts(alertList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { alerts, loading };
}

export { COLLECTIONS };
