import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  async addExpense(expense) {
    try {
      const expenseData = {
        ...expense,
        amount: parseFloat(expense.amount),
        date: expense.date || new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp(),
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), expenseData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteExpense(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
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
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    return '';
  }
};