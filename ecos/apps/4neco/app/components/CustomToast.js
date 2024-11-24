// components/CustomToast.js
import { useState, useEffect } from 'react';

const CustomToast = ({ message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`toast ${type}`}>
      {message}
      <button onClick={() => { setVisible(false); onClose && onClose(); }}>x</button>
    </div>
  );
};

export default CustomToast;
