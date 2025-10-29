// src/services/expenseService.js
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  getDoc,
  where
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';

const auth = getAuth();

const COLLECTION_NAME = 'expenses';
const HISTORY_COLLECTION = 'activity_history';

export const expenseService = {
  async addExpense(expense) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');

      const expenseData = {
        ...expense,
        amount: parseFloat(expense.amount),
        date: expense.date || new Date().toISOString().split('T')[0],
        note: expense.note || '',
        timestamp: serverTimestamp(), // for ordering
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseData);

      // Log activity
      await this.logActivity('add', {
        expenseId: docRef.id,
        description: expense.description,
        amount: expenseData.amount,
        payer: expense.payer,
        date: expenseData.date
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteExpense(id) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');

      // Read before delete so we can log it
      const expenseDoc = await getDoc(doc(db, COLLECTION_NAME, id));
      const expenseData = expenseDoc.exists() ? expenseDoc.data() : null;

      await deleteDoc(doc(db, COLLECTION_NAME, id));

      if (expenseData) {
        await this.logActivity('delete', {
          expenseId: id,
          description: expenseData.description,
          amount: expenseData.amount,
          payer: expenseData.payer,
          date: expenseData.date
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: error.message };
    }
  },

  // Shared subscription for all users - everyone sees the same expenses
  subscribeToExpenses(userId, callback) {
    const q = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const expenses = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();

          // Normalize a JS Date for sorting
          let ts;
          if (data.timestamp && typeof data.timestamp.toDate === 'function') {
            ts = data.timestamp.toDate();
          } else if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            ts = data.createdAt.toDate();
          } else if (typeof data.date === 'string') {
            const [y, m, d] = data.date.split('-').map(Number);
            ts = new Date(y, (m || 1) - 1, d || 1);
          } else {
            ts = new Date();
          }

          expenses.push({
            id: docSnap.id,
            ...data,
            timestamp: ts
          });
        });

        // Newest first (client-side sort)
        expenses.sort((a, b) => (b.timestamp?.getTime?.() ?? 0) - (a.timestamp?.getTime?.() ?? 0));

        callback(expenses);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        callback([], error);
      }
    );

    return unsubscribe;
  },

  calculateTotals(expenses) {
    const totals = { leslie: 0, ian: 0, total: 0 };

    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount) || 0;
      totals.total += amount;

      if (expense.payer?.toLowerCase() === 'leslie') {
        totals.leslie += amount;
      } else if (expense.payer?.toLowerCase() === 'ian') {
        totals.ian += amount;
      }
    });

    totals.lesliePercentage = totals.total > 0 ? (totals.leslie / totals.total * 100).toFixed(1) : 0;
    totals.ianPercentage = totals.total > 0 ? (totals.ian / totals.total * 100).toFixed(1) : 0;

    const halfTotal = totals.total / 2;
    totals.leslieOwes = Math.max(0, halfTotal - totals.leslie);
    totals.ianOwes = Math.max(0, halfTotal - totals.ian);

    return totals;
  },

  filterExpenses(expenses, filter) {
    if (filter === 'all') return expenses;
    return expenses.filter((expense) => expense.payer?.toLowerCase() === filter.toLowerCase());
  },

  filterByDateRange(expenses, dateRange) {
    if (!dateRange || (!dateRange.start && !dateRange.end)) return expenses;

    return expenses.filter((expense) => {
      if (!expense.date) return false;

      let expenseDate;
      if (typeof expense.date === 'string') {
        const [year, month, day] = expense.date.split('-').map(Number);
        expenseDate = new Date(year, month - 1, day);
      } else if (expense.date instanceof Date) {
        expenseDate = expense.date;
      } else {
        return false;
      }

      if (dateRange.start && expenseDate < dateRange.start) return false;
      if (dateRange.end && expenseDate > dateRange.end) return false;
      return true;
    });
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  },

  formatDate(date) {
    if (!date) return '';

    if (date instanceof Date) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return '';
  },

  exportToCSV(expenses, filterName = 'all') {
    if (!expenses || expenses.length === 0) return null;

    const headers = ['Date', 'Payer', 'Amount', 'Description', 'Note'];

    const rows = expenses.map((expense) => {
      const date = expense.date || '';
      const formattedDate =
        typeof date === 'string' && date.includes('-') ? date : this.formatDate(date).replace(',', '');

      return [
        formattedDate,
        expense.payer || '',
        expense.amount || 0,
        `"${(expense.description || '').replace(/"/g, '""')}"`,
        `"${(expense.note || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().split('T')[0];
    const filterSuffix = filterName === 'all' ? 'all' : filterName.toLowerCase();
    const fileName = `sofia-expenses-${filterSuffix}-${today}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  },

  async logActivity(action, details) {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const activityData = {
        action,
        details,
        timestamp: serverTimestamp(),
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, HISTORY_COLLECTION), activityData);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  },

  // Shared activity history for all users
  subscribeToActivityHistory(userIdOrCallback, maybeCallback) {
    let callback;

    // Support both subscribeToActivityHistory(uid, cb) and subscribeToActivityHistory(cb)
    if (typeof userIdOrCallback === 'function') {
      callback = userIdOrCallback;
    } else {
      callback = maybeCallback;
    }

    const q = collection(db, HISTORY_COLLECTION);

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const activities = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          activities.push({
            id: docSnap.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
          });
        });
        if (typeof callback === 'function') callback(activities);
      },
      (error) => {
        console.error('Error fetching activity history:', error);
        if (typeof callback === 'function') callback([], error);
      }
    );

    return unsubscribe;
  }
};
