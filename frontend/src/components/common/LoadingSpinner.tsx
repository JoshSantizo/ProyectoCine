import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const spinnerSize = size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px';
  return (
    <div style={{ border: `2px solid #f3f3f3`, borderTop: `2px solid #3498db`, borderRadius: '50%', width: spinnerSize, height: spinnerSize, animation: 'spin 2s linear infinite' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;