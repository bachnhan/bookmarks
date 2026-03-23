import { Bookmark, Folder } from './types';

export const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: '1',
    title: 'The Future of Generative AI in Creative Industries',
    description: 'Exploring the intersections of machine learning and human intuition in the next decade of digital design and storytelling.',
    url: 'https://economist.com/ai-creative',
    source: 'The Economist',
    faviconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp51klUarzvH7-cqaYGKGw6QygXwUSeFyzvfOdY85Z-eGFtniit9gy_1jlgoBWMYvMU4TkQk1TWQRQrkSfiC8C9ME_Hl40a-WW-i5EX3DgGLOH-aXU-f2Og-dtVh76JaeH-k5spxn72FEYcj_7X1SGX0ntJGzoVm2k--r2RUDPOkFkpNZPkO1aP3AdL8OZ_DstKKdwnaUhDxUcNSUklPx6FqbNWUNqcN_UYujN0J19my0LjctH_9VETb8tiQMuT9t9TsIcwCnTsYU',
    tags: ['Technology', 'AI'],
    addedAt: '2026-03-21',
    type: 'feature'
  },
  {
    id: '2',
    title: 'Understanding Minimalist UI',
    description: 'How white space and typography create psychological safety for users...',
    url: 'https://medium.com/design/minimalist-ui',
    source: 'Medium',
    faviconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC457qJqOHymdGiXU7jY3pqR0kEixCoosMaVOI3kN-03mCjdxaql7kXp70iDpPE65fDIYR7CZ7TC3-tjwRnrMChHs03S6oPcRp2pzJsdbuFJx6e1wmHvgpBRFSu8EynTVdqedaAzENj06wdCbeVzXpSwFEbSU3wHTtWF8VMoNSnrs6HfGUJ8UcWZN10lsVp1AupRUZHV9q-WBMCVT-0ylgL0X60djptSrYZ3TJAjqRV8D_noDNl9oTANQj9ktP308WX5DDIiRxm02M',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO8kC1uT5FyYIIWvml1xbs2a1-PY2xcGLIdATRaQj8GAtlS-tXNZVk7XXWUTz78Oy8Qk-HQbPxX914OZUmW7VNcMdXej_I7gPuB4PN7iDQ19ucNnEngeshs7gw4GPyfZSPo_u4H6WxuvXitm6KVQZJ9t-mYTl12FHqc7P36erK9SWHsK_CcwDKKHMd8jQkDZxeTnDmA-ox0Lh8dhLiQK6ABIDe7S-ZbrPZss4ZG03Cd0XYpr3dkEnJl_h3UMDPz85EtHXPXCzrgVM',
    tags: ['Design'],
    addedAt: '2026-03-22',
    type: 'medium'
  },
  {
    id: '3',
    title: 'Q3 Strategy Notes.pdf',
    description: 'Added 2 days ago',
    url: '/files/q3-strategy.pdf',
    source: 'PDF',
    tags: [],
    addedAt: '2026-03-21',
    type: 'dense'
  },
  {
    id: '4',
    title: 'Tailwind v4-alpha: The Future of CSS Engines',
    description: 'A deep dive into the rust-powered engine and why it changes everything about web performance.',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    source: 'GitHub',
    faviconUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCveXhw8OyLveEsB6QvnFjob1-ilhhszlUT6eXP8JAwQABeUqnJNNff7UdKRjVLl6w3W1OQnsTDgftjofnR9PH7FcTulvHDfTdHiB8n-SAwkW-WY6H834ivNWZZNsuTc9xRBDY6ks2EntIfzaf88DcmP3IhKmGPufSekyzac6BvOp-MDkIXUZvtBONWbtwZLfSWLCgP3nNx1PTF56T7UT-HOIF2OgsLkUWNVpElxrftm5Kty5BgmvEC9Dnze497mECBn8-ErGDyDjc',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATIp5yUNvS0O5i_MLI1X7J0xkgRwRCvhIsSwD_Xhst7O3kfoiQSPzcAthrDqB60hQEcnayydTSAs61E5DfnfIhfyfdUO100YeOyEMZpJ8iOpAD5xAnYxm_OjxG6XIp0zUEbz7XZ8ZeVYaSdTP_47iUcqxsVJmGoiPl3vJta5spMy5Jn6Dye4-O7UVrvr1tHAghOzi6eqnoDDsbZeaw7TZ5YiiE-ULvFPBh2VBxYCBipkvX7egEei3ewAW0K4x0FBw0ZWVTYy0JVEQ',
    tags: ['Dev', 'Open Source'],
    addedAt: '2026-03-23',
    type: 'detailed'
  }
];

