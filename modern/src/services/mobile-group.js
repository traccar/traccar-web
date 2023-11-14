import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const mobileGroupApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "axelor-api" }),
  reducerPath: "mobile-group",
  endpoints: (builder) => ({
    mobileGroupPositions: builder.mutation({
      query: () => ({
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic YWRtaW46QWRtaW4yMDIz",
        },
        url: "ws/rest/com.axelor.apps.ens.db.MobileGroupPosition/search",
        method: "POST",
        body: JSON.stringify({
            offset: 0,
            limit: 500,
            fields: [
              "mobileGroup.groupNumber",                          //номер группы
              "mobileGroup.groupStatus",                          //статус группы
              "mobileGroup.groupInspector.fullName",              //старший инспектор
              "mobileGroup.groupInspector.mobilePhone",           //номер телефона
              "mobileGroup.groupInspector.jobTitleFunction.name",  //должность
              "latitude",
              "longitude",
            ],
            data: {
              criteria: [
                {
                  fieldName: "mobileGroup.groupNumber",
                  operator: "=",
                  value: "005", 
                },
              ],
            }
        }),
      }),
    }),
  }),
});

export const { useMobileGroupPositionsMutation } = mobileGroupApi;

export default mobileGroupApi;
