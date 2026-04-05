export type Styles = {
  drawer: string;
  head1: string;
  head2: string;
  name: string;
  navbar: string;
  sub: string;
};

export type ClassesType = keyof Styles;

declare const styles: Styles;

export default styles;