export const MOCK_FOLDERS: Folder[] = [
  {
    id: '1',
    name: 'Design',
    description: 'Visual systems & UI',
    itemCount: 128,
    iconName: 'palette'
  },
  {
    id: '2',
    name: 'Coding',
    description: 'Snippets, documentation, and repos',
    itemCount: 244,
    iconName: 'terminal',
    bgImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiPHMqHtH91KRBiy2zIcrPkEYfLwmgu0xm_4O57zPVjYezzFCzukoKvzeinqWo_rs0xfm_vBmpmSvI3MClXvFIaTIAARcUNiZH8xh6U_EBprSfuEuwK2RRqaBzTACXq0LkGrNWlo0grErdw7Ln_iApYXNShg3ltfxx_YqdyUymupfd9J7m4cKLRE-DdsE7qI0d_m4yPUOGnvgi4kvCntq3KnBk7sTREp8BACr3hlKwqllzip6q_TZYDZEdlmBXiOCM-P8rPsZtAiE'
  },
  {
    id: '3',
    name: 'Recipes',
    description: 'Culinary experiments',
    itemCount: 42,
    iconName: 'restaurant'
  },
  {
    id: '4',
    name: 'Productivity',
    description: 'Workflow optimization',
    itemCount: 12,
    iconName: 'bolt'
  },
  {
    id: '5',
    name: 'Deep Research',
    description: 'Long-form essays and scientific papers',
    itemCount: 89,
    iconName: 'menu_book'
  }
];

export const RECENT_ADDITIONS: Bookmark[] = [
  {
    id: '5',
    title: 'The Principles of Brutalist Layouts',
    description: 'archived.design/articles/brutalism-2024',
    url: 'https://archived.design/articles/brutalism-2024',
    source: 'Design',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvVqVmNkt2-noRg-xBC-g2WUXws0DvlHJ69KfU_KwJzEg7L8a_-BbxUGAMTepQAdHYG4UCfFJR832MZ3wIzfx2HOZPXOywg5SF5kUXoMgUSgwGUBeMo-IPJVSVoqIhOf9c3FkxxIJj5_fBqEl9tj5AOFdREqpk89EV_o9AAxnC0f94vJM8jjQaHysGEUJKjj_rfAIvt1_ooseJ8nhOShpkCnMZW2deAbR1oA_1MLIxb4gJHBUYm9gqXdAlEH0dX8VLYhZGlQ242J8',
    tags: ['Design', '2 days ago'],
    addedAt: '2026-03-21',
    type: 'medium'
  },
  {
    id: '6',
    title: 'Refactoring Legacy JavaScript',
    description: 'dev-insights.io/js/patterns',
    url: 'https://dev-insights.io/js/patterns',
    source: 'Code',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3eXKnvF50j6mZm3iRioAP_6UATDRtGTYCDGhJRbQ9pmDzBVqL07aeG3rxpzdL89T09iJZ4f3_qkIFAM5yEwEulsSRdmDjjxJPfLK7gr9-7M8zwDa-p1ygIX9HSWtZUFs7WYJyGZDOR9hROBDqQ3tgvBu0lYuCO3uGgODpodjKxiU43AbLaQvyxVlbWTQ8t3FW74dXtckwiIJiCajHYzXUsp9FIgddetmGqct3XLDuWPlp0rPw6uEzzJF82rLjCW1XWRfcnQQo4SQ',
    tags: ['Code', 'May 12'],
    addedAt: '2026-05-12',
    type: 'medium'
  },
  {
    id: '7',
    title: 'Meditations on Digital Stoicism',
    description: 'philosophy-today.com/essays/stoicism',
    url: 'https://philosophy-today.com/essays/stoicism',
    source: 'Theory',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc_h4AHjIXGSPv13Yk6fgnog4bbcvP4hQfNP0EzG5YSUhENPISV1_fLOwPbAEVKYbm9Q_QJO0DRtE-zZGp9pUT-_GvcUPnK9QQJvFC29YBUlv7gcnPRC_w45ZLgCSYA_DRjrO1xWJgGBo8iFMM4O_cmCwJacl3LQpR1hf0fZXEWDc2LCMJBpFM-ZeY_VK00pDf5MdO7B_XoEAtGnEPqu_-vlLQ2tagrJGDiOLaAAjRSiT-3jKhrhGAiKL5H63apYCDIL0SM6Eruzc',
    tags: ['Theory', 'May 10'],
    addedAt: '2026-05-10',
    type: 'medium'
  },
  {
    id: '8',
    title: 'Lighting Trends in Interior Architecture',
    description: 'dwell.com/interior/modern-lighting-2024',
    url: 'https://dwell.com/interior/modern-lighting-2024',
    source: 'Interior',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu0d-kCLnCIBkMY-Ujd46qo8jlPjC_6-whiZWQ3lB3hE8F7i4N8EglhPXahDd-hp63Wl19-6Va1ghG_IKvcPLnv2AK4HOccz4n95grMT6ZIlfpUv63oGjgFYtXIgjRX0egIZkHOs7CRViXxofI48vkIzjug7PmtjqTjs6bVicqtP6rcmn62UR7w_zRvMjRSR9DlZf-l-fZ5qvT3ZrJjccbYa3YmOBfvaKkMgj6p6IKRfG5YU3BwqCao0kyIv0YIHawnn1P3TkPioo',
    tags: ['Interior', 'May 08'],
    addedAt: '2026-05-08',
    type: 'medium'
  }
];
