import httpClient from "../httpClient";

export async function addReview(revieweeId, review) {
  const response = await httpClient.post(
    `/users/${revieweeId}/reviews`,
    review,
    { requiresAuth: true }
  );

  return response.data;
}

export async function fetchMyReview(revieweeId) {
  const response = await httpClient.get(
    `/users/${revieweeId}/reviews/my-review`,
    { requiresAuth: true }
  );

  return response.data;
}

export async function updateMyReview(revieweeId, review) {
  await httpClient.put(`/users/${revieweeId}/reviews/my-review`, review, {
    requiresAuth: true,
  });
}

export async function deleteMyReview(revieweeId) {
  await httpClient.delete(`/users/${revieweeId}/reviews/my-review`, {
    requiresAuth: true,
  });
}
