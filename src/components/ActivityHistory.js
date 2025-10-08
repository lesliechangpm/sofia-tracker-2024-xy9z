import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import Modal from './Modal';

const ActivityHistory = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = expenseService.subscribeToActivityHistory((activityData, error) => {
      if (error) {
        console.error('Failed to load activity history:', error);
        setActivities([]);
      } else {
        setActivities(activityData);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'add':
        return '➕';
      case 'delete':
        return '🗑️';
      case 'update':
        return '✏️';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'add':
        return 'text-green-600';
      case 'delete':
        return 'text-red-600';
      case 'update':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionDescription = (activity) => {
    const { action, details } = activity;
    const amount = details?.amount ? expenseService.formatCurrency(details.amount) : '';
    
    switch (action) {
      case 'add':
        return (
          <>
            Added expense: <strong>{details?.description}</strong> for {amount} 
            {details?.payer && <> (paid by {details.payer})</>}
          </>
        );
      case 'delete':
        return (
          <>
            Deleted expense: <strong>{details?.description}</strong> for {amount}
            {details?.payer && <> (was paid by {details.payer})</>}
          </>
        );
      case 'update':
        return (
          <>
            Updated expense: <strong>{details?.description}</strong>
          </>
        );
      default:
        return 'Unknown action';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activity History">
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cal-poly-forest"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No activity history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl mt-1">{getActionIcon(activity.action)}</span>
                <div className="flex-grow">
                  <p className={`text-sm ${getActionColor(activity.action)}`}>
                    {getActionDescription(activity)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Activity history shows all changes made to expenses for transparency and audit purposes
        </p>
      </div>
    </Modal>
  );
};

export default ActivityHistory;