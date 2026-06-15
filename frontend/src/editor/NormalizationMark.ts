import { Mark, mergeAttributes } from '@tiptap/core';

export const NormalizationMark = Mark.create({
  name: 'normalization',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      suggestion: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggestion'),
        renderHTML: (attributes) => {
          if (!attributes.suggestion) return {};
          return { 'data-suggestion': attributes.suggestion };
        },
      },
      word: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-word'),
        renderHTML: (attributes) => {
          if (!attributes.word) return {};
          return { 'data-word': attributes.word };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-normalization]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-normalization': '',
        class: 'normalization-mark',
      }),
      0,
    ];
  },
});
