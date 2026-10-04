import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Kaleiopi UI',
    brandUrl: 'https://kaleiopi.app',
    colorPrimary: '#6245A1',
    colorSecondary: '#6245A1',
    textColor: '#02154C',
  }),
});
