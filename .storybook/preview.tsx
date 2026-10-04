import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: {
      options: {
        white: { name: 'White', value: '#FFFFFF' },
        page: { name: 'Page (gray-50)', value: '#F9FAFB' },
      },
    },
    a11y: { test: 'error' },
    options: { storySort: { order: ['Introduction', 'Foundations', 'Components'] } },
  },
  initialGlobals: { backgrounds: { value: 'page' } },
};

export default preview;
