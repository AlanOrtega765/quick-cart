export default defineAppConfig({
  ui: {
    button: {
      default: {
        color: 'black',
      },
    },
    input: {
      default: {
        color: 'black',
      },
      color: {
        black: {
          outline:
            'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-primary-400',
        },
      },
    },
  },
});
