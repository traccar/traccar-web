export const deviceEquality =
  (fields) =>
  (previous = {}, next = {}) => {
    if (previous === next) {
      return true;
    }

    const previousIds = Object.keys(previous);
    if (previousIds.length !== Object.keys(next).length) {
      return false;
    }

    for (const id of previousIds) {
      if (!next[id]) {
        return false;
      }

      for (const field of fields) {
        if (previous[id][field] !== next[id][field]) {
          return false;
        }
      }
    }

    return true;
  };
