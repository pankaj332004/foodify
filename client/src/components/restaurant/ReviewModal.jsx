import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../features/review/reviewThunk';
import { Star, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, order }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !order) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            return toast.error("Please provide an overall rating.");
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('orderId', order._id);
            formData.append('rating', rating);
            formData.append('foodRating', foodRating || rating);
            formData.append('deliveryRating', deliveryRating || rating);
            formData.append('comment', comment);

            await dispatch(createReview(formData)).unwrap();

            toast.success("Review submitted successfully! Thank you.");
            onClose();
        } catch (err) {
            toast.error(err || "Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (value, onChange, label) => (
        <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`p-1 transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                        <Star className={`w-8 h-8 ${star <= value ? 'fill-current' : ''}`} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8">
                    <div className="mb-6 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⭐</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Rate your order</h2>
                        <p className="text-gray-500 mt-1">from {order.restaurant?.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {renderStars(rating, setRating, "Overall Rating")}

                        <div className="grid grid-cols-2 gap-4">
                            {renderStars(foodRating, setFoodRating, "Food Quality")}
                            {renderStars(deliveryRating, setDeliveryRating, "Delivery Experience")}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Write a review (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                placeholder="What did you like or dislike?"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none shadow-sm"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
