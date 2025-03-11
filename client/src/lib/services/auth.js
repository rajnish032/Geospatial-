import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user/' }), // ✅ Ensure correct base URL
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => ({
        url: 'register',
        method: 'POST',
        body: user,
        headers: { 'Content-type': 'application/json' }
      })
    }),

    verifyEmail: builder.mutation({
      query: (user) => ({
        url: `verify-email`,
        method: 'POST',
        body: user,
        headers: { 'Content-type': 'application/json' }
      })
    }),

    loginUser: builder.mutation({
      query: (user) => ({
        url: `login`,
        method: 'POST',
        body: user,
        headers: { 'Content-type': 'application/json' },
        credentials: 'include'  // ✅ Required to send authentication cookies
      }),
      transformResponse: (response) => {
        if (response.status === "success") {
          return {
            ...response,
            user: {
              ...response.user,
              isGISRegistered: response.user.isGISRegistered || false  // ✅ Ensure this value exists
            }
          };
        }
        return response;
      }
    }),

    getUser: builder.query({
      query: () => ({
        url: `me`,
        method: 'GET',
        credentials: 'include' // ✅ Ensure authentication works
      }),
      transformResponse: (response) => ({
        ...response,
        user: {
          ...response.user,
          isGISRegistered: response.user.isGISRegistered || false
        }
      })
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: `logout`,
        method: 'POST',
        credentials: 'include' // ✅ Include authentication cookies
      })
    }),

    resetPasswordLink: builder.mutation({
      query: (user) => ({
        url: 'reset-password-link',
        method: 'POST',
        body: user,
        headers: { 'Content-type': 'application/json' }
      })
    }),

    resetPassword: builder.mutation({
      query: (data) => {
        const { id, token, ...values } = data;
        return {
          url: `reset-password/${id}/${token}`, // ✅ Fixed incorrect URL formatting
          method: 'POST',
          body: values,
          headers: { 'Content-type': 'application/json' }
        };
      }
    }),

    changePassword: builder.mutation({
      query: (actualData) => ({
        url: 'change-password',
        method: 'POST',
        body: actualData,
        credentials: 'include' // ✅ Ensure authentication works
      })
    })
  })
});

// Export hooks for using the API
export const { 
  useCreateUserMutation, 
  useVerifyEmailMutation, 
  useLoginUserMutation, 
  useGetUserQuery, 
  useLogoutUserMutation, 
  useResetPasswordLinkMutation, 
  useResetPasswordMutation, 
  useChangePasswordMutation 
} = authApi;
