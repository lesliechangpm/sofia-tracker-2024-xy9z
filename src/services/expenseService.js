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
import { db } from '../config/firebase';

const COLLECTION_NAME = 'expenses';
const HISTORY_COLLECTION = 'activity_history';

export const expenseService = {
  async addExpense(expense) {
    try {
      const expenseData = {
        ...expense,
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
        // Parse YYYY-MM-DD format correctly
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
      // Parse YYYY-MM-DD format correctly to avoid timezone issues
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

    // CSV headers
    const headers = ['Date', 'Payer', 'Amount', 'Description', 'Note'];
    
    // Convert expenses to CSV rows
    const rows = expenses.map(expense => {
      const date = expense.date || '';
      const formattedDate = typeof date === 'string' && date.includes('-') 
        ? date 
        : this.formatDate(date).replace(',', '');
      
      return [
        formattedDate,
        expense.payer || '',
        expense.amount || 0,
        `"${(expense.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
        `"${(expense.note || '').replace(/"/g, '""')}"` // Escape quotes in note
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with date and filter
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
      const activityData = {
        action,
        details,
        timestamp: serverTimestamp(),
        createdAt: Timestamp.now(),
        user: 'Current User' // You can enhance this with actual user tracking
      };
      
      await addDoc(collection(db, HISTORY_COLLECTION), activityData);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't fail the main operation if logging fails
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