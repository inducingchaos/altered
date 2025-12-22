/**
 * Operation adapter context.
 */

import React from "react";

export type OperationAdapterContext = {
  state: {
    reset: () => void;
    navigateInterface?: (
      index: number,
      action: "push" | "pop" | "replace",
    ) => void;
    pushHistory?: (component: React.ReactElement, id?: string) => void;
    popHistory?: () => void;
    replaceHistory?: (component: React.ReactElement, id?: string) => void;
  };
};
