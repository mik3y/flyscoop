import debugLibrary from 'debug';

debugLibrary.enable('FlyScoop:*');

/** Get a console logger with the given name. */
export const getLogger = (name) => {
  return debugLibrary(`FlyScoop:${name}`);
};
