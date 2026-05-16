import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantReviews } from '../../features/review/reviewThunk';
import { clearReviews } from '../../features/review/reviewSlice';
import { Star, MessageSquare, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewSection = ({ restaurant }) => {
    const dispatch = useDispatch();
    const { reviews, total, isLoading } = useSelector(state => state.review);

    useEffect(() => {
        if (restaurant?._id) {
            dispatch(fetchRestaurantReviews({ restaurantId: restaurant._id, page: 1, limit: 10 }));
        }
        return () => {
            dispatch(clearReviews());
        };
    }, [dispatch, restaurant?._id]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                Reviews & Ratings
            </h2>

            {isLoading && reviews.length === 0 ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Be the first to review {restaurant?.name || 'this restaurant'}! Order now and share your experience.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                        <div className="text-4xl font-black text-orange-600">{averageRating}</div>
                        <div>
                            <div className="flex text-yellow-500 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <div className="text-sm font-bold text-gray-600">Based on {total} reviews</div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {review.customer?.profileImage ? (
                                                <img src={review.customer.profileImage} alt={review.customer.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{review.customer?.name || 'Anonymous User'}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                                        <span className="text-sm font-bold text-green-700 mr-1">{review.rating}</span>
                                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
