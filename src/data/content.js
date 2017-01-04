/**
 * Copyright (c) 2013-present, Facebook, Inc. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { convertFromRaw } from 'draft-js';

var rawContent = {
  blocks: [
    {
      text: 'item1 abc',
      type: 'unordered-list-item'
    },
    {
      text: 'item1 abc',
      type: 'block-table',
      entityRanges: [{ offset: 0, length: 1, key: 'table' }],
    },
    {
      text: 'item2 abc',
      type: 'unordered-list-item'
    },
    {
      text: 'This is a Draft-based editor that supports TeX rendering.',
      type: 'unstyled',
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: (
        'Each TeX block below is represented as a DraftEntity object and ' +
        'rendered using Khan Academy\'s KaTeX library.'
      ),
      type: 'unstyled',
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: 'Click any TeX block to edit.',
      type: 'unstyled',
    },
    {
      text: ' ', // must be space not null, otherwise, entity will not create.
      type: 'atomic',
      entityRanges: [{ offset: 0, length: 1, key: 'media' }],
    },
    {
      text: ' ',
      type: 'atomic',
      entityRanges: [{ offset: 0, length: 1, key: 'youtube' }],
    },
    {
      text: 'You can also insert a new TeX block at the cursor location.',
      type: 'unstyled',
    },
  ],

  entityMap: {
    first: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE',
      data: {
        content: (
          '\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq\n' +
          '\\left( \\sum_{k=1}^n a_k^2 \\right)\n' +
          '\\left( \\sum_{k=1}^n b_k^2 \\right)'
        ),
      },
    },
    media: {
      type: 'image',
      data: {
        src: 'https://avatars1.githubusercontent.com/u/3362483?v=3&s=460'
      }
    },
    table: {
      type: 'table',
      data: {
        rows: [ [1,3,4], [2,5,6]]
      }
    },
    youtube: {
      type: 'youtube',
      mutability: 'IMMUTABLE',
      data: {
        bitRate: 0,
        duration: 210,
        height: 360,
        width: 640,
        id: "wuUGUsTmvQg",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=wuUGUsTmvQg",
      }
    },
  },
};

export var content = convertFromRaw(rawContent);
