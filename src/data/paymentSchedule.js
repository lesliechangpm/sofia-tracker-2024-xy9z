// Cal Poly Payment Schedule for 2025-2026 Academic Year
export const calPolyPaymentSchedule = [
  {
    date: "10/1/2025",
    description: "Dining",
    amount: 710.00
  },
  {
    date: "10/1/2025",
    description: "Housing",
    amount: 1439.00
  },
  {
    date: "11/1/2025",
    description: "Dining",
    amount: 755.00
  },
  {
    date: "11/1/2025",
    description: "Housing",
    amount: 1439.00
  },
  {
    date: "12/1/2025",
    description: "Dining",
    amount: 755.00
  },
  {
    date: "12/1/2025",
    description: "Housing",
    amount: 1253.00
  },
  {
    date: "1/1/2026",
    description: "Dining",
    amount: 755.00
  },
  {
    date: "1/1/2026",
    description: "Housing",
    amount: 1253.00
  },
  {
    date: "2/1/2026",
    description: "Dining",
    amount: 755.00
  },
  {
    date: "2/1/2026",
    description: "Housing",
    amount: 1253.00
  },
  {
    date: "3/1/2026",
    description: "Dining",
    amount: 755.00
  },
  {
    date: "3/1/2026",
    description: "Housing",
    amount: 1238.00
  },
  {
    date: "4/1/2026",
    description: "Dining",
    amount: 755.00
  },
  {
    date: "4/1/2026",
    description: "Housing",
    amount: 1238.00
  }
];

// Helper function to get next payments due
export const getNextPaymentsDue = () => {
  const today = new Date();
  
  // Convert payment dates to Date objects and filter future payments
  const futurePayments = calPolyPaymentSchedule
    .map(payment => ({
      ...payment,
      dateObj: new Date(payment.date)
    }))
    .filter(payment => payment.dateObj > today)
    .sort((a, b) => a.dateObj - b.dateObj);
  
  if (futurePayments.length === 0) {
    return [];
  }
  
  // Get the earliest due date
  const nextDueDate = futurePayments[0].dateObj;
  
  // Return all payments due on that earliest date
  return futurePayments.filter(payment => 
    payment.dateObj.toDateString() === nextDueDate.toDateString()
  );
};

// Helper function to calculate days until next payment
export const getDaysUntilNextPayment = () => {
  const nextPayments = getNextPaymentsDue();
  if (nextPayments.length === 0) return 0;
  
  const today = new Date();
  const nextDate = nextPayments[0].dateObj;
  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};