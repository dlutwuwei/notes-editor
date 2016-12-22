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
      text: ' ',
      type: 'atomic',
      entityRanges: [{ offset: 0, length: 1, key: 'media' }],
    },
    {
      text: ' ',
      type: 'atomic',
      entityRanges: [{ offset: 0, length: 1, key: 'youtube_video' }],
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
    youtube_video: {
      type: 'YOUTUBE_VIDEO',
      mutability: 'IMMUTABLE',
      data: {
        videoBitRate: 0,
        videoDuration: 210,
        videoHeight:720,
        videoId: "wuUGUsTmvQg",
        videoThumbnail:{
          height: 360,
          thumb_url:"f0585a4f2e11804578ba",
          uri:"f0585a4f2e11804578ba",
          width:480
        },
        videoType: "youtube",
        videoUrl: "https://www.youtube.com/watch?v=wuUGUsTmvQg",
        videoWidth:1280
      }
    }
  },
};

export var content = convertFromRaw(rawContent);
