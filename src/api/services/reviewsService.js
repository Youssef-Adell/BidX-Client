import apiClient from "../apiClient";

export async function addReview(revieweeId, review) {
  try {
    const response = await apiClient.post(
      `/users/${revieweeId}/reviews`,
      review,
      { requiresAuth: true }
    );

    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}

export async function fetchMyReview(revieweeId) {
  try {
    const response = await apiClient.get(
      `/users/${revieweeId}/reviews/my-review`,
      { requiresAuth: true }
    );

    return response.data;
  } catch (errorResponse) {
    throw errorResponse;
  }
}

export async function updateMyReview(revieweeId, review) {
  try {
    await apiClient.put(`/users/${revieweeId}/reviews/my-review`, review, {
      requiresAuth: true,
    });
  } catch (errorResponse) {
    throw errorResponse;
  }
}

export async function deleteMyReview(revieweeId) {
  try {
    await apiClient.delete(`/users/${revieweeId}/reviews/my-review`, {
      requiresAuth: true,
    });
  } catch (errorResponse) {
    throw errorResponse;
  }
}
