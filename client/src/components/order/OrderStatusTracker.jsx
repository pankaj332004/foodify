import { Package, ChefHat, Bike, CheckCircle2 } from 'lucide-react';

const OrderStatusTracker = ({ currentStep, status }) => {
    return (
        <>
            <div className="relative flex justify-between max-w-lg mx-auto mb-10">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden sm:block"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 hidden sm:block transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>

                {/* Step 1: Placed */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 0 ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                        <Package className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide text-center ${currentStep >= 0 ? 'text-gray-900' : 'text-gray-400'}`}>Placed</span>
                </div>

                {/* Step 2: Preparing */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 1 ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                        <ChefHat className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide text-center ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Preparing</span>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 2 ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                        <Bike className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide text-center ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>On the way</span>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= 3 ? 'bg-green-500 text-white shadow-md shadow-green-500/30' : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide text-center ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>Delivered</span>
                </div>
            </div>
            <div className="text-center bg-orange-50 text-orange-800 p-4 rounded-xl text-sm font-medium">
                Current Status: <span className="font-bold uppercase ml-1">{status?.replace(/_/g, ' ')}</span>
            </div>
        </>
    );
};

export default OrderStatusTracker;
