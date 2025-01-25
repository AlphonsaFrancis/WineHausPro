  export const getReviewById = (reviewId, reviewData = []) => {
    console.log("reviewId",reviewId)
    if (!Array.isArray(reviewData)) {
      throw new Error("reviewData must be an array");
    }
    const filteredReviews = reviewData.filter(
      (item) => item?.id === reviewId
    );

    return filteredReviews.length > 0 ? filteredReviews[0] : null;
  };

  export const getReviewForOrder = (orderId, reviewData = []) => {
    if (!Array.isArray(reviewData)) {
      throw new Error("reviewData must be an array");
    }
  
    // Return all reviews matching the given orderId
    return reviewData.filter((item) => item?.order_id === orderId);
  };
  
