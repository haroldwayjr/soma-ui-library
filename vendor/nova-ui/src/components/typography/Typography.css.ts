import { recipe } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

export const typographyRecipe = recipe({
  base: {
    margin: 0,
  },
  variants: {
    variant: {
      body1: semantics.text.body1,
      body2: semantics.text.body2,
      buttonMedium: semantics.text.buttonMedium,
      buttonSmall: semantics.text.buttonSmall,
      caption: semantics.text.caption,
      displayLarge: semantics.text.displayLarge,
      displayMedium: semantics.text.displayMedium,
      displaySmall: semantics.text.displaySmall,
      h1: semantics.text.h1,
      h2: semantics.text.h2,
      h3: semantics.text.h3,
      h4: semantics.text.h4,
      h5: semantics.text.h5,
      h6: semantics.text.h6,
      overline: {
        ...semantics.text.overline,
        textTransform: 'uppercase',
      },
      subtitle1: semantics.text.subtitle1,
      subtitle2: semantics.text.subtitle2,
      subtitle3: semantics.text.subtitle3,
    },
  },
})
