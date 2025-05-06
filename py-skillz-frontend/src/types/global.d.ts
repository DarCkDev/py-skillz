declare module '@/*';


declare namespace React {
  type ReactNodeArray = Array<ReactNode>;
  
  type ReactText = string | number;
  type ReactChild = ReactElement | ReactText;
  
  interface ReactPortal {
    key: string | null;
    children: ReactNode;
  }
  
  type ReactFragment = ReactNodeArray;
  type ReactNode = 
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;
}
