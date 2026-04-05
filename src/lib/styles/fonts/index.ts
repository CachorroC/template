import { Raleway,
  Playfair_Display,
  Josefin_Sans,
  PT_Serif_Caption,
  Radio_Canada,
  Lora, } from 'next/font/google';

const playDisp = Playfair_Display(
  {
    subsets: [
      'latin-ext',
      'latin'
    ],
    preload : true,
    variable: '--play-display',
    weight  : 'variable',
  }
);

const lora = Lora(
  {
    subsets: [
      'latin-ext',
      'latin'
    ],
    preload : true,
    variable: '--lora-font',
    weight  : 'variable',
  }
);

const ptserif = PT_Serif_Caption(
  {
    subsets: [
      'latin'
    ],
    display : 'auto',
    preload : false,
    variable: '--ptserif',
    weight  : '400',
  }
);

const josefina = Josefin_Sans(
  {
    subsets: [
      'latin'
    ],
    preload : false,
    variable: '--josefa',
    weight  : 'variable',
  }
);

const radio = Radio_Canada(
  {
    subsets: [
      'latin-ext'
    ],
    preload : false,
    variable: '--radio',
  }
);

const raleway = Raleway(
  {
    subsets: [
      'latin'
    ],
    preload : true,
    variable: '--raleway',
  }
);

export {
  playDisp, ptserif, josefina, radio, raleway, lora
};
