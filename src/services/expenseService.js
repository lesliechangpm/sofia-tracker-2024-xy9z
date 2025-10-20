import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  getDoc 
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
        ownerId: user.uid, // required for rules
        amount: parseFloat(expense.amount),
        date: expense.date || new Date().toISOString().split('T')[0],
        note: expense.note || '',
        timestamp: serverTimestamp(),
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseData);
      
      // Log activity
      await this.logActivity('add', {
        expenseId: docRef.id,
        description: expense.description,
        amount: expenseData.amount,
        payer: expense.payer,
        date: expense.date
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

      // Get expense details before deletion for history
      const expenseDoc = await getDoc(doc(db, COLLECTION_NAME, id));
      const expenseData = expenseDoc.exists() ? expenseDoc.data() : null;
      
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      
      // Log activity
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

  subscribeToExpenses(callback) {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q, 
      (querySnapshot) => {
        const expenses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          expenses.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
          });
        });
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
    const totals = {
      leslie: 0,
      ian: 0,
      total: 0
    };

    expenses.forEach(expense => {
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
    return expenses.filter(expense => 
      expense.payer?.toLowerCase() === filter.toLowerCase()
    );
  },

  filterByDateRange(expenses, dateRange) {
    if (!dateRange || (!dateRange.start && !dateRange.end)) {
      return expenses;
    }

    return expenses.filter(expense => {
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

      if (dateRange.start && expenseDate < dateRange.start) {
        return false;
      }
      if (dateRange.end && expenseDate > dateRange.end) {
        return false;
      }
      
      return true;
    });
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  formatDate(date) {
    if (!date) return '';
    
    if (date instanceof Date) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    return '';
  },

  exportToCSV(expenses, filterName = 'all') {
    if (!expenses || expenses.length === 0) {
      return null;
    }

    const headers = ['Date', 'Payer', 'Amount', 'Description', 'Note'];
    
    const rows = expenses.map(expense => {
      const date = expense.date || '';
      const formattedDate = typeof date === 'string' && date.includes('-') 
        ? date 
        : this.formatDate(date).replace(',', '');
      
      return [
        formattedDate,
        expense.payer || '',
        expense.amount || 0,
        `"${(expense.description || '').replace(/"/g, '""')}"`,
        `"${(expense.note || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

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
      if (!user) return; // skip logging if not signed in

      const activityData = {
        action,
        details,
        userId: user.uid, // required for rules
        timestamp: serverTimestamp(),
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, HISTORY_COLLECTION), activityData);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  },

  subscribeToActivityHistory(callback) {
    const q = query(
      collection(db, HISTORY_COLLECTION), 
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q, 
      (querySnapshot) => {
        const activities = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          activities.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
          });
        });
        callback(activities);
      },
      (error) => {
        console.error('Error fetching activity history:', error);
        callback([], error);
      }
    );

    return unsubscribe;
  }
};
