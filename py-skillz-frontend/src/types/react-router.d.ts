import * as React from "react";

declare module "react-router-dom" {
  interface RouteProps {
    children?: React.ReactNode;
  }
  
  interface RoutesProps {
    children: React.ReactNode;
  }
  
  export function Route(props: RouteProps): JSX.Element;
  export function Routes(props: RoutesProps): JSX.Element;
}
