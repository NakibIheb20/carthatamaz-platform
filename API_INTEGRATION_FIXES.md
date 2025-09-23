# API Integration Fixes

## Overview
This document summarizes the changes made to fix the API integration issues between the frontend and backend of the CarthaTamaz platform.

## Fixed Endpoints

### Guesthouse Endpoints
- Changed `/api/guesthouses` to `/api/guest/guesthouses` for GET operations
- Changed `/api/guesthouses/{id}` to `/api/guest/guesthouses/{id}` for GET operations
- Changed `/api/guesthouses` to `/api/owner/guesthouses` for POST operations
- Changed `/api/guesthouses/{id}` to `/api/owner/guesthouses/{id}` for PUT/DELETE operations

### Reservation Endpoints
- Changed `/api/reservations` to `/api/guest/reservations` for GET/POST operations
- Changed `/api/reservations/{id}` to `/api/guest/reservations/{id}` for GET/PUT operations
- Added proper endpoints for owner operations:
  - `/api/owner/reservations` for getting owner's reservations
  - `/api/owner/guesthouses/{id}/reservations` for getting guesthouse reservations
  - `/api/owner/reservations/{id}/confirm` for confirming reservations
  - `/api/owner/reservations/{id}/reject` for rejecting reservations
- Added proper endpoint for cancellation: `/api/guest/reservations/{id}/cancel`

### Message Endpoints
- Kept `/api/messages` for basic operations
- Added specialized endpoints:
  - `/api/messages/sent` for sent messages
  - `/api/messages/received` for received messages
  - `/api/messages/unread` for unread messages
  - `/api/messages/unread/count` for unread message count
  - `/api/messages/{id}/read` for marking messages as read
  - `/api/messages/conversations` for getting all conversations
  - `/api/messages/conversations/{otherUserId}` for getting a specific conversation
  - `/api/messages/with/{otherUserId}` for getting messages with a specific user
  - `/api/messages/conversations/{id}/read` for marking conversations as read
  - `/api/guest/messages/to-owner/{ownerId}` for guests sending messages to owners
  - `/api/owner/messages/to-guest/{guestId}` for owners sending messages to guests

### Authentication Endpoints
- Simplified login implementation to use `/api/auth/login` with correct payload
- Kept `/api/auth/register` for registration
- Kept `/api/auth/logout` for logout
- Added `/api/auth/forgot-password` for password recovery
- Added `/api/auth/reset-password` for password reset

### User Endpoints
- Changed `/api/users` to `/api/admin/users` for GET operations
- Changed `/api/users/{id}` to `/api/admin/users/{id}` for GET/PUT/DELETE operations

### Review Endpoints
- Changed `/api/reviews` to `/api/admin/reviews` for GET operations
- Added fallback mechanisms for review endpoints that may not exist in the backend yet

## Remaining Issues

1. **Review Endpoints**: The backend appears to have limited review functionality. The frontend API client now includes fallback mechanisms for these endpoints.

2. **User Profile Endpoint**: The `/api/auth/me` endpoint for getting the current user profile may need to be implemented in the backend.

3. **Error Handling**: While the API client has error handling, it could be improved with more specific error types and better recovery mechanisms.

4. **Data Transformation**: There may still be mismatches between the data structures expected by the frontend and returned by the backend.

5. **Authentication Token Storage**: The current implementation stores the token in localStorage, which has security implications. Consider using HTTP-only cookies instead.

## Next Steps

1. Implement missing backend endpoints or adjust frontend expectations
2. Add comprehensive error handling for all API calls
3. Ensure proper data validation before sending requests
4. Add loading states for API operations in the UI
5. Implement proper token refresh mechanism
6. Add unit tests for API integration