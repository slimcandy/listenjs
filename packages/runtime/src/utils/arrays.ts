import { Children } from "../create-element";

export function withoutNulls(children: Children): Children {
  return children.filter((child) => child != null);
}
