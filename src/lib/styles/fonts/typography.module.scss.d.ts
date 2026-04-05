export type Styles = {
  bodyLarge: string;
  bodyMedium: string;
  bodySmall: string;
  displayLarge: string;
  displayMedium: string;
  displaySmall: string;
  headlineLarge: string;
  headlineMedium: string;
  headlineSmall: string;
  labelLarge: string;
  labelMedium: string;
  labelSmall: string;
  titleLarge: string;
  titleMedium: string;
  titleSmall: string;
};

export type ClassesType = keyof Styles;

declare const styles: Styles;

export default styles;
