export const site = {
  title: '木马',
  description: '个人博客',
  author: '木马',
  email: 'wrongtrojan0@gmail.com',
  github: 'https://github.com/wrongtrojan',
  repository: 'https://github.com/wrongtrojan/wrongtrojan.github.io',
};

export const nav: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about/' },
  {
    label: '笔记',
    href: '/note/',
    children: [
      { label: '计算机科学', href: '/note/computerscience/' },
      { label: '数学', href: '/note/mathematics/' },
      { label: '其他', href: '/note/others/' },
    ],
  },
  {
    label: '创作',
    href: '/create/',
    children: [
      { label: '小说', href: '/create/novel/' },
    ],
  },
];
