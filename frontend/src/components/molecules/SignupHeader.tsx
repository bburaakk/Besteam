import React from 'react';

const SignupHeader: React.FC = () => {
  return (
    <div className="text-center">
      <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-r from-primary to-primary-600 flex items-center justify-center mb-6 shadow-2xl">
        <span className="text-white text-2xl font-black">Y</span>
      </div>
      
      <h2 className="text-4xl font-black text-gray-900 mb-2">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Yolcu'ya
        </span>{' '}
        Katıl
      </h2>
      
      <p className="text-gray-600 text-lg">
        Kariyerinde zirveye yürümeye başla
      </p>
    </div>
  );
};

export default SignupHeader;
