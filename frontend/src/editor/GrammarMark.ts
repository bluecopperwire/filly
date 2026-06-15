import { Mark, mergeAttributes } from '@tiptap/core';

export const GrammarMark = Mark.create({
  name: 'grammar',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      correction: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-correction'),
        renderHTML: (attributes) => {
          if (!attributes.correction) return {};
          return { 'data-correction': attributes.correction };
        },
      },
      message: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-message'),
        renderHTML: (attributes) => {
          if (!attributes.message) return {};
          return { 'data-message': attributes.message };
        },
      },
      rule: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-rule'),
        renderHTML: (attributes) => {
          if (!attributes.rule) return {};
          return { 'data-rule': attributes.rule };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-grammar]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-grammar': '',
        class: 'grammar-mark',
      }),
      0,
    ];
  },
});
