import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CollapsibleWidgetProps {
  title: string;
  children: ReactNode;
}

const CollapsibleWidget: React.FC<CollapsibleWidgetProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full mb-4">
      <button
        className="w-full text-left text-lg font-semibold text-gray-800 bg-gray-200 p-2 rounded-md cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-300"
        onClick={toggleOpen}
      >
        {title}
        <span className={`float-right transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        {isOpen && <div className="mt-2 p-4 bg-white border rounded-md">{children}</div>}
      </motion.div>
    </div>
  );
};

export default CollapsibleWidget;