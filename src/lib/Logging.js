import debugLibrary from "debug";
debugLibrary.enable("FlyTouch:*");

/** Get a console logger with the given name. */
export const getLogger = (name) => {
  return debugLibrary(`FlyTouch:${name}`);
};
