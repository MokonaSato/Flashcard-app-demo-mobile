import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-red-500 text-lg">{message}</p>
    </div>
  );
};

export default ErrorDisplay;