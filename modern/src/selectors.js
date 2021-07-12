export const getIsAdmin = (state) => state.session.user?.administrator;

export const getUserId = (state) => state.session.user?.id;
