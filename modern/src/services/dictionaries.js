import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dictionariesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "axelor-api" }),
  reducerPath: "dictionaries-api",
  endpoints: (builder) => ({
    mobileGroupStatuses: builder.mutation({
      query: () => ({
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic YWRtaW46QWRtaW4yMDIz",
        },
        url: "ws/selection/ens.mobile.group.status.select",
        method: "POST",
        body: JSON.stringify({
            translate: true
        }),
      }),
    }),
    mobileGroupCarTypes: builder.mutation({
        query: () => ({
          headers: {
              "Content-Type": "application/json",
              Authorization: "Basic YWRtaW46QWRtaW4yMDIz",
          },
          url: "ws/selection/ens.mobile.group.car.model.select",
          method: "POST",
          body: JSON.stringify({
              translate: true
          }),
        }),
    }),
  }),
});

export const { useMobileGroupCarTypesMutation, useMobileGroupStatusesMutation } = dictionariesApi;

export default dictionariesApi;
