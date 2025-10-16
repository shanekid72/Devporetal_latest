import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTerminal from './AnimatedTerminal';

// SplineScene Component
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineRobotHome() {
  const navigate = useNavigate();

  const handleEnterPortal = () => {
    // Navigate to the main API documentation page
    navigate('/portal-overview');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-x-hidden">
      {/* D9 Logo - Top Right */}
      <div className="absolute top-4 right-4 z-30">
        <img 
          src="/d9wplogo.png" 
          alt="Digit9 WorldAPI Logo" 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-36 lg:h-36 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Left Content Section - Full width on mobile, half on desktop */}
      <div className="flex-1 w-full lg:w-1/2 flex flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-16 pt-16 sm:pt-18 md:pt-20 lg:pt-16 pb-6 sm:pb-8 lg:pb-16 min-h-screen">
        
        {/* Grouped: Header + Terminal (centered together) */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Header Section */}
          <div className="max-w-2xl mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 mb-3 sm:mb-4">
              One API
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl font-semibold text-gray-700 mb-4 sm:mb-6">
              Powering Payments Orchestration Worldwide
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 lg:mb-16">
              Build smarter payment journeys collect, convert, and pay with precision and speed.
            </p>
          </div>

          {/* Features Section - Animated Terminal */}
          <div className="max-w-2xl">
            <AnimatedTerminal 
              commands={[
                'npm install @digit9/raas-sdk',
                'import { RaasClient } from "@digit9/raas-sdk"',
                'const client = new RaasClient({ apiKey: "your-api-key" })',
                'const quote = await client.createQuote({ amount: 100, currency: "USD" })',
                'console.log("Quote created:", quote.id)'
              ]}
            />
          </div>
        </div>

        {/* Start Building - Responsive positioning */}
        <div className="max-w-2xl mt-auto lg:absolute lg:bottom-16 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:max-w-sm z-30">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-200 shadow-xl">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
              Start Building
            </h3>
            <button
              onClick={handleEnterPortal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl w-full justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" fill="currentColor" />
              </svg>
              Enter Dev Portal
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Spline 3D Robot Scene - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex flex-1 lg:w-1/2 h-screen relative overflow-visible">
        <div 
          className="absolute inset-0 overflow-visible" 
          style={{ 
            width: '150%', 
            height: '100%',
            transform: 'translateX(-20%)',
            zIndex: 10
          }}
        >
          <Suspense 
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="spline-loader"></div>
              </div>
            }
          >
            <Spline
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              style={{ 
                width: '100%',
                height: '100%',
                background: 'transparent',
                overflow: 'visible',
                position: 'relative',
                zIndex: 10
              }}
            />
          </Suspense>
        </div>
      </div>

      <style>{`
        .spline-loader {
          width: 48px;
          height: 48px;
          border: 5px solid #3B82F6;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Ensure Spline canvas doesn't clip robot hands */
        canvas {
          overflow: visible !important;
          background: transparent !important;
        }
        
        /* Allow robot to extend beyond container boundaries */
        body {
          overflow-x: visible !important;
        }
        
        /* Specific Spline container fixes */
        spline-viewer {
          overflow: visible !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
}
