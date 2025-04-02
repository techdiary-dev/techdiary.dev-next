import React from "react";

export function useToggle(initialState = false) {
  const [state, setState] = React.useState(initialState);
  const toggle = React.useCallback(() => setState((s) => !s), []);
  return [state, toggle] as const;
}
