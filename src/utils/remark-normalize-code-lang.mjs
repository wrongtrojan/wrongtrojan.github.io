export function remarkNormalizeCodeLang() {
  const aliases = {
    'c++': 'cpp',
    cxx: 'cpp',
    'c#': 'csharp',
    cs: 'csharp',
  };
  const walk = (node) => {
    if (node?.type === 'code' && typeof node.lang === 'string') {
      const lang = node.lang.trim().split(/\s+/)[0].toLowerCase();
      node.lang = aliases[lang] || lang;
    }
    if (Array.isArray(node?.children)) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}
