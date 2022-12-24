const path = (root, sublink) => {
  return `${root}${sublink}`;
};

export const ROOTS_PATH = '/';

export const PATH_PAGE = {
  root: ROOTS_PATH,
  room: (id) => path(ROOTS_PATH, `rooms/${id}`),
};
