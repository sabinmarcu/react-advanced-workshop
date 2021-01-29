import { styled, withTheme } from '@material-ui/core';
import {
  Link,
} from 'react-router-dom';

export const RouterLink = withTheme(
  styled(Link)(
    ({
      theme: {
        palette: {
          common: {
            white,
          },
        },
      },
    }) => ({
      color: white,
      textDecoration: 'none',
    }),
  ),
);
